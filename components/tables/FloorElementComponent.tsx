"use client";

import { FloorElement } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FloorElementComponentProps {
  element: FloorElement;
  onClick: () => void;
  isEditMode?: boolean;
  isSelected?: boolean;
  onResizeStart?: (e: React.PointerEvent, handle: string) => void;
  onRotateStart?: (e: React.PointerEvent) => void;
}

export function FloorElementComponent({
  element,
  onClick,
  isEditMode = false,
  isSelected = false,
  onResizeStart,
  onRotateStart,
}: FloorElementComponentProps) {
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onClick();
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
      onPointerDown={handlePointerDown}
      className={cn(
        "absolute",
        isEditMode && "cursor-move",
        isSelected && "ring-2 ring-blue-500"
      )}
      style={{
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
        transform: `rotate(${element.rotation}deg)`,
      }}
    >
      {/* Element Content */}
      {element.type === "wall" && (
        <div className="w-full h-full bg-gray-700 rounded" />
      )}
      {element.type === "cashier" && (
        <div className="w-full h-full bg-blue-100 border-2 border-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-xs font-semibold text-blue-700">{element.label}</span>
        </div>
      )}
      {element.type === "plant" && (
        <div className="w-full h-full bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
          <span className="text-lg">🌿</span>
        </div>
      )}
      {element.type === "door" && (
        <div className="w-full h-full bg-amber-100 border-2 border-amber-500 rounded flex items-center justify-center">
          <span className="text-xs font-semibold text-amber-700">🚪</span>
        </div>
      )}
      {element.type === "label" && (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
          <span className="text-sm font-semibold text-gray-600">{element.label}</span>
        </div>
      )}

      {/* Resize & Rotation Handles (only when selected in edit mode) */}
      {isEditMode && isSelected && (
        <>
          {/* Rotation Handle */}
          <div
            onPointerDown={handleRotatePointerDown}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full cursor-grab hover:bg-blue-600 flex items-center justify-center shadow-lg"
            style={{ touchAction: "none" }}
          >
            <div className="w-1 h-4 bg-blue-500 absolute bottom-6" />
            <span className="text-white text-xs">↻</span>
          </div>

          {/* Corner Resize Handles */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "nw")}
            className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "ne")}
            className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "sw")}
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "se")}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-se-resize"
            style={{ touchAction: "none" }}
          />

          {/* Side Resize Handles */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "n")}
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-n-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "s")}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-s-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "w")}
            className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-w-resize"
            style={{ touchAction: "none" }}
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "e")}
            className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-e-resize"
            style={{ touchAction: "none" }}
          />
        </>
      )}
    </div>
  );
}
