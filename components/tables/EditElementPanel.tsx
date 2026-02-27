"use client";

import { FloorElement } from "@/lib/types";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface EditElementPanelProps {
  element: FloorElement;
  onUpdate: (element: FloorElement) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function EditElementPanel({ element, onUpdate, onDelete, onClose }: EditElementPanelProps) {
  const [formData, setFormData] = useState({
    label: element.label || "",
  });

  useEffect(() => {
    setFormData({
      label: element.label || "",
    });
  }, [element]);

  const handleSave = () => {
    onUpdate({
      ...element,
      label: formData.label || undefined,
    });
  };

  const handleDelete = () => {
    const elementName = element.type === "cashier" ? "Kasir" : 
                       element.type === "wall" ? "Dinding" :
                       element.type === "plant" ? "Tanaman" :
                       element.type === "door" ? "Pintu" : "Label";
    
    if (confirm(`Hapus ${elementName}?`)) {
      onDelete();
    }
  };

  const getElementTypeName = () => {
    switch (element.type) {
      case "cashier": return "Kasir";
      case "wall": return "Dinding";
      case "plant": return "Tanaman";
      case "door": return "Pintu";
      case "label": return "Label";
      default: return "Elemen";
    }
  };

  return (
    <div className="fixed right-24 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl border border-gray-200 w-80 z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold">Edit {getElementTypeName()}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        {(element.type === "cashier" || element.type === "label") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>
            <Input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder={element.type === "cashier" ? "Kasir" : "Label"}
            />
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tipe:</span>
            <span className="font-medium">{getElementTypeName()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Lebar:</span>
            <span className="font-medium">{Math.round(element.size.width)}px</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tinggi:</span>
            <span className="font-medium">{Math.round(element.size.height)}px</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rotasi:</span>
            <span className="font-medium">{Math.round(element.rotation)}°</span>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          💡 Gunakan handle untuk resize dan rotate elemen
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {(element.type === "cashier" || element.type === "label") && (
          <Button
            onClick={handleSave}
            className="w-full"
          >
            Simpan Perubahan
          </Button>
        )}
        <Button
          onClick={handleDelete}
          variant="outline"
          className="w-full text-red-600 border-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus {getElementTypeName()}
        </Button>
      </div>
    </div>
  );
}
