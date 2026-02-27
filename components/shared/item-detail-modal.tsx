"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuItem } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { formatQuantity } from "@/lib/utils";

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (item: MenuItem, quantity: number, notes?: string, discount?: number) => void;
}

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onAddToOrder,
}: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);

  // Reset form when modal opens with new item
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(item.allow_half_portion ? 0.5 : 1);
      setNotes("");
      setDiscount(0);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleQuantityChange = (delta: number) => {
    const step = item.allow_half_portion ? 0.5 : 1;
    const minQty = item.allow_half_portion ? 0.5 : 1;
    const newQty = quantity + delta * step;
    if (newQty >= minQty) {
      setQuantity(newQty);
    }
  };

  const handleAddToOrder = () => {
    onAddToOrder(item, quantity, notes || undefined, discount || 0);
    onClose();
  };

  const subtotal = item.price * quantity - discount;

  // Mock description based on category
  const getDescription = () => {
    const descriptions: Record<string, string> = {
      Lunch: "Delicious noodles prepared with fresh ingredients and authentic spices.",
      Starters: "Perfect appetizer to start your meal, served hot and fresh.",
      Breakfast: "Hearty breakfast dish to energize your morning.",
      Supper: "Traditional Indonesian dish with rich flavors and tender meat.",
      Desserts: "Sweet treat to complete your dining experience.",
      Beverages: "Refreshing drink made with premium ingredients.",
    };
    return descriptions[item.category] || "Delicious dish prepared with care and quality ingredients.";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden animate-scaleIn flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg border border-gray-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content - 2 Column Layout */}
        <div className="flex flex-col md:flex-row overflow-hidden">
          {/* Left Column - Image */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100 overflow-hidden flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full bg-gradient-to-br flex items-center justify-center",
                  item.gradient || "from-gray-300 to-gray-400"
                )}
              >
                <span className="text-white text-6xl font-bold opacity-20">
                  {item.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Right Column - Details & Form */}
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
            <div className="p-6 flex-1">
              {/* Item Info */}
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">
                  {item.name}
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {item.category}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {getDescription()}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Quantity Selector */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Quantity
                  </label>
                  {item.allow_half_portion && (
                    <span className="text-xs text-primary font-medium">
                      ½ porsi tersedia
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= (item.allow_half_portion ? 0.5 : 1)}
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatQuantity(quantity)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Special Notes */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Request (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. no spicy, extra sauce..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Discount */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discount (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={discount || ""}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="h-11"
                    min="0"
                  />
                  <span className="text-gray-600 text-sm font-medium whitespace-nowrap">
                    Rp
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600">
                    {formatCurrency(item.price)} × {formatQuantity(quantity)}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(Math.round(item.price * quantity))}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-danger">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Subtotal</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(Math.round(subtotal))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="p-6 pt-0">
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToOrder}
                  className="flex-1 h-12 text-base font-semibold shadow-lg"
                >
                  Add to Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
