"use client";

import { useState } from "react";
import { Search, Wifi, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderPanel } from "@/components/layout/order-panel";
import { ItemDetailModal } from "@/components/shared/item-detail-modal";
import { tables } from "@/lib/mock-data";
import { CATEGORIES, RESTAURANT_NAME } from "@/lib/constants";
import { MenuCategory, OrderItem, MenuItem } from "@/lib/types";
import { formatCurrency, generateOrderNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useMenuItems } from "@/lib/useMenuItems";

export default function CashierPage() {
  const { menuItems, isLoading } = useMenuItems();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | undefined>();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const handleItemClick = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsModalOpen(true);
  };

  const handleAddFromModal = (
    menuItem: MenuItem,
    quantity: number,
    notes?: string,
    discount?: number
  ) => {
    const existingItem = orderItems.find(
      (item) => item.menuItemId === menuItem.id && item.notes === notes
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.menuItemId === menuItem.id && item.notes === notes
            ? { ...item, quantity: item.quantity + quantity, discount: (item.discount || 0) + (discount || 0) }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        id: `oi-${Date.now()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity,
        discount: discount || 0,
        notes: notes,
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleUpdateDiscount = (itemId: string, discount: number) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId ? { ...item, discount } : item
      )
    );
  };

  const handleUpdateNotes = (itemId: string, notes?: string) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId ? { ...item, notes } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  const handleProceed = () => {
    if (orderItems.length === 0) return;
    // Navigate to payment or create order
    alert("Proceeding to payment...");
  };

  const handleHoldOrder = () => {
    if (orderItems.length === 0) return;
    alert("Order held successfully!");
    setOrderItems([]);
  };

  const handleSelectTable = (tableId: string) => {
    setSelectedTable(tableId);
    setIsTableModalOpen(false);
  };

  const availableTables = tables.filter(t => t.status === "available");
  const selectedTableData = tables.find(t => t.id === selectedTable);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 mr-[350px]">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{RESTAURANT_NAME}</h1>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Wifi className="w-5 h-5 text-success" />
              <Button 
                size="lg"
                onClick={() => setIsTableModalOpen(true)}
              >
                {selectedTableData ? selectedTableData.name : "Select Table"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 text-left group border border-gray-100 hover:border-primary/20"
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full bg-gradient-to-br flex items-center justify-center",
                        item.gradient || "from-gray-300 to-gray-400"
                      )}
                    >
                      <span className="text-white text-5xl font-bold opacity-20">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                    {item.name}
                  </h3>
                  <p className="text-primary font-bold text-base">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Panel */}
      <OrderPanel
        items={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateDiscount={handleUpdateDiscount}
        onUpdateNotes={handleUpdateNotes}
        onRemoveItem={handleRemoveItem}
        onAddCustomer={() => alert("Add customer modal")}
        onProceed={handleProceed}
        onHoldOrder={handleHoldOrder}
        customerName={customerName}
        menuItems={menuItems}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedMenuItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToOrder={handleAddFromModal}
      />

      {/* Table Selection Modal */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Pilih Meja</h2>
              <button
                onClick={() => setIsTableModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
              {availableTables.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Tidak ada meja tersedia</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {availableTables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => handleSelectTable(table.id)}
                      className={cn(
                        "p-6 rounded-xl border-2 transition-all hover:shadow-lg",
                        selectedTable === table.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      )}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          {table.name}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Kapasitas: {table.capacity} orang
                        </div>
                        <div className="text-xs text-gray-400">
                          {table.section}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
