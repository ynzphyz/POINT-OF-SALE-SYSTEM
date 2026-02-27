"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FloorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: FloorSettings) => void;
  currentSettings: FloorSettings;
}

export interface FloorSettings {
  floorColor: string;
  boxColor: string;
  boxSize: "small" | "medium" | "large";
  background: "none" | "wood" | "tile" | "concrete";
}

const colorOptions = [
  { name: "Putih", value: "#FFFFFF" },
  { name: "Abu-abu Terang", value: "#F3F4F6" },
  { name: "Biru Muda", value: "#EFF6FF" },
  { name: "Hijau Muda", value: "#F0FDF4" },
  { name: "Krem", value: "#FFFBEB" },
];

const boxSizeOptions = [
  { name: "Kecil", value: "small" as const, size: "10px" },
  { name: "Sedang", value: "medium" as const, size: "20px" },
  { name: "Besar", value: "large" as const, size: "30px" },
];

const backgroundOptions = [
  { name: "None", value: "none" as const, preview: "#FFFFFF" },
  { name: "Kayu", value: "wood" as const, preview: "linear-gradient(90deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)" },
  { name: "Ubin", value: "tile" as const, preview: "#E5E7EB" },
  { name: "Beton", value: "concrete" as const, preview: "#9CA3AF" },
];

export function FloorSettingsModal({ isOpen, onClose, onSave, currentSettings }: FloorSettingsModalProps) {
  const [settings, setSettings] = useState<FloorSettings>(currentSettings);
  const [activeTab, setActiveTab] = useState<"floor" | "color" | "size" | "background">("floor");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Pengaturan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("floor")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "floor"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Warna Lantai
          </button>
          <button
            onClick={() => setActiveTab("color")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "color"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Pilih Warna
          </button>
          <button
            onClick={() => setActiveTab("size")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "size"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Ukuran Kotak
          </button>
          <button
            onClick={() => setActiveTab("background")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "background"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sedang
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
          {activeTab === "floor" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Warna Lantai</h3>
              <div className="grid grid-cols-3 gap-4">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSettings({ ...settings, floorColor: color.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.floorColor === color.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-full h-20 rounded-lg mb-2 border border-gray-200"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="text-sm font-medium text-center">{color.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "color" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pilih Warna Kotak</h3>
              <div className="grid grid-cols-3 gap-4">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSettings({ ...settings, boxColor: color.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.boxColor === color.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-full h-20 rounded-lg mb-2 border border-gray-200"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="text-sm font-medium text-center">{color.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "size" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Ukuran Kotak Grid</h3>
              <div className="grid grid-cols-3 gap-4">
                {boxSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, boxSize: option.value })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      settings.boxSize === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div
                        className="border-2 border-gray-400"
                        style={{ width: option.size, height: option.size }}
                      />
                    </div>
                    <div className="text-sm font-medium text-center">{option.name}</div>
                    <div className="text-xs text-gray-500 text-center mt-1">{option.size}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "background" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Latar Belakang</h3>
              <div className="grid grid-cols-2 gap-4">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, background: option.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.background === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-full h-32 rounded-lg mb-2 border border-gray-200"
                      style={{
                        background: option.preview,
                        backgroundSize: option.value === "wood" ? "100% 20px" : "auto",
                      }}
                    />
                    <div className="text-sm font-medium text-center">{option.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button onClick={handleSave} className="w-full" size="lg">
            SIMPAN
          </Button>
        </div>
      </div>
    </div>
  );
}
