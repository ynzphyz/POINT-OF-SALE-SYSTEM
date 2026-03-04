"use client";

import { useState } from "react";
import { X, Check, CreditCard, Smartphone, Banknote, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SplitPerson, PaymentMethod } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface SplitPaymentScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  splits: SplitPerson[];
  orderNumber: string;
  onComplete: (completedSplits: SplitPerson[]) => void;
}

export function SplitPaymentScreen({
  isOpen,
  onClose,
  onBack,
  splits: initialSplits,
  orderNumber,
  onComplete,
}: SplitPaymentScreenProps) {
  const [splits, setSplits] = useState<SplitPerson[]>(initialSplits);

  if (!isOpen) return null;

  const paidCount = splits.filter((s) => s.isPaid).length;
  const totalCount = splits.length;
  const allPaid = paidCount === totalCount;
  const progressPercentage = (paidCount / totalCount) * 100;

  const handlePaymentMethodChange = (personId: string, method: PaymentMethod) => {
    setSplits(
      splits.map((split) =>
        split.id === personId ? { ...split, paymentMethod: method } : split
      )
    );
  };

  const handleProcessPayment = (personId: string) => {
    setSplits(
      splits.map((split) =>
        split.id === personId
          ? { ...split, isPaid: true, paidAt: new Date() }
          : split
      )
    );
  };

  const handleComplete = () => {
    onComplete(splits);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // Don't allow closing by clicking backdrop during payment
    }
  };

  const paymentMethods: { value: PaymentMethod; label: string; icon: any }[] = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "qris", label: "QRIS", icon: Smartphone },
    { value: "debit", label: "Debit", icon: CreditCard },
    { value: "transfer", label: "Transfer", icon: Building2 },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Split Payment</h2>
              <p className="text-sm text-gray-600 mt-1">Order {orderNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="px-4 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress Pembayaran
              </span>
              <span className="text-sm font-semibold text-primary">
                {paidCount} dari {totalCount} sudah bayar
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Payment Cards */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {splits.map((split, index) => (
              <div
                key={split.id}
                className={`rounded-xl p-5 border-2 transition-all ${
                  split.isPaid
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Person Label & Amount */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {split.label}
                    </h3>
                    {split.items && split.items.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {split.items.length} item
                        {split.items.length > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(split.amount)}
                    </p>
                  </div>
                </div>

                {/* Payment Method Selector */}
                {!split.isPaid && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = split.paymentMethod === method.value;
                        return (
                          <button
                            key={method.value}
                            onClick={() =>
                              handlePaymentMethodChange(split.id, method.value)
                            }
                            className={`flex items-center justify-center gap-2 h-10 rounded-lg border-2 text-sm font-medium transition-all ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {method.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="mb-4">
                  {split.isPaid ? (
                    <div className="flex items-center gap-2 px-3 h-10 bg-green-100 text-green-700 rounded-lg">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold text-sm">Sudah Bayar</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 h-10 bg-red-100 text-red-700 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="font-semibold text-sm">Belum Bayar</span>
                    </div>
                  )}
                </div>

                {/* Process Payment Button */}
                {!split.isPaid && (
                  <Button
                    onClick={() => handleProcessPayment(split.id)}
                    disabled={!split.paymentMethod}
                    className="w-full h-12 font-semibold"
                  >
                    Proses Bayar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Keseluruhan</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(splits.reduce((sum, s) => sum + s.amount, 0))}
              </p>
            </div>
            <Button
              onClick={handleComplete}
              disabled={!allPaid}
              className="px-8 h-12 text-base font-semibold shadow-lg"
            >
              Selesai
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
