"use client";

import { Table, FloorElement } from "@/lib/types";
import { TableElement } from "./TableElement";
import { FloorElementComponent } from "./FloorElementComponent";
import { useRef, useState, useEffect } from "react";

interface FloorCanvasProps {
  tables: Table[];
  elements: FloorElement[];
  onTableClick: (table: Table) => void;
  onElementClick?: (element: FloorElement) => void;
  onTableMove?: (tableId: string, newPosition: { x: number; y: number }) => void;
  onTableResize?: (tableId: string, newSize: { width: number; height: number }) => void;
  onTableRotate?: (tableId: string, newRotation: number) => void;
  onElementMove?: (elementId: string, newPosition: { x: number; y: number }) => void;
  onElementResize?: (elementId: string, newSize: { width: number; height: number }) => void;
  onElementRotate?: (elementId: string, newRotation: number) => void;
  zoom: number;
  isEditMode?: boolean;
  snapToGrid?: boolean;
  selectedTableId?: string | null;
  selectedElementId?: string | null;
}

export function FloorCanvas({
  tables,
  elements,
  onTableClick,
  onElementClick,
  onTableMove,
  onTableResize,
  onTableRotate,
  onElementMove,
  onElementResize,
  onElementRotate,
  zoom,
  isEditMode = false,
  snapToGrid = false,
  selectedTableId = null,
  selectedElementId = null,
}: FloorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Drag state
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Resize state
  const [resizingTable, setResizingTable] = useState<{ id: string; handle: string } | null>(null);
  const [resizingElement, setResizingElement] = useState<{ id: string; handle: string } | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Rotate state
  const [rotatingTable, setRotatingTable] = useState<string | null>(null);
  const [rotatingElement, setRotatingElement] = useState<string | null>(null);
  const [rotateStart, setRotateStart] = useState({ angle: 0, centerX: 0, centerY: 0 });

  // Pinch zoom state
  const [isPinching, setIsPinching] = useState(false);
  const [pinchStart, setPinchStart] = useState({ distance: 0, zoom: 1 });

  // Snap to grid helper
  const snapValue = (value: number, gridSize: number = 20) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Snap rotation to 45 degree increments
  const snapRotation = (rotation: number) => {
    const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    const normalized = ((rotation % 360) + 360) % 360;
    const closest = snapAngles.reduce((prev, curr) =>
      Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev
    );
    return Math.abs(closest - normalized) < 10 ? closest : normalized;
  };

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    const tableElement = target.closest("[data-table-id]");
    const elementElement = target.closest("[data-element-id]");

    // Don't start drag if clicking on a handle
    if (target.closest(".cursor-nw-resize, .cursor-ne-resize, .cursor-sw-resize, .cursor-se-resize, .cursor-n-resize, .cursor-s-resize, .cursor-w-resize, .cursor-e-resize, .cursor-grab")) {
      return;
    }

    if (isEditMode && tableElement) {
      const tableId = tableElement.getAttribute("data-table-id");
      if (tableId) {
        setDraggingTable(tableId);
        setDragStart({ x: e.clientX, y: e.clientY });
        return;
      }
    }

    if (isEditMode && elementElement) {
      const elementId = elementElement.getAttribute("data-element-id");
      if (elementId) {
        setDraggingElement(elementId);
        setDragStart({ x: e.clientX, y: e.clientY });
        return;
      }
    }

    // Pan the canvas
    if (!tableElement && !elementElement) {
      setIsPanning(true);
      setStartPan({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Handle table dragging
    if (draggingTable && isEditMode && onTableMove && canvasRef.current) {
      const deltaX = (e.clientX - dragStart.x) / zoom;
      const deltaY = (e.clientY - dragStart.y) / zoom;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaXPercent = (deltaX / canvasRect.width) * 100;
      const deltaYPercent = (deltaY / canvasRect.height) * 100;

      const table = tables.find((t) => t.id === draggingTable);
      if (table) {
        let newX = table.position.x + deltaXPercent;
        let newY = table.position.y + deltaYPercent;

        // Snap to grid if enabled
        if (snapToGrid) {
          const xPx = (newX / 100) * canvasRect.width;
          const yPx = (newY / 100) * canvasRect.height;
          const snappedX = snapValue(xPx);
          const snappedY = snapValue(yPx);
          newX = (snappedX / canvasRect.width) * 100;
          newY = (snappedY / canvasRect.height) * 100;
        }

        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        onTableMove(draggingTable, { x: newX, y: newY });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    // Handle element dragging
    if (draggingElement && isEditMode && onElementMove && canvasRef.current) {
      const deltaX = (e.clientX - dragStart.x) / zoom;
      const deltaY = (e.clientY - dragStart.y) / zoom;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaXPercent = (deltaX / canvasRect.width) * 100;
      const deltaYPercent = (deltaY / canvasRect.height) * 100;

      const element = elements.find((el) => el.id === draggingElement);
      if (element) {
        let newX = element.position.x + deltaXPercent;
        let newY = element.position.y + deltaYPercent;

        if (snapToGrid) {
          const xPx = (newX / 100) * canvasRect.width;
          const yPx = (newY / 100) * canvasRect.height;
          const snappedX = snapValue(xPx);
          const snappedY = snapValue(yPx);
          newX = (snappedX / canvasRect.width) * 100;
          newY = (snappedY / canvasRect.height) * 100;
        }

        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        onElementMove(draggingElement, { x: newX, y: newY });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    // Handle table resizing
    if (resizingTable && onTableResize && canvasRef.current) {
      const { id, handle } = resizingTable;
      const deltaX = (e.clientX - resizeStart.x) / zoom;
      const deltaY = (e.clientY - resizeStart.y) / zoom;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      // Calculate new size based on handle
      if (handle.includes("e")) newWidth += deltaX;
      if (handle.includes("w")) newWidth -= deltaX;
      if (handle.includes("s")) newHeight += deltaY;
      if (handle.includes("n")) newHeight -= deltaY;

      // Snap to grid
      if (snapToGrid) {
        newWidth = snapValue(newWidth);
        newHeight = snapValue(newHeight);
      }

      // Min size
      newWidth = Math.max(40, newWidth);
      newHeight = Math.max(40, newHeight);

      onTableResize(id, { width: newWidth, height: newHeight });
      return;
    }

    // Handle element resizing
    if (resizingElement && onElementResize && canvasRef.current) {
      const { id, handle } = resizingElement;
      const deltaX = (e.clientX - resizeStart.x) / zoom;
      const deltaY = (e.clientY - resizeStart.y) / zoom;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      if (handle.includes("e")) newWidth += deltaX;
      if (handle.includes("w")) newWidth -= deltaX;
      if (handle.includes("s")) newHeight += deltaY;
      if (handle.includes("n")) newHeight -= deltaY;

      if (snapToGrid) {
        newWidth = snapValue(newWidth);
        newHeight = snapValue(newHeight);
      }

      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);

      onElementResize(id, { width: newWidth, height: newHeight });
      return;
    }

    // Handle table rotation
    if (rotatingTable && onTableRotate && canvasRef.current) {
      const table = tables.find((t) => t.id === rotatingTable);
      if (table) {
        const angle = Math.atan2(
          e.clientY - rotateStart.centerY,
          e.clientX - rotateStart.centerX
        );
        const degrees = (angle * 180) / Math.PI + 90;
        const snappedRotation = snapRotation(degrees);
        onTableRotate(rotatingTable, snappedRotation);
      }
      return;
    }

    // Handle element rotation
    if (rotatingElement && onElementRotate && canvasRef.current) {
      const element = elements.find((el) => el.id === rotatingElement);
      if (element) {
        const angle = Math.atan2(
          e.clientY - rotateStart.centerY,
          e.clientX - rotateStart.centerX
        );
        const degrees = (angle * 180) / Math.PI + 90;
        const snappedRotation = snapRotation(degrees);
        onElementRotate(rotatingElement, snappedRotation);
      }
      return;
    }

    // Pan canvas
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    setDraggingTable(null);
    setDraggingElement(null);
    setResizingTable(null);
    setResizingElement(null);
    setRotatingTable(null);
    setRotatingElement(null);
  };

  // Table resize start
  const handleTableResizeStart = (tableId: string, e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      setResizingTable({ id: tableId, handle });
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: table.size.width,
        height: table.size.height,
      });
    }
  };

  // Element resize start
  const handleElementResizeStart = (elementId: string, e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === elementId);
    if (element) {
      setResizingElement({ id: elementId, handle });
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.size.width,
        height: element.size.height,
      });
    }
  };

  // Table rotate start
  const handleTableRotateStart = (tableId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    if (canvasRef.current) {
      const table = tables.find((t) => t.id === tableId);
      if (table) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const centerX = canvasRect.left + (table.position.x / 100) * canvasRect.width + (table.size.width / 2) * zoom;
        const centerY = canvasRect.top + (table.position.y / 100) * canvasRect.height + (table.size.height / 2) * zoom;

        setRotatingTable(tableId);
        setRotateStart({
          angle: table.rotation,
          centerX,
          centerY,
        });
      }
    }
  };

  // Element rotate start
  const handleElementRotateStart = (elementId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    if (canvasRef.current) {
      const element = elements.find((el) => el.id === elementId);
      if (element) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const centerX = canvasRect.left + (element.position.x / 100) * canvasRect.width + (element.size.width / 2) * zoom;
        const centerY = canvasRect.top + (element.position.y / 100) * canvasRect.height + (element.size.height / 2) * zoom;

        setRotatingElement(elementId);
        setRotateStart({
          angle: element.rotation,
          centerX,
          centerY,
        });
      }
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        cursor: isPanning ? "grabbing" : isEditMode ? "default" : "grab",
        backgroundColor: isEditMode ? "#EFF6FF" : "#FFFFFF",
        backgroundImage: `radial-gradient(circle, ${snapToGrid ? "#9CA3AF" : "#E5E7EB"} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        touchAction: "none",
      }}
    >
      {/* Canvas content with zoom and pan */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Floor Elements */}
        {elements.map((element) => (
          <div key={element.id} data-element-id={element.id}>
            <FloorElementComponent
              element={element}
              onClick={() => onElementClick && onElementClick(element)}
              isEditMode={isEditMode}
              isSelected={selectedElementId === element.id}
              onResizeStart={(e, handle) => handleElementResizeStart(element.id, e, handle)}
              onRotateStart={(e) => handleElementRotateStart(element.id, e)}
            />
          </div>
        ))}

        {/* Tables */}
        {tables.map((table) => (
          <div
            key={table.id}
            data-table-id={table.id}
            className={draggingTable === table.id ? "opacity-70" : ""}
          >
            <TableElement
              table={table}
              onClick={() => onTableClick(table)}
              isEditMode={isEditMode}
              isDragging={draggingTable === table.id}
              isSelected={selectedTableId === table.id}
              onResizeStart={(e, handle) => handleTableResizeStart(table.id, e, handle)}
              onRotateStart={(e) => handleTableRotateStart(table.id, e)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
