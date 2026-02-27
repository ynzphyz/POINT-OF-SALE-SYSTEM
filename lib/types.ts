export type Role = "admin" | "manager" | "cashier" | "waiter" | "kitchen";

export interface Employee {
  id: string;
  name: string;
  role: Role;
  pin: string;
  phone: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
  lastLogin?: Date;
}

export type OrderStatus = 
  | "in_progress" 
  | "ready_to_serve" 
  | "waiting_payment" 
  | "completed" 
  | "cancelled";

export type OrderType = "dine_in" | "take_away" | "delivery";

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  notes?: string;
  status?: "pending" | "cooking" | "ready";
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  tableId?: string;
  tableName?: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  cashierId: string;
  cashierName: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  image?: string;
  description?: string;
  available: boolean;
  gradient?: string;
  allow_half_portion: boolean;
}

export type MenuCategory = 
  | "All"
  | "Starters" 
  | "Breakfast" 
  | "Lunch" 
  | "Supper" 
  | "Desserts" 
  | "Beverages";

export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";
export type TableShape = "rectangle" | "circle" | "square";

export interface Table {
  id: string;
  name: string; // e.g. "A1", "VIP-1"
  number: string; // for backward compatibility
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  section: string;
  floor: string;
  position: {
    x: number; // percentage from canvas left (0-100)
    y: number; // percentage from canvas top (0-100)
  };
  size: {
    width: number; // in pixels
    height: number; // in pixels
  };
  rotation: number; // degrees 0-360
  activeOrderId?: string;
  reservationId?: string;
  customerName?: string;
  seatedAt?: Date;
}

export type FloorElementType = "wall" | "door" | "plant" | "cashier" | "label";

export interface FloorElement {
  id: string;
  type: FloorElementType;
  position: {
    x: number; // percentage from canvas left (0-100)
    y: number; // percentage from canvas top (0-100)
  };
  size: {
    width: number; // in pixels
    height: number; // in pixels
  };
  rotation: number; // degrees 0-360
  label?: string;
  floor: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: Date;
  avatar?: string;
}

export type PaymentMethod = "cash" | "qris" | "debit" | "transfer";

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  amountReceived?: number;
  change?: number;
  reference?: string;
  timestamp: Date;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  startTime: Date;
  endTime?: Date;
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  totalOrders: number;
  totalCash: number;
  totalNonCash: number;
  status: "open" | "closed";
}

export interface Discount {
  id: string;
  name: string;
  code?: string;
  type: "percentage" | "nominal";
  value: number;
  minOrder?: number;
  validFrom: Date;
  validTo: Date;
  status: "active" | "inactive";
  applicableItems?: string[];
}

export interface StockItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  supplier?: string;
  lastRestocked?: Date;
}

export interface ReportData {
  date: string;
  sales: number;
  orders: number;
  avgOrder: number;
}
