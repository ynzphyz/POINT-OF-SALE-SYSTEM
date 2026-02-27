"use client";

import { Table } from "@/lib/types";
import { X, Trash2, ChevronDown } from "lucide-react";
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

  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);

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
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowShapeDropdown(!showShapeDropdown)}
              className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-900">
                {formData.shape === "circle" ? "Bulat" : formData.shape === "rectangle" ? "Persegi Panjang" : "Kotak"}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showShapeDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showShapeDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowShapeDropdown(false)}
                />
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div
                    className={`px-3 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${
                      formData.shape === "circle" ? 'bg-orange-100 text-orange-900' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, shape: "circle" });
                      setShowShapeDropdown(false);
                    }}
                  >
                    Bulat
                  </div>
                  <div
                    className={`px-3 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${
                      formData.shape === "rectangle" ? 'bg-orange-100 text-orange-900' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, shape: "rectangle" });
                      setShowShapeDropdown(false);
                    }}
                  >
                    Persegi Panjang
                  </div>
                  <div
                    className={`px-3 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${
                      formData.shape === "square" ? 'bg-orange-100 text-orange-900' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, shape: "square" });
                      setShowShapeDropdown(false);
                    }}
                  >
                    Kotak
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSectionDropdown(!showSectionDropdown)}
              className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-900">{formData.section}</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showSectionDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSectionDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowSectionDropdown(false)}
                />
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {sections.map((section) => (
                    <div
                      key={section}
                      className={`px-3 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${
                        formData.section === section ? 'bg-orange-100 text-orange-900' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setFormData({ ...formData, section });
                        setShowSectionDropdown(false);
                      }}
                    >
                      {section}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
