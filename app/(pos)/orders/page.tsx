"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { orders } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusFilters: (OrderStatus | "all")[] = [
  "all",
  "in_progress",
  "ready_to_serve",
  "waiting_payment",
  "completed",
];

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Orders</h1>
        <p className="text-gray-600">View and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                selectedStatus === status
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              {status === "all" ? "All" : status.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-6">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                  <StatusBadge status={order.type} type="orderType" />
                  <StatusBadge status={order.status} type="order" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {order.tableName && <span>{order.tableName}</span>}
                  {order.customerName && <span>• {order.customerName}</span>}
                  <span>• {formatDateTime(order.createdAt)}</span>
                  <span>• {order.cashierName}</span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  {order.items.length} item(s)
                </p>
                <div className="text-sm text-gray-500">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <span key={idx}>
                      {item.quantity}x {item.name}
                      {idx < Math.min(order.items.length, 2) - 1 && ", "}
                    </span>
                  ))}
                  {order.items.length > 2 && ` +${order.items.length - 2} more`}
                </div>
              </div>

              {/* Total & Actions */}
              <div className="text-right">
                <p className="text-2xl font-bold text-primary mb-2">
                  {formatCurrency(order.total)}
                </p>
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
}
