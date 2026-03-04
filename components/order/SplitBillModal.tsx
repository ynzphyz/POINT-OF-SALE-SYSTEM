"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { OrderItem, SplitPerson } from "@/lib/types";
import { SplitByAmountTab } from "./SplitByAmountTab";
import { SplitByItemTab } from "./SplitByItemTab";

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onProceedToPayment: (splits: SplitPerson[], mode: "amount" | "item") => void;
}

export function SplitBillModal({
  isOpen,
  onClose,
  orderItems,
  subtotal,
  tax,
  total,
  onProceedToPayment,
}: SplitBillModalProps) {
  const [activeTab, setActiveTab] = useState<"amount" | "item">("amount");

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Split Bill</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab("amount")}
            className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
              activeTab === "amount"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bagi Rata
            {activeTab === "amount" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("item")}
            className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
              activeTab === "item"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bagi per Item
            {activeTab === "item" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "amount" ? (
            <SplitByAmountTab
              total={total}
              onProceed={(splits: SplitPerson[]) => onProceedToPayment(splits, "amount")}
            />
          ) : (
            <SplitByItemTab
              orderItems={orderItems}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onProceed={(splits: SplitPerson[]) => onProceedToPayment(splits, "item")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
