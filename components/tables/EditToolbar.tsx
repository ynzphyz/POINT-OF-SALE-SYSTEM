"use client";

import { Circle, Square, RectangleHorizontal, Store, Minus, Tag, Leaf, Grid3x3, DoorOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditToolbarProps {
  onAddTable: (shape: "circle" | "rectangle" | "square") => void;
  onAddElement: (type: "cashier" | "wall" | "plant" | "label" | "door") => void;
  snapToGrid?: boolean;
  onToggleSnap?: () => void;
  onOpenSettings?: () => void;
}

export function EditToolbar({ onAddTable, onAddElement, snapToGrid = false, onToggleSnap, onOpenSettings }: EditToolbarProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 space-y-2 z-40">
      {/* Settings Button */}
      {onOpenSettings && (
        <>
          <button
            onClick={onOpenSettings}
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-primary hover:text-primary transition-colors"
            title="Pengaturan"
          >
            <Settings className="w-6 h-6" />
          </button>
          <div className="border-t border-gray-200 my-2" />
        </>
      )}

      {/* Snap to Grid Toggle */}
      {onToggleSnap && (
        <>
          <button
            onClick={onToggleSnap}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-lg transition-colors border-2",
              snapToGrid
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            )}
            title="Snap to Grid"
          >
            <Grid3x3 className="w-6 h-6" />
          </button>
          <div className="border-t border-gray-200 my-2" />
        </>
      )}

      <div className="text-xs font-semibold text-gray-600 mb-3 px-2">Tambah Meja</div>
      
      {/* Add Circle Table */}
      <button
        onClick={() => onAddTable("circle")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-gray-200 hover:border-primary"
        title="Tambah Meja Bulat"
      >
        <Circle className="w-6 h-6" />
      </button>

      {/* Add Rectangle Table */}
      <button
        onClick={() => onAddTable("rectangle")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-gray-200 hover:border-primary"
        title="Tambah Meja Persegi Panjang"
      >
        <RectangleHorizontal className="w-6 h-6" />
      </button>

      {/* Add Square Table */}
      <button
        onClick={() => onAddTable("square")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-gray-200 hover:border-primary"
        title="Tambah Meja Kotak"
      >
        <Square className="w-6 h-6" />
      </button>

      <div className="border-t border-gray-200 my-2" />
      
      <div className="text-xs font-semibold text-gray-600 mb-3 px-2">Elemen</div>

      {/* Add Cashier */}
      <button
        onClick={() => onAddElement("cashier")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200 hover:border-blue-500"
        title="Tambah Kasir"
      >
        <Store className="w-6 h-6" />
      </button>

      {/* Add Wall */}
      <button
        onClick={() => onAddElement("wall")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors border border-gray-200 hover:border-gray-400"
        title="Tambah Dinding"
      >
        <Minus className="w-6 h-6" />
      </button>

      {/* Add Door */}
      <button
        onClick={() => onAddElement("door")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors border border-gray-200 hover:border-amber-500"
        title="Tambah Pintu"
      >
        <DoorOpen className="w-6 h-6" />
      </button>

      {/* Add Plant */}
      <button
        onClick={() => onAddElement("plant")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors border border-gray-200 hover:border-green-500"
        title="Tambah Tanaman"
      >
        <Leaf className="w-6 h-6" />
      </button>

      {/* Add Label */}
      <button
        onClick={() => onAddElement("label")}
        className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors border border-gray-200 hover:border-purple-500"
        title="Tambah Label"
      >
        <Tag className="w-6 h-6" />
      </button>
    </div>
  );
}
