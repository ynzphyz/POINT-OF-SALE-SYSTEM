"use client";

import { Table } from "@/lib/types";
import { X, Clock, Users, ShoppingBag, Receipt, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface TableDetailsModalProps {
  table: Table;
  onClose: () => void;
}

export function TableDetailsModal({ table, onClose }: TableDetailsModalProps) {
  // Mock order data - in real app, fetch from orders by activeOrderId
  const mockOrder = {
    id: table.activeOrderId || "",
    orderNumber: "ORD-002",
    itemsCount: 3,
    total: 125000,
    timeSince: "45m",
  };

  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    return `${hours} jam ${minutes % 60} menit`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold">Meja {table.name}</h2>
            <p className="text-gray-600 text-sm">{table.section}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{table.customerName}</p>
                <p className="text-sm text-gray-600">Kapasitas: {table.capacity} orang</p>
              </div>
            </div>
            {table.seatedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Duduk sejak {getTimeSince(table.seatedAt)} yang lalu</span>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Order #{mockOrder.orderNumber}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jumlah Item</span>
                <span className="font-medium">{mockOrder.itemsCount} item</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-primary">{formatCurrency(mockOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <Button className="w-full" size="lg">
            <Receipt className="w-4 h-4 mr-2" />
            Lihat Order Detail
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tambah Item
            </Button>
            <Button variant="outline" className="w-full">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Pindah Meja
            </Button>
          </div>
          <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
            <Receipt className="w-4 h-4 mr-2" />
            Cetak Bill
          </Button>
        </div>
      </div>
    </div>
  );
}
