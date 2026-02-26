import { cn } from "@/lib/utils";
import { OrderStatus, OrderType, TableStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: OrderStatus | OrderType | TableStatus | string;
  type?: "order" | "table" | "orderType";
}

export function StatusBadge({ status, type = "order" }: StatusBadgeProps) {
  const getStyles = () => {
    if (type === "order") {
      switch (status as OrderStatus) {
        case "in_progress":
          return "bg-blue-100 text-blue-700";
        case "ready_to_serve":
          return "bg-purple-100 text-purple-700";
        case "waiting_payment":
          return "bg-yellow-100 text-yellow-700";
        case "completed":
          return "bg-success/10 text-success";
        case "cancelled":
          return "bg-danger/10 text-danger";
        default:
          return "bg-gray-100 text-gray-700";
      }
    }

    if (type === "table") {
      switch (status as TableStatus) {
        case "available":
          return "bg-success/10 text-success";
        case "occupied":
          return "bg-danger/10 text-danger";
        case "reserved":
          return "bg-yellow-100 text-yellow-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    }

    if (type === "orderType") {
      switch (status as OrderType) {
        case "dine_in":
          return "bg-blue-100 text-blue-700";
        case "take_away":
          return "bg-orange-100 text-orange-700";
        case "delivery":
          return "bg-purple-100 text-purple-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    }

    return "bg-gray-100 text-gray-700";
  };

  const getLabel = () => {
    return status
      .toString()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStyles()
      )}
    >
      {getLabel()}
    </span>
  );
}
