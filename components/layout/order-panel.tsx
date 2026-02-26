"use client";

import { useState } from "react";
import { Plus, Minus, X, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { OrderItem } from "@/lib/types";

interface OrderPanelProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateDiscount: (itemId: string, discount: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAddCustomer: () => void;
  onProceed: () => void;
  onHoldOrder: () => void;
  customerName?: string;
}

export function OrderPanel({
  items,
  onUpdateQuantity,
  onUpdateDiscount,
  onRemoveItem,
  onAddCustomer,
  onProceed,
  onHoldOrder,
  customerName,
}: OrderPanelProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<"add" | "discount" | "coupon" | "note">("add");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity - item.discount,
    0
  );
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  return (
    <div className="fixed right-0 top-0 h-screen w-[350px] bg-white border-l border-gray-200 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <Button
            onClick={onAddCustomer}
            variant="outline"
            size="sm"
            className="flex-1 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {customerName || "Add Customer"}
          </Button>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-2" />
            <p className="text-sm">No items in order</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-gray-500 text-sm font-medium">{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          {item.notes && (
                            <p className="text-xs text-gray-500 italic mt-0.5">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-danger flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-medium text-sm">
                            {formatCurrency(item.price)}
                          </span>
                          <span className="text-gray-400 text-xs">×</span>
                          <span className="text-gray-700 font-semibold text-sm">
                            {item.quantity}
                          </span>
                        </div>
                        <span className="text-gray-900 font-bold text-sm">
                          {formatCurrency(item.price * item.quantity - item.discount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 text-sm invisible">{index + 1}</span>
                    <div className="flex-1">
                      <button
                        onClick={() =>
                          setExpandedItem(expandedItem === item.id ? null : item.id)
                        }
                        className="text-xs text-primary hover:underline"
                      >
                        {expandedItem === item.id ? "Hide" : "Edit"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Controls */}
                {expandedItem === item.id && (
                  <div className="mt-3 space-y-2 pl-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-20">Quantity</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="w-7 h-7 rounded bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-20">Discount(%)</span>
                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          onUpdateDiscount(item.id, Number(e.target.value))
                        }
                        className="h-7 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4 text-sm">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-2 ${
              activeTab === "add"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
          >
            Add
          </button>
          <button
            onClick={() => setActiveTab("discount")}
            className={`flex-1 py-2 ${
              activeTab === "discount"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
          >
            Discount
          </button>
          <button
            onClick={() => setActiveTab("coupon")}
            className={`flex-1 py-2 ${
              activeTab === "coupon"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
          >
            Coupon
          </button>
          <button
            onClick={() => setActiveTab("note")}
            className={`flex-1 py-2 ${
              activeTab === "note"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
          >
            Note
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (11%)</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Payable Amount</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onHoldOrder}
            variant="outline"
            className="flex-1"
            disabled={items.length === 0}
          >
            Hold Order
          </Button>
          <Button
            onClick={onProceed}
            className="flex-1"
            disabled={items.length === 0}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
