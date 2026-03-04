import { Order, OrderItem } from "./types";

export function canMergeOrders(
  order1: Order,
  order2: Order
): { canMerge: boolean; reason?: string } {
  // Cannot merge with itself
  if (order1.id === order2.id) {
    return { canMerge: false, reason: "Tidak bisa menggabung order dengan dirinya sendiri" };
  }

  // Cannot merge completed orders
  if (order1.status === "completed" || order2.status === "completed") {
    return { canMerge: false, reason: "Tidak bisa menggabung order yang sudah selesai" };
  }

  // Cannot merge cancelled orders
  if (order1.status === "cancelled" || order2.status === "cancelled") {
    return { canMerge: false, reason: "Tidak bisa menggabung order yang dibatalkan" };
  }

  // Warn if different cashiers (but allow)
  if (order1.cashierId !== order2.cashierId) {
    return {
      canMerge: true,
      reason: "Order dari kasir berbeda. Lanjutkan?",
    };
  }

  return { canMerge: true };
}

export function mergeOrders(primaryOrder: Order, secondaryOrder: Order): Order {
  // Combine items from both orders
  const combinedItems: OrderItem[] = [
    ...primaryOrder.items,
    ...secondaryOrder.items,
  ];

  // Recalculate totals
  const subtotal = combinedItems.reduce(
    (sum, item) => sum + item.price * item.quantity - item.discount,
    0
  );
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  // Create merged order
  const mergedOrder: Order = {
    ...primaryOrder,
    items: combinedItems,
    subtotal: Math.round(subtotal),
    tax,
    total,
    discount: primaryOrder.discount + secondaryOrder.discount,
    mergedFromOrderIds: [
      ...(primaryOrder.mergedFromOrderIds || []),
      secondaryOrder.id,
      ...(secondaryOrder.mergedFromOrderIds || []),
    ],
    mergedAt: new Date(),
    updatedAt: new Date(),
  };

  return mergedOrder;
}

export function calculateMergedTotal(orders: Order[]): {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
} {
  const allItems = orders.flatMap((order) => order.items);
  
  const subtotal = allItems.reduce(
    (sum, item) => sum + item.price * item.quantity - item.discount,
    0
  );
  
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal),
    tax,
    total,
    itemCount: allItems.length,
  };
}
