"use client";

import { useCart } from "@/lib/context/cart-context";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function CartIndicator() {
  const { totalItems } = useCart();

  return (
    <Button variant="ghost" className="relative">
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <Badge 
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
} 