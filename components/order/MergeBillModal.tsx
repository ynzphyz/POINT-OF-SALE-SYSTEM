"use client";

import { useState, useMemo } from "react";
import { X, Search, AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Order } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { canMergeOrders, calculateMergedTotal } from "@/lib/order-utils";

interface MergeBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: {
    id: string;
    orderNumber: string;
    tableName?: string;
    customerName?: string;
    items: any[];
    total: number;
  };
  availableOrders: Order[];
  onMerge: (targetOrderId: string) => void;
}

export function MergeBillModal({
  isOpen,
  onClose,
  currentOrder,
  availableOrders,
  onMerge,
}: MergeBillModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Filter available orders - MUST be before conditional return
  const filteredOrders = useMemo(() => {
    return availableOrders.filter((order) => {
      // Exclude current order
      if (order.id === currentOrder.id) return false;

      // Only show in_progress or waiting_payment orders
      if (order.status !== "in_progress" && order.status !== "waiting_payment") {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName?.toLowerCase().includes(query) ||
          order.tableName?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [availableOrders, currentOrder.id, searchQuery]);

  const selectedOrder = filteredOrders.find((o) => o.id === selectedOrderId);

  // Calculate merged preview - MUST be before conditional return
  const mergedPreview = useMemo(() => {
    if (!selectedOrder) return null;

    const totalItems = currentOrder.items.length + selectedOrder.items.length;
    const totalAmount = currentOrder.total + selectedOrder.total;

    return {
      itemCount: totalItems,
      total: totalAmount,
    };
  }, [currentOrder, selectedOrder]);

  // Conditional return AFTER all hooks
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleProceedToConfirm = () => {
    if (!selectedOrderId) return;
    setShowConfirmation(true);
  };

  const handleConfirmMerge = () => {
    if (!selectedOrderId) return;
    onMerge(selectedOrderId);
    onClose();
  };

  const handleBackToSelection = () => {
    setShowConfirmation(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Gabung Bill</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {!showConfirmation ? (
          <>
            {/* Current Order Info */}
            <div className="p-6 bg-primary/5 border-b border-primary/20">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Order Saat Ini
              </p>
              <div className="bg-white rounded-xl p-4 border-2 border-primary">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {currentOrder.orderNumber}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      {currentOrder.tableName && (
                        <span>{currentOrder.tableName}</span>
                      )}
                      {currentOrder.customerName && (
                        <>
                          <span>•</span>
                          <span>{currentOrder.customerName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {currentOrder.items.length} items
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(currentOrder.total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Order List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Order untuk Digabung
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari order number, customer, atau meja..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Tidak ada order yang tersedia untuk digabung</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrderId === order.id;
                    return (
                      <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order.id)}
                        className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                          isSelected
                            ? "bg-primary/5 border-primary"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              {order.tableName && <span>{order.tableName}</span>}
                              {order.customerName && (
                                <>
                                  <span>•</span>
                                  <span>{order.customerName}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>{order.cashierName}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm text-gray-600">
                              {order.items.length} items
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Preview */}
            {selectedOrder && mergedPreview && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Preview Penggabungan:
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {currentOrder.orderNumber}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">
                        {mergedPreview.itemCount} items total
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(mergedPreview.total)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToConfirm}
                  className="w-full h-12 text-base font-semibold shadow-lg"
                >
                  Lanjut ke Konfirmasi
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Confirmation Screen */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-primary" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Konfirmasi Penggabungan Bill
              </h3>
              <p className="text-center text-gray-600 text-sm mb-6">
                Pastikan data sudah benar sebelum menggabungkan
              </p>

              {/* Merge Details */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border-2 border-primary">
                  <p className="text-xs text-gray-600 mb-1">Order Utama (Primary)</p>
                  <h4 className="font-bold text-lg text-gray-900">
                    {currentOrder.orderNumber}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentOrder.tableName} • {currentOrder.items.length} items •{" "}
                    {formatCurrency(currentOrder.total)}
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">
                    Order Digabung (Secondary)
                  </p>
                  <h4 className="font-bold text-lg text-gray-900">
                    {selectedOrder?.orderNumber}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedOrder?.tableName} • {selectedOrder?.items.length} items •{" "}
                    {formatCurrency(selectedOrder?.total || 0)}
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary">
                  <p className="text-xs text-primary mb-1">Hasil Penggabungan</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {currentOrder.orderNumber}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {mergedPreview?.itemCount} items total
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(mergedPreview?.total || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  Catatan Penting:
                </p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• Order {selectedOrder?.orderNumber} akan dibatalkan</li>
                  <li>
                    • Meja {selectedOrder?.tableName} akan menjadi tersedia
                  </li>
                  <li>
                    • Semua item digabung ke order {currentOrder.orderNumber}
                  </li>
                  <li>• Aksi ini tidak dapat dibatalkan</li>
                </ul>
              </div>
            </div>

            {/* Confirmation Footer */}
            <div className="p-6 border-t border-gray-200 space-y-2">
              <Button
                onClick={handleConfirmMerge}
                className="w-full h-12 text-base font-semibold shadow-lg"
              >
                Gabung Sekarang
              </Button>
              <Button
                onClick={handleBackToSelection}
                variant="outline"
                className="w-full h-12 text-base font-semibold"
              >
                Kembali
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
