import { useState, useEffect } from "react";
import { MenuItem } from "./types";
import { menuItems as initialMenuItems } from "./mock-data";

const STORAGE_KEY = "pos-menu-items";

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load menu items from localStorage or use initial data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMenuItems(parsed);
      } else {
        // First time - save initial data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMenuItems));
        setMenuItems(initialMenuItems);
      }
    } catch (error) {
      console.error("Failed to load menu items:", error);
      setMenuItems(initialMenuItems);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a single menu item
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      // Save to localStorage immediately
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save menu items:", error);
      }
      return updated;
    });
  };

  // Add a new menu item
  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save menu items:", error);
      }
      return updated;
    });
  };

  // Delete a menu item
  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => {
      const updated = prev.filter((item) => item.id !== itemId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save menu items:", error);
      }
      return updated;
    });
  };

  // Reset to initial data (for testing/debugging)
  const resetMenuItems = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMenuItems));
      setMenuItems(initialMenuItems);
    } catch (error) {
      console.error("Failed to reset menu items:", error);
    }
  };

  return {
    menuItems,
    isLoading,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    resetMenuItems,
  };
}
