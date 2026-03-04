"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SplitPerson } from "@/lib/types";
import { formatCurrency, generateSplitPersonId, formatSplitLabel } from "@/lib/utils";

interface SplitByAmountTabProps {
  total: number;
  onProceed: (splits: SplitPerson[]) => void;
}

export function SplitByAmountTab({ total, onProceed }: SplitByAmountTabProps) {
  const [numPeople, setNumPeople] = useState(2);

  const handleIncrement = () => {
    if (numPeople < 10) {
      setNumPeople(numPeople + 1);
    }
  };

  const handleDecrement = () => {
    if (numPeople > 2) {
      setNumPeople(numPeople - 1);
    }
  };

  // Calculate split amounts
  const baseAmount = Math.floor(total / numPeople);
  const remainder = total % numPeople;
  const firstPersonAmount = baseAmount + remainder;

  const handleProceed = () => {
    const splits: SplitPerson[] = [];

    for (let i = 0; i < numPeople; i++) {
      splits.push({
        id: generateSplitPersonId(),
        label: formatSplitLabel(i),
        amount: i === 0 ? firstPersonAmount : baseAmount,
        isPaid: false,
      });
    }

    onProceed(splits);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Total Tagihan */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <p className="text-sm text-gray-600 mb-2">Total Tagihan</p>
        <p className="text-4xl font-bold text-primary">{formatCurrency(total)}</p>
      </div>

      {/* Jumlah Orang */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Jumlah Orang
        </label>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleDecrement}
            disabled={numPeople <= 2}
            className="w-14 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Minus className="w-6 h-6" />
          </button>

          <div className="w-24 h-14 rounded-xl bg-white border-2 border-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{numPeople}</span>
          </div>

          <button
            onClick={handleIncrement}
            disabled={numPeople >= 10}
            className="w-14 h-14 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Live Calculation */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Masing-masing membayar:</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(baseAmount)}
          </span>
        </div>

        {remainder > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Orang pertama</span> membayar{" "}
                <span className="font-semibold text-primary">
                  {formatCurrency(remainder)}
                </span>{" "}
                lebih (pembulatan)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Rincian Pembayaran:</p>
        <div className="space-y-2">
          {Array.from({ length: numPeople }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-600">{formatSplitLabel(index)}</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(index === 0 ? firstPersonAmount : baseAmount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <Button
        onClick={handleProceed}
        className="w-full h-12 text-base font-semibold shadow-lg"
      >
        Lanjut ke Pembayaran
      </Button>
    </div>
  );
}
