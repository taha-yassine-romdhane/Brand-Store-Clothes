"use client";

import { useCart } from "@/lib/context/cart-context";

export function CartStatus() {
  const { totalItems } = useCart();

  return totalItems > 0 ? (
    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {totalItems}
    </span>
  ) : null;
} 