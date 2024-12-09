"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductImage } from "@prisma/client";

type CartItem = Product & {
  images: ProductImage[];
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product & { images: ProductImage[] }, size: string, color: string) => void;
  removeItem: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, quantity: number, size: string, color: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product & { images: ProductImage[] }, size: string, color: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        { ...product, quantity: 1, selectedSize: size, selectedColor: color },
      ];
    });
  };

  const removeItem = (productId: number, size: string, color: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const updateQuantity = (productId: number, quantity: number, size: string, color: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}