"use client";

import { Table } from "@/lib/types";
import { Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableElementProps {
  table: Table;
  onClick: () => void;
  isEditMode?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  onResizeStart?: (e: React.PointerEvent, handle: string) => void;
  onRotateStart?: (e: React.PointerEvent) => void;
}

export function TableElement({ 
  table, 
  onClick, 
  isEditMode = false, 
  isDragging = false,
  isSelected = false,
  onResizeStart,
  onRotateStart,
}: TableElementProps) {
  const getStatusColors = () => {
    switch (table.status) {
      case "available":
        return "border-green-500 bg-green-50 hover:bg-green-100";
      case "occupied":
        return "border-red-500 bg-red-50 hover:bg-red-100";
      case "reserved":
        return "border-yellow-500 bg-yellow-50 hover:bg-yellow-100";
      case "cleaning":
        return "border-gray-400 bg-gray-50 hover:bg-gray-100";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const handleResizePointerDown = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    if (onResizeStart) {
      onResizeStart(e, handle);
    }
  };

  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (onRotateStart) {
      onRotateStart(e);
    }
  };

  return (
    <div
      className={cn(
        "absolute cursor-pointer border-2 shadow-md flex flex-col items-center justify-center p-2 select-none overflow-hidden",
        table.shape === "circle" ? "rounded-full" : "rounded-xl",
        getStatusColors(),
        isEditMode && "cursor-move hover:scale-105",
        isDragging && "border-blue-500 border-4 shadow-2xl",
        isSelected && "ring-2 ring-blue-500",
        !isDragging && "transition-all duration-200"
      )}
      style={{
        left: `${table.position.x}%`,
        top: `${table.position.y}%`,
        width: `${table.size.width}px`,
        height: `${table.size.height}px`,
        transform: `rotate(${table.rotation}deg)`,
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        willChange: isDragging ? "transform" : "auto",
      }}
    >
      {/* Table Name */}
      <div className="text-base font-bold text-gray-800 truncate max-w-full px-1 mb-0.5">{table.name}</div>

      {/* Capacity */}
      <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
        <Users className="w-3 h-3 flex-shrink-0" />
        <span>{table.capacity}</span>
      </div>

      {/* Occupied Info */}
      {table.status === "occupied" && table.customerName && table.seatedAt && (
        <div className="text-center w-full px-1 space-y-0.5">
          <div className="text-xs font-medium text-gray-700 truncate">
            {table.customerName}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 justify-center">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">{getTimeSince(table.seatedAt)}</span>
          </div>
        </div>
      )}

      {/* Reserved Info */}
      {table.status === "reserved" && table.customerName && (
        <div className="text-center w-full px-1 space-y-0.5">
          <div className="text-xs font-medium text-gray-700 truncate">
            {table.customerName}
          </div>
          <div className="text-xs text-gray-500">Reserved</div>
        </div>
      )}

      {/* Resize & Rotation Handles (only when selected in edit mode) */}
      {isEditMode && isSelected && (
        <>
          {/* Rotation Handle */}
          <div
            onPointerDown={handleRotatePointerDown}
            className="rotate-handle absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full cursor-grab hover:bg-blue-600 flex items-center justify-center shadow-lg z-10"
            style={{ touchAction: "none" }}
          >
            <div className="w-1 h-4 bg-blue-500 absolute bottom-6" />
            <span className="text-white text-xs">↻</span>
          </div>

          {/* Corner Resize Handles */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "nw")}
            className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize z-10"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "ne")}
            className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize z-10"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "sw")}
            className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize z-10"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "se")}
            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-se-resize z-10"
            style={{ touchAction: "none" }}
          />

          {/* Side Resize Handles */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "n")}
            className="resize-handle absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-n-resize z-10"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "s")}
            className="resize-handle absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-s-resize z-10"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "w")}
            className="resize-handle absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-w-resize z-10"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "e")}
            className="resize-handle absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-e-resize z-10"
            style={{ touchAction: "none" }}
          />
        </>
      )}
    </div>
  );
}
