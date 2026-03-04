"use client";

import { useState, useMemo } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderItem, SplitPerson } from "@/lib/types";
import {
  formatCurrency,
  generateSplitPersonId,
  formatSplitLabel,
  getPersonBgColor,
  getPersonTextColor,
  getPersonBorderColor,
  formatQuantity,
} from "@/lib/utils";

interface SplitByItemTabProps {
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onProceed: (splits: SplitPerson[]) => void;
}

interface Person {
  id: string;
  label: string;
  index: number;
}

export function SplitByItemTab({
  orderItems,
  subtotal,
  tax,
  total,
  onProceed,
}: SplitByItemTabProps) {
  const [people, setPeople] = useState<Person[]>([
    { id: generateSplitPersonId(), label: formatSplitLabel(0), index: 0 },
    { id: generateSplitPersonId(), label: formatSplitLabel(1), index: 1 },
  ]);

  // Track which people are assigned to each item
  // Map<itemId, Set<personId>>
  const [itemAssignments, setItemAssignments] = useState<Map<string, Set<string>>>(
    new Map()
  );

  const handleAddPerson = () => {
    if (people.length < 10) {
      const newIndex = people.length;
      setPeople([
        ...people,
        {
          id: generateSplitPersonId(),
          label: formatSplitLabel(newIndex),
          index: newIndex,
        },
      ]);
    }
  };

  const handleRemovePerson = (personId: string) => {
    if (people.length > 2) {
      // Remove person
      const updatedPeople = people.filter((p) => p.id !== personId);
      
      // Re-index remaining people
      const reindexedPeople = updatedPeople.map((p, idx) => ({
        ...p,
        label: formatSplitLabel(idx),
        index: idx,
      }));
      
      setPeople(reindexedPeople);

      // Remove person from all item assignments
      const newAssignments = new Map(itemAssignments);
      newAssignments.forEach((personSet) => {
        personSet.delete(personId);
      });
      setItemAssignments(newAssignments);
    }
  };

  const handleToggleAssignment = (itemId: string, personId: string) => {
    const newAssignments = new Map(itemAssignments);
    const currentSet = newAssignments.get(itemId) || new Set<string>();
    
    if (currentSet.has(personId)) {
      currentSet.delete(personId);
    } else {
      currentSet.add(personId);
    }
    
    newAssignments.set(itemId, currentSet);
    setItemAssignments(newAssignments);
  };

  // Calculate per-person totals
  const personTotals = useMemo(() => {
    const totals = new Map<string, { items: OrderItem[]; subtotal: number }>();

    people.forEach((person) => {
      totals.set(person.id, { items: [], subtotal: 0 });
    });

    orderItems.forEach((item) => {
      const assignedPeople = itemAssignments.get(item.id);
      if (assignedPeople && assignedPeople.size > 0) {
        const itemTotal = item.price * item.quantity - item.discount;
        const splitAmount = itemTotal / assignedPeople.size;

        assignedPeople.forEach((personId) => {
          const personData = totals.get(personId);
          if (personData) {
            personData.items.push(item);
            personData.subtotal += splitAmount;
          }
        });
      }
    });

    return totals;
  }, [people, orderItems, itemAssignments]);

  // Calculate unassigned items
  const unassignedItems = orderItems.filter((item) => {
    const assigned = itemAssignments.get(item.id);
    return !assigned || assigned.size === 0;
  });

  const handleProceed = () => {
    if (unassignedItems.length > 0) {
      return; // Don't proceed if there are unassigned items
    }

    const splits: SplitPerson[] = people.map((person) => {
      const personData = personTotals.get(person.id)!;
      const personSubtotal = personData.subtotal;
      const personTax = Math.round((personSubtotal / subtotal) * tax);
      const personTotal = Math.round(personSubtotal + personTax);

      return {
        id: person.id,
        label: person.label,
        amount: personTotal,
        items: personData.items,
        isPaid: false,
      };
    });

    onProceed(splits);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Person Management */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            Orang ({people.length})
          </label>
          <button
            onClick={handleAddPerson}
            disabled={people.length >= 10}
            className="flex items-center gap-2 px-4 h-10 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Orang
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {people.map((person) => (
            <div
              key={person.id}
              className={`flex items-center gap-2 px-4 h-10 rounded-lg border-2 ${getPersonBgColor(
                person.index
              )} ${getPersonBorderColor(person.index)} ${getPersonTextColor(
                person.index
              )}`}
            >
              <span className="font-semibold text-sm">{person.label}</span>
              {people.length > 2 && (
                <button
                  onClick={() => handleRemovePerson(person.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Unassigned Items Warning */}
      {unassignedItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 text-sm">
              {unassignedItems.length} item belum diassign
            </p>
            <p className="text-red-700 text-xs mt-1">
              Assign semua item ke orang sebelum melanjutkan
            </p>
          </div>
        </div>
      )}

      {/* Item Assignment List */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Assign Item ke Orang
        </label>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {orderItems.map((item) => {
            const assignedPeople = itemAssignments.get(item.id) || new Set();
            const isUnassigned = assignedPeople.size === 0;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg p-4 border-2 transition-colors ${
                  isUnassigned
                    ? "border-red-200 bg-red-50/50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(item.price)} × {formatQuantity(item.quantity)} ={" "}
                      {formatCurrency(
                        Math.round(item.price * item.quantity - item.discount)
                      )}
                    </p>
                  </div>
                  {assignedPeople.size > 1 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                      Split {assignedPeople.size}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {people.map((person) => {
                    const isAssigned = assignedPeople.has(person.id);
                    return (
                      <button
                        key={person.id}
                        onClick={() => handleToggleAssignment(item.id, person.id)}
                        className={`px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                          isAssigned
                            ? `${getPersonBgColor(person.index)} ${getPersonTextColor(
                                person.index
                              )} border-2 ${getPersonBorderColor(person.index)}`
                            : "bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300"
                        }`}
                      >
                        {person.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Person Summary */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Ringkasan per Orang
        </label>
        <div className="space-y-2">
          {people.map((person) => {
            const personData = personTotals.get(person.id)!;
            const personSubtotal = personData.subtotal;
            const personTax = Math.round((personSubtotal / subtotal) * tax);
            const personTotal = Math.round(personSubtotal + personTax);

            return (
              <div
                key={person.id}
                className={`rounded-lg p-4 border-2 ${getPersonBgColor(
                  person.index
                )} ${getPersonBorderColor(person.index)}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`font-semibold ${getPersonTextColor(person.index)}`}
                  >
                    {person.label}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(personTotal)}
                  </span>
                </div>
                {personData.items.length > 0 && (
                  <p className="text-xs text-gray-600">
                    {personData.items.length} item
                    {personData.items.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Proceed Button */}
      <Button
        onClick={handleProceed}
        disabled={unassignedItems.length > 0}
        className="w-full h-12 text-base font-semibold shadow-lg"
      >
        Lanjut ke Pembayaran
        {unassignedItems.length > 0 && ` (${unassignedItems.length} item belum diassign)`}
      </Button>
    </div>
  );
}
