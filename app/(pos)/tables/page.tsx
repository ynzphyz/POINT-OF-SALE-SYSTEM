"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ZoomIn, ZoomOut, Edit3, Save, X, Plus, Undo2, Redo2 } from "lucide-react";
import { tables as initialTables, floorElements as initialElements } from "@/lib/mock-data";
import { Table, FloorElement } from "@/lib/types";
import { FloorCanvas } from "@/components/tables/FloorCanvas";
import { TableDetailsModal } from "@/components/tables/TableDetailsModal";
import { EditToolbar } from "@/components/tables/EditToolbar";
import { EditPanel } from "@/components/tables/EditPanel";
import { EditElementPanel } from "@/components/tables/EditElementPanel";
import { FloorSettingsModal, FloorSettings } from "@/components/tables/FloorSettingsModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveFloorPlan, loadFloorPlan } from "@/lib/floor-storage";
import { useHistory } from "@/lib/useHistory";

interface FloorPlanState {
  tables: Table[];
  elements: FloorElement[];
}

export default function TablesPage() {
  const router = useRouter();
  const [floors, setFloors] = useState<string[]>(["Ruang Dalam", "Teras"]);
  const [selectedFloor, setSelectedFloor] = useState("Ruang Dalam");
  const [zoom, setZoom] = useState(1);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTableForEdit, setSelectedTableForEdit] = useState<Table | null>(null);
  const [selectedElement, setSelectedElement] = useState<FloorElement | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [floorSettings, setFloorSettings] = useState<FloorSettings>({
    floorColor: "#EFF6FF",
    boxColor: "#E5E7EB",
    boxSize: "medium",
    background: "none",
  });

  // History management for undo/redo
  const {
    state: floorPlanState,
    setState: setFloorPlanState,
    undo,
    redo,
    reset: resetHistory,
    canUndo,
    canRedo,
  } = useHistory<FloorPlanState>({
    tables: initialTables,
    elements: initialElements,
  });

  const { tables, elements } = floorPlanState;

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = loadFloorPlan();
    if (savedData) {
      resetHistory({
        tables: savedData.tables,
        elements: savedData.elements,
      });
      setFloors(savedData.floors);
    }
    setIsLoading(false);
  }, [resetHistory]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        showToastMessage("Undo");
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        showToastMessage("Redo");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, undo, redo]);

  // Filter tables and elements by floor
  const filteredTables = tables.filter((table) => table.floor === selectedFloor);
  const filteredElements = elements.filter((element) => element.floor === selectedFloor);

  const handleTableClick = (table: Table) => {
    if (isEditMode) {
      setSelectedTableForEdit(table);
      setSelectedElement(null);
    } else {
      if (table.status === "occupied") {
        setSelectedTable(table);
      } else if (table.status === "available") {
        router.push(`/?tableId=${table.id}`);
      } else if (table.status === "reserved") {
        showToastMessage(`Reservation: ${table.customerName || "Unknown"}`);
      }
    }
  };

  const handleElementClick = (element: FloorElement) => {
    if (isEditMode) {
      setSelectedElement(element);
      setSelectedTableForEdit(null);
    }
  };

  const handleTableMove = (tableId: string, newPosition: { x: number; y: number }) => {
    setFloorPlanState({
      ...floorPlanState,
      tables: tables.map((t) => (t.id === tableId ? { ...t, position: newPosition } : t)),
    });
  };

  const handleTableResize = (tableId: string, newSize: { width: number; height: number }) => {
    setFloorPlanState({
      ...floorPlanState,
      tables: tables.map((t) => (t.id === tableId ? { ...t, size: newSize } : t)),
    });
  };

  const handleTableRotate = (tableId: string, newRotation: number) => {
    setFloorPlanState({
      ...floorPlanState,
      tables: tables.map((t) => (t.id === tableId ? { ...t, rotation: newRotation } : t)),
    });
  };

  const handleElementMove = (elementId: string, newPosition: { x: number; y: number }) => {
    setFloorPlanState({
      ...floorPlanState,
      elements: elements.map((el) => (el.id === elementId ? { ...el, position: newPosition } : el)),
    });
  };

  const handleElementResize = (elementId: string, newSize: { width: number; height: number }) => {
    setFloorPlanState({
      ...floorPlanState,
      elements: elements.map((el) => (el.id === elementId ? { ...el, size: newSize } : el)),
    });
  };

  const handleElementRotate = (elementId: string, newRotation: number) => {
    setFloorPlanState({
      ...floorPlanState,
      elements: elements.map((el) => (el.id === elementId ? { ...el, rotation: newRotation } : el)),
    });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleAddTable = (shape: "circle" | "rectangle" | "square") => {
    const newTable: Table = {
      id: `t${Date.now()}`,
      name: `New-${tables.length + 1}`,
      number: `${tables.length + 1}`,
      capacity: shape === "circle" ? 2 : shape === "square" ? 4 : 6,
      shape,
      status: "available",
      section: selectedFloor === "Teras" ? "Terrace" : "Section A",
      floor: selectedFloor,
      position: { x: 40, y: 40 },
      size: {
        width: shape === "circle" ? 80 : shape === "square" ? 100 : 120,
        height: shape === "circle" ? 80 : shape === "square" ? 100 : 80,
      },
      rotation: 0,
    };
    setFloorPlanState({
      ...floorPlanState,
      tables: [...tables, newTable],
    });
    setSelectedTableForEdit(newTable);
    showToastMessage(`Meja ${newTable.name} ditambahkan`);
  };

  const handleAddElement = (type: "cashier" | "wall" | "plant" | "label" | "door") => {
    const newElement: FloorElement = {
      id: `elem${Date.now()}`,
      type,
      position: { x: 45, y: 45 },
      size: {
        width: type === "wall" ? 4 : type === "label" ? 120 : type === "door" ? 60 : 60,
        height: type === "wall" ? 150 : type === "label" ? 40 : type === "door" ? 80 : 60,
      },
      rotation: 0,
      label: type === "cashier" ? "Kasir" : type === "label" ? "Label" : undefined,
      floor: selectedFloor,
    };
    setFloorPlanState({
      ...floorPlanState,
      elements: [...elements, newElement],
    });
    showToastMessage(`Elemen ${type} ditambahkan`);
  };

  const handleUpdateTable = (updatedTable: Table) => {
    setFloorPlanState({
      ...floorPlanState,
      tables: tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)),
    });
    showToastMessage(`Meja ${updatedTable.name} diperbarui`);
  };

  const handleUpdateElement = (updatedElement: FloorElement) => {
    setFloorPlanState({
      ...floorPlanState,
      elements: elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
    });
    showToastMessage(`Elemen diperbarui`);
  };

  const handleDeleteTable = () => {
    if (selectedTableForEdit) {
      setFloorPlanState({
        ...floorPlanState,
        tables: tables.filter((t) => t.id !== selectedTableForEdit.id),
      });
      showToastMessage(`Meja ${selectedTableForEdit.name} dihapus`);
      setSelectedTableForEdit(null);
    }
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      setFloorPlanState({
        ...floorPlanState,
        elements: elements.filter((el) => el.id !== selectedElement.id),
      });
      showToastMessage(`Elemen dihapus`);
      setSelectedElement(null);
    }
  };

  const handleSaveLayout = () => {
    saveFloorPlan({ tables, elements, floors });
    showToastMessage("Layout berhasil disimpan");
    setIsEditMode(false);
    setSelectedTableForEdit(null);
    setSelectedElement(null);
  };

  const handleCancelEdit = () => {
    const savedData = loadFloorPlan();
    if (savedData) {
      resetHistory({
        tables: savedData.tables,
        elements: savedData.elements,
      });
      setFloors(savedData.floors);
    } else {
      resetHistory({
        tables: initialTables,
        elements: initialElements,
      });
      setFloors(["Ruang Dalam", "Teras"]);
    }
    setIsEditMode(false);
    setSelectedTableForEdit(null);
    setSelectedElement(null);
    showToastMessage("Perubahan dibatalkan");
  };

  const handleAddFloor = () => {
    const floorName = prompt("Nama lantai baru:");
    if (floorName && floorName.trim()) {
      setFloors((prev) => [...prev, floorName.trim()]);
      showToastMessage(`Lantai "${floorName}" ditambahkan`);
    }
  };

  const handleDeleteFloor = (floorName: string) => {
    if (floors.length <= 1) {
      showToastMessage("Tidak bisa menghapus lantai terakhir");
      return;
    }

    if (confirm(`Hapus lantai "${floorName}"? Semua meja dan elemen di lantai ini akan dihapus.`)) {
      setFloors((prev) => prev.filter((f) => f !== floorName));
      setFloorPlanState({
        tables: tables.filter((t) => t.floor !== floorName),
        elements: elements.filter((e) => e.floor !== floorName),
      });

      if (selectedFloor === floorName) {
        setSelectedFloor(floors.find((f) => f !== floorName) || floors[0]);
      }

      showToastMessage(`Lantai "${floorName}" dihapus`);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Count tables by status
  const statusCounts = {
    available: filteredTables.filter((t) => t.status === "available").length,
    occupied: filteredTables.filter((t) => t.status === "occupied").length,
    reserved: filteredTables.filter((t) => t.status === "reserved").length,
    cleaning: filteredTables.filter((t) => t.status === "cleaning").length,
  };

  // Get unique sections for edit panel
  const sections = Array.from(new Set(tables.map((t) => t.section)));

  // Empty state check
  const isEmpty = filteredTables.length === 0 && filteredElements.length === 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Floor Plan</h1>
            <p className="text-gray-600 text-sm">Kelola meja dan tata letak restoran</p>
          </div>

          {isEditMode ? (
            <div className="flex gap-2">
              {/* Undo/Redo Buttons */}
              <Button
                onClick={undo}
                disabled={!canUndo}
                variant="outline"
                className="border-gray-300"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={!canRedo}
                variant="outline"
                className="border-gray-300"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>

              <div className="border-l border-gray-300 mx-2" />

              <Button onClick={handleCancelEdit} variant="outline" className="border-gray-300">
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button onClick={handleSaveLayout} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Simpan Layout
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditMode(true)} className="bg-primary hover:bg-primary/90">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Layout
            </Button>
          )}
        </div>

        {/* Floor Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {floors.map((floor) => (
              <div key={floor} className="relative group">
                <button
                  onClick={() => setSelectedFloor(floor)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedFloor === floor
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {floor}
                </button>
                {isEditMode && floors.length > 1 && (
                  <button
                    onClick={() => handleDeleteFloor(floor)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus lantai"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {isEditMode && (
              <button
                onClick={handleAddFloor}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Lantai
              </button>
            )}
          </div>

          {/* Status Summary */}
          {!isEditMode && (
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">
                  Tersedia: <span className="font-semibold">{statusCounts.available}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">
                  Terisi: <span className="font-semibold">{statusCounts.occupied}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">
                  Reserved: <span className="font-semibold">{statusCounts.reserved}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Loading layout...</div>
          </div>
        ) : isEmpty && isEditMode ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg mb-2">Belum ada meja atau elemen</p>
            <p className="text-sm">Klik tombol + di toolbar untuk menambah</p>
          </div>
        ) : (
          <FloorCanvas
            tables={filteredTables}
            elements={filteredElements}
            onTableClick={handleTableClick}
            onElementClick={handleElementClick}
            onTableMove={handleTableMove}
            onTableResize={handleTableResize}
            onTableRotate={handleTableRotate}
            onElementMove={handleElementMove}
            onElementResize={handleElementResize}
            onElementRotate={handleElementRotate}
            zoom={zoom}
            isEditMode={isEditMode}
            snapToGrid={snapToGrid}
            selectedTableId={selectedTableForEdit?.id}
            selectedElementId={selectedElement?.id}
          />
        )}
      </div>

      {/* Bottom Zoom Bar */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="text-white text-sm font-medium">{selectedFloor}</div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="50"
              max="200"
              value={zoom * 100}
              onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
              className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #F97316 0%, #F97316 ${
                  ((zoom - 0.5) / 1.5) * 100
                }%, #4B5563 ${((zoom - 0.5) / 1.5) * 100}%, #4B5563 100%)`,
              }}
            />
            <button
              onClick={handleResetZoom}
              className="text-white text-sm font-medium hover:text-primary transition-colors min-w-[3rem] text-center"
            >
              {Math.round(zoom * 100)}%
            </button>
          </div>

          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-gray-400 text-xs">
          {isEditMode
            ? snapToGrid
              ? "Snap to Grid aktif • Drag untuk memindahkan"
              : "Drag untuk memindahkan • Resize & rotate"
            : "Drag canvas untuk pan • Scroll untuk zoom"}
        </div>
      </div>

      {/* Edit Toolbar (Right Sidebar) */}
      {isEditMode && (
        <EditToolbar
          onAddTable={handleAddTable}
          onAddElement={handleAddElement}
          snapToGrid={snapToGrid}
          onToggleSnap={() => setSnapToGrid(!snapToGrid)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Edit Panel (for selected table) */}
      {isEditMode && selectedTableForEdit && (
        <EditPanel
          table={selectedTableForEdit}
          onUpdate={handleUpdateTable}
          onDelete={handleDeleteTable}
          onClose={() => setSelectedTableForEdit(null)}
          sections={sections}
        />
      )}

      {/* Edit Element Panel (for selected element) */}
      {isEditMode && selectedElement && !selectedTableForEdit && (
        <EditElementPanel
          element={selectedElement}
          onUpdate={handleUpdateElement}
          onDelete={handleDeleteElement}
          onClose={() => setSelectedElement(null)}
        />
      )}

      {/* Floor Settings Modal */}
      <FloorSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newSettings) => {
          setFloorSettings(newSettings);
          showToastMessage("Pengaturan disimpan");
        }}
        currentSettings={floorSettings}
      />

      {/* Table Details Modal (View Mode) */}
      {!isEditMode && selectedTable && (
        <TableDetailsModal table={selectedTable} onClose={() => setSelectedTable(null)} />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
