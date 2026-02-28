"use client";

import { useState, useRef } from "react";
import { Plus, X, Grid3x3, List, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemDetailModal } from "@/components/shared/item-detail-modal";
import { formatCurrency } from "@/lib/utils";
import { formatQuantity } from "@/lib/utils";
import { OrderItem } from "@/lib/types";

interface OrderPanelProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateDiscount: (itemId: string, discount: number) => void;
  onUpdateNotes: (itemId: string, notes?: string) => void;
  onRemoveItem: (itemId: string) => void;
  onAddCustomer: () => void;
  onProceed: () => void;
  onHoldOrder: () => void;
  customerName?: string;
  menuItems: any[]; // For looking up menu item details
}

interface SwipeableItemProps {
  item: OrderItem;
  index: number;
  onRemoveClick: () => void;
  onEditClick: () => void;
  swipedItemId: string | null;
  onSwipeChange: (itemId: string | null) => void;
}

function SwipeableItem({
  item,
  index,
  onRemoveClick,
  onEditClick,
  swipedItemId,
  onSwipeChange,
}: SwipeableItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const SWIPE_THRESHOLD = 60;
  const BUTTON_WIDTH = 140; // 70px Edit + 70px Hapus

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentXRef.current = translateX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startXRef.current;
    const newTranslateX = currentXRef.current + deltaX;

    // Only allow swipe to left (negative values)
    if (newTranslateX <= 0 && newTranslateX >= -BUTTON_WIDTH) {
      setTranslateX(newTranslateX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;

    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Snap to position based on threshold
    if (translateX < -SWIPE_THRESHOLD) {
      setTranslateX(-BUTTON_WIDTH);
      onSwipeChange(item.id);
    } else {
      setTranslateX(0);
      if (swipedItemId === item.id) {
        onSwipeChange(null);
      }
    }
  };

  // Reset position when another item is swiped
  if (swipedItemId !== null && swipedItemId !== item.id && translateX !== 0) {
    setTranslateX(0);
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Action Buttons (underneath) */}
      <div className="absolute right-0 top-0 bottom-0 flex">
        <button
          onClick={onEditClick}
          className="w-[70px] bg-primary hover:bg-primary/90 text-white flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <Edit2 className="w-5 h-5" />
          <span className="text-xs font-medium">Edit</span>
        </button>
        <button
          onClick={onRemoveClick}
          className="w-[70px] bg-red-500 hover:bg-red-600 text-white flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-xs font-medium">Hapus</span>
        </button>
      </div>

      {/* Main Content (slides over buttons) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          touchAction: "pan-y",
        }}
        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-gray-500 text-sm font-medium">{index + 1}</span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  {item.quantity % 1 !== 0 && (
                    <p className="text-xs text-primary font-medium mt-0.5">
                      (½ porsi)
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-500 italic mt-0.5">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={onRemoveClick}
                  className="text-gray-400 hover:text-danger flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center -mr-3 -mt-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-medium text-sm">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-gray-400 text-xs">×</span>
                  <span className="text-gray-700 font-semibold text-sm">
                    {formatQuantity(item.quantity)}
                  </span>
                </div>
                <span className="text-gray-900 font-bold text-sm">
                  {formatCurrency(Math.round(item.price * item.quantity - item.discount))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderPanel({
  items,
  onUpdateQuantity,
  onUpdateDiscount,
  onUpdateNotes,
  onRemoveItem,
  onAddCustomer,
  onProceed,
  onHoldOrder,
  customerName,
  menuItems,
}: OrderPanelProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<"add" | "discount" | "coupon" | "note">("add");
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<OrderItem | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<OrderItem | null>(null);

  const subtotal = items.reduce(
    (sum, item) => Math.round(sum + item.price * item.quantity - item.discount),
    0
  );
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  const handleRemoveClick = (item: OrderItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
    setSwipedItemId(null); // Reset swipe state
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onRemoveItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEditClick = (item: OrderItem) => {
    setItemToEdit(item);
    setShowEditModal(true);
    setSwipedItemId(null); // Reset swipe state
  };

  const handleUpdateFromModal = (quantity: number, notes?: string, discount?: number) => {
    if (itemToEdit) {
      onUpdateQuantity(itemToEdit.id, quantity);
      onUpdateDiscount(itemToEdit.id, discount || 0);
      onUpdateNotes(itemToEdit.id, notes);
      setShowEditModal(false);
      setItemToEdit(null);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setItemToEdit(null);
  };

  // Find the menu item for the item being edited
  const editMenuItemData = itemToEdit
    ? menuItems.find((mi) => mi.id === itemToEdit.menuItemId)
    : null;

  return (
    <>
      <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-gray-200 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <Button
              onClick={onAddCustomer}
              variant="outline"
              size="sm"
              className="flex-1 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {customerName || "Add Customer"}
            </Button>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-16 h-16 mb-2" />
              <p className="text-sm">No items in order</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <SwipeableItem
                  key={item.id}
                  item={item}
                  index={index}
                  onRemoveClick={() => handleRemoveClick(item)}
                  onEditClick={() => handleEditClick(item)}
                  swipedItemId={swipedItemId}
                  onSwipeChange={setSwipedItemId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 text-sm">
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 py-2 ${
                activeTab === "add"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
            >
              Add
            </button>
            <button
              onClick={() => setActiveTab("discount")}
              className={`flex-1 py-2 ${
                activeTab === "discount"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
            >
              Discount
            </button>
            <button
              onClick={() => setActiveTab("coupon")}
              className={`flex-1 py-2 ${
                activeTab === "coupon"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
            >
              Coupon
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`flex-1 py-2 ${
                activeTab === "note"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
            >
              Note
            </button>
          </div>

          {/* Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (11%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Payable Amount</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onHoldOrder}
              variant="outline"
              className="flex-1"
              disabled={items.length === 0}
            >
              Hold Order
            </Button>
            <Button
              onClick={onProceed}
              className="flex-1"
              disabled={items.length === 0}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center pt-6 pb-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hapus Item?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Apakah kamu yakin ingin menghapus{" "}
                <span className="font-semibold text-gray-900">{itemToDelete.name}</span>{" "}
                dari pesanan?
              </p>
            </div>

            {/* Buttons */}
            <div className="px-6 pb-6 space-y-2">
              <Button
                onClick={handleConfirmDelete}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
              >
                Hapus
              </Button>
              <Button
                onClick={handleCancelDelete}
                variant="outline"
                className="w-full h-12 border-gray-300 font-semibold"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && itemToEdit && editMenuItemData && (
        <ItemDetailModal
          item={editMenuItemData}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onAddToOrder={() => {}} // Not used in edit mode
          editMode={true}
          initialQuantity={itemToEdit.quantity}
          initialNotes={itemToEdit.notes || ""}
          initialDiscount={itemToEdit.discount || 0}
          onUpdateOrder={handleUpdateFromModal}
        />
      )}
    </>
  );
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
