"use client";

import { Table } from "@/lib/types";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface EditPanelProps {
  table: Table;
  onUpdate: (table: Table) => void;
  onDelete: () => void;
  onClose: () => void;
  sections: string[];
}

export function EditPanel({ table, onUpdate, onDelete, onClose, sections }: EditPanelProps) {
  const [formData, setFormData] = useState({
    name: table.name,
    capacity: table.capacity,
    shape: table.shape,
    section: table.section,
  });

  useEffect(() => {
    setFormData({
      name: table.name,
      capacity: table.capacity,
      shape: table.shape,
      section: table.section,
    });
  }, [table]);

  const handleSave = () => {
    onUpdate({
      ...table,
      ...formData,
    });
  };

  const handleDelete = () => {
    if (confirm(`Hapus meja ${table.name}?`)) {
      onDelete();
    }
  };

  return (
    <div className="fixed right-24 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl border border-gray-200 w-80 z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold">Edit Meja</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Meja
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="A1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kapasitas
          </label>
          <Input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 2 })}
            min="1"
            max="20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bentuk
          </label>
          <select
            value={formData.shape}
            onChange={(e) => setFormData({ ...formData, shape: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="circle">Bulat</option>
            <option value="rectangle">Persegi Panjang</option>
            <option value="square">Kotak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section
          </label>
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          onClick={handleSave}
          className="w-full"
        >
          Simpan Perubahan
        </Button>
        <Button
          onClick={handleDelete}
          variant="outline"
          className="w-full text-red-600 border-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus Meja
        </Button>
      </div>
    </div>
  );
}
