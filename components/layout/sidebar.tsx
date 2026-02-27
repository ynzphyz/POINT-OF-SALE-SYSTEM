"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Grid3x3,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Tables", href: "/tables", icon: Grid3x3 },
  { name: "Cashier", href: "/cashier", icon: ShoppingCart },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = navigation.findIndex(
      (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname]);

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-secondary flex flex-col items-center py-6 z-50 shadow-xl">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">R</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3 relative">
        {/* Animated Background */}
        <div
          className="absolute left-3 w-14 h-14 bg-primary rounded-xl shadow-lg transition-all duration-300 ease-out"
          style={{
            top: `${activeIndex * (56 + 8)}px`,
          }}
        />

        {navigation.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all duration-200 group relative z-10 h-14",
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
              
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Link
        href="/login"
        className="flex flex-col items-center justify-center gap-1 py-3 text-gray-400 hover:text-white transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-[10px] font-medium">Logout</span>
      </Link>
    </div>
  );
}
