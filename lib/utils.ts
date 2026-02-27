import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  return `ORD-${timestamp}`;
}

export function calculateTax(amount: number, taxRate: number = 11): number {
  return Math.round((amount * taxRate) / 100);
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function formatQuantity(quantity: number): string {
  if (quantity % 1 === 0) {
    // Whole number
    return quantity.toString();
  }
  
  const whole = Math.floor(quantity);
  const decimal = quantity - whole;
  
  if (decimal === 0.5) {
    return whole === 0 ? "½" : `${whole}½`;
  }
  
  return quantity.toString();
}

// Auto-generate menu code utilities
export function getCategoryPrefix(category: string): string {
  const categoryMap: Record<string, string> = {
    "Starters": "STR",
    "Breakfast": "BRK",
    "Lunch": "LCH",
    "Supper": "SUP",
    "Desserts": "DST",
    "Beverages": "BVR",
    "Makanan": "MKN",
    "Minuman": "MNM",
    "Tambahan": "TMB",
  };

  // Check if category exists in map
  if (categoryMap[category]) {
    return categoryMap[category];
  }

  // For any other category, take first 3 letters uppercase
  return category.substring(0, 3).toUpperCase();
}

export function generateMenuCode(category: string, existingItems: any[]): string {
  if (!category) {
    return "";
  }

  const prefix = getCategoryPrefix(category);
  
  // Filter items by category
  const categoryItems = existingItems.filter(item => item.category === category);
  
  // Find highest sequence number
  let maxSequence = 0;
  categoryItems.forEach(item => {
    if (item.code && item.code.startsWith(prefix)) {
      const sequencePart = item.code.split('-')[1];
      if (sequencePart) {
        const sequence = parseInt(sequencePart, 10);
        if (!isNaN(sequence) && sequence > maxSequence) {
          maxSequence = sequence;
        }
      }
    }
  });

  // Increment and format
  const nextSequence = maxSequence + 1;
  
  // Check if reaching limit
  if (nextSequence > 999) {
    throw new Error(`Kode menu untuk kategori ${category} sudah penuh (max 999)`);
  }

  // Format with zero padding
  const sequenceStr = nextSequence.toString().padStart(3, '0');
  
  return `${prefix}-${sequenceStr}`;
}
