"use client";

import { TrendingUp, ShoppingBag, DollarSign, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  // Mock data
  const stats = {
    totalSales: 15750000,
    totalOrders: 245,
    avgOrder: 64285,
    bestSeller: "Beef Rendang",
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Reports</h1>
        <p className="text-gray-600">Sales analytics and insights</p>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2 mb-6">
        {["Today", "Week", "Month", "Custom"].map((period) => (
          <button
            key={period}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors"
          >
            {period}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Sales</span>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</p>
          <p className="text-sm text-success mt-1">+12.5% from last period</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Orders</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-sm text-success mt-1">+8.3% from last period</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Average Order</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(stats.avgOrder)}</p>
          <p className="text-sm text-success mt-1">+5.2% from last period</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Best Seller</span>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xl font-bold">{stats.bestSeller}</p>
          <p className="text-sm text-gray-500 mt-1">85 orders</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Sales Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Category Breakdown</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
