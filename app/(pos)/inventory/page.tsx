"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "@/lib/types";
import { Search, Plus, Edit2, Trash2, X, Package, CheckCircle2, XCircle, Upload, Image as ImageIcon, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateMenuCode } from "@/lib/utils";
import { useMenuItems } from "@/lib/useMenuItems";

export default function InventoryPage() {
  const { menuItems, isLoading, updateMenuItem, addMenuItem, deleteMenuItem } = useMenuItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showCategoryChangeDialog, setShowCategoryChangeDialog] = useState(false);
  const [pendingCategory, setPendingCategory] = useState("");
  const [originalCategory, setOriginalCategory] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "Lunch",
    price: 0,
    cost: 0,
    image: "",
    description: "",
    allow_half_portion: false,
    available: true,
  });

  // Auto-generate code when category changes (for new items only)
  useEffect(() => {
    if (!editingItem && formData.category) {
      try {
        const newCode = generateMenuCode(formData.category, menuItems);
        setFormData(prev => ({ ...prev, code: newCode }));
      } catch (error) {
        if (error instanceof Error) {
          showNotification(error.message, "error");
        }
      }
    }
  }, [formData.category, editingItem, menuItems]);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ["Semua", "Starters", "Breakfast", "Lunch", "Supper", "Desserts", "Beverages"];

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Summary stats
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.available).length;
  const halfPortionItems = menuItems.filter(item => item.allow_half_portion).length;
  const totalCategories = new Set(menuItems.map(item => item.category)).size;

  const handleAddNew = () => {
    setEditingItem(null);
    setImagePreview("");
    const initialCategory = "Lunch";
    const newCode = generateMenuCode(initialCategory, menuItems);
    setFormData({
      code: newCode,
      name: "",
      category: initialCategory,
      price: 0,
      cost: 0,
      image: "",
      description: "",
      allow_half_portion: false,
      available: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setImagePreview(item.image || "");
    setOriginalCategory(item.category);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      price: item.price,
      cost: item.cost,
      image: item.image || "",
      description: item.description || "",
      allow_half_portion: item.allow_half_portion,
      available: item.available,
    });
    setShowModal(true);
  };

  const handleCategoryChange = (newCategory: string) => {
    if (editingItem && newCategory !== originalCategory) {
      // Show confirmation dialog
      setPendingCategory(newCategory);
      setShowCategoryChangeDialog(true);
    } else {
      // For new items, just update
      setFormData({ ...formData, category: newCategory });
    }
  };

  const confirmCategoryChange = () => {
    try {
      const newCode = generateMenuCode(pendingCategory, menuItems);
      setFormData({ ...formData, category: pendingCategory, code: newCode });
      setShowCategoryChangeDialog(false);
      showNotification("Kategori dan kode menu berhasil diubah");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    }
  };

  const cancelCategoryChange = () => {
    setShowCategoryChangeDialog(false);
    setPendingCategory("");
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      showNotification("Nama dan kode menu harus diisi", "error");
      return;
    }

    if (editingItem) {
      // Update existing item
      const updatedItem: MenuItem = {
        ...editingItem,
        code: formData.code,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        cost: formData.cost,
        image: formData.image,
        description: formData.description,
        allow_half_portion: formData.allow_half_portion,
        available: formData.available,
      };
      updateMenuItem(updatedItem);
      showNotification(`Menu "${formData.name}" berhasil diupdate`);
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: `item${Date.now()}`,
        code: formData.code,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        cost: formData.cost,
        image: formData.image,
        description: formData.description,
        available: formData.available,
        allow_half_portion: formData.allow_half_portion,
      };
      addMenuItem(newItem);
      showNotification(`Menu "${formData.name}" berhasil ditambahkan`);
    }
    
    setShowModal(false);
  };

  const handleDelete = (item: MenuItem) => {
    if (confirm(`Hapus menu "${item.name}"?`)) {
      deleteMenuItem(item.id);
      showNotification(`Menu "${item.name}" berhasil dihapus`);
    }
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Loading menu items...</div>
        </div>
      ) : (
        <>
          {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Master Menu</h1>
          <p className="text-gray-600">Kelola menu dan inventori restoran</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Menu
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Menu</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tersedia</p>
              <p className="text-2xl font-bold">{availableItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary">½</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Support ½ Porsi</p>
              <p className="text-2xl font-bold">{halfPortionItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">#</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kategori</p>
              <p className="text-2xl font-bold">{totalCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama atau kode menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                    item.available
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.available ? "Tersedia" : "Habis"}
                </span>
              </div>

              {item.allow_half_portion && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                    ½ Porsi
                  </span>
                </div>
              )}

              <div className="absolute bottom-2 left-2">
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{item.code}</p>
              <h3 className="font-semibold text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                {item.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Harga Jual</span>
                  <span className="text-primary font-bold">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">HPP</span>
                  <span className="font-medium">
                    Rp {item.cost.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                  <span className="text-gray-600">Profit</span>
                  <span className="text-green-600 font-bold">
                    Rp {(item.price - item.cost).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Tidak ada menu ditemukan</h3>
          <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {editingItem ? "Edit Menu" : "Tambah Menu Baru"}
                </h2>
                <p className="text-gray-600 text-sm">Lengkapi informasi menu di bawah ini</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-5 gap-6 overflow-y-auto">
              {/* Left Column - Image Upload (2 cols) */}
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Gambar Menu
                  </label>
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              setImagePreview("");
                              setFormData({ ...formData, image: "" });
                            }}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-orange-50 transition-all bg-gray-50">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 mb-1">Upload Gambar</span>
                        <span className="text-xs text-gray-500">PNG, JPG hingga 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Toggle Switches */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold text-sm">Izinkan ½ Porsi</p>
                      <p className="text-xs text-gray-600">Customer bisa pesan setengah porsi</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, allow_half_portion: !formData.allow_half_portion })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.allow_half_portion ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                          formData.allow_half_portion ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold text-sm">Status Ketersediaan</p>
                      <p className="text-xs text-gray-600">Menu tersedia untuk dijual</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, available: !formData.available })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        formData.available ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                          formData.available ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields (3 cols) */}
              <div className="col-span-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Kode Menu
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formData.code || "Pilih kategori dulu"}
                        readOnly
                        className="bg-gray-50 cursor-not-allowed pr-20"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                          Auto
                        </span>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Supper">Supper</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nama Menu
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Schezwan Egg Noodles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi singkat menu..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Harga Jual (Rp)
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      placeholder="24000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      HPP / Cost (Rp)
                    </label>
                    <Input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                      placeholder="12000"
                    />
                  </div>
                </div>

                {/* Profit Display */}
                {formData.price > 0 && formData.cost > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Profit per Item</span>
                      <span className="text-xl font-bold text-green-600">
                        Rp {(formData.price - formData.cost).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Margin Keuntungan</span>
                      <span className="text-sm font-semibold text-green-600">
                        {((formData.price - formData.cost) / formData.price * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
              >
                {editingItem ? "Update Menu" : "Simpan Menu"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${
            toastType === "success" 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          }`}>
            {toastType === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Category Change Confirmation Dialog */}
      {showCategoryChangeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <h3 className="text-xl font-bold mb-3">Konfirmasi Perubahan Kategori</h3>
            <p className="text-gray-600 mb-6">
              Mengubah kategori akan mengubah kode menu secara otomatis. Apakah Anda yakin ingin melanjutkan?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={cancelCategoryChange}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Batal
              </Button>
              <Button
                onClick={confirmCategoryChange}
                className="flex-1"
              >
                Ya, Lanjutkan
              </Button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
