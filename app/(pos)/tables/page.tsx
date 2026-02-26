"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { tables } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

const sections = ["All", "Section A", "Section B", "Terrace"];

export default function TablesPage() {
  const [selectedSection, setSelectedSection] = useState("All");

  const filteredTables = tables.filter(
    (table) => selectedSection === "All" || table.section === selectedSection
  );

  const getStatusDot = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success";
      case "occupied":
        return "bg-danger";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tables</h1>
        <p className="text-gray-600">Manage restaurant tables and seating</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedSection === section
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <button
            key={table.id}
            className={cn(
              "bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left relative",
              table.status === "occupied" && "ring-2 ring-danger/20",
              table.status === "reserved" && "ring-2 ring-yellow-500/20"
            )}
          >
            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              <div className={cn("w-3 h-3 rounded-full", getStatusDot(table.status))} />
            </div>

            {/* Table Number */}
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-gray-700">
                  {table.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">Table {table.number}</h3>
              <p className="text-sm text-gray-500">{table.section}</p>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Users className="w-4 h-4" />
              <span>{table.capacity} seats</span>
            </div>

            {/* Status Badge */}
            <StatusBadge status={table.status} type="table" />
          </button>
        ))}
      </div>
    </div>
  );
}
