"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, PurchaseMode } from "@/types";
import { getCostumeById } from "@/lib/costumes";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalSOL: number;
  addItem: (costumeId: string, mode: PurchaseMode) => void;
  removeItem: (costumeId: string) => void;
  updateMode: (costumeId: string, mode: PurchaseMode) => void;
  updateQuantity: (costumeId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((costumeId: string, mode: PurchaseMode) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.costumeId === costumeId && i.mode === mode
      );
      if (existing) {
        return prev.map((i) =>
          i.costumeId === costumeId && i.mode === mode
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { costumeId, mode, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((costumeId: string) => {
    setItems((prev) => prev.filter((i) => i.costumeId !== costumeId));
  }, []);

  const updateMode = useCallback((costumeId: string, mode: PurchaseMode) => {
    setItems((prev) =>
      prev.map((i) => (i.costumeId === costumeId ? { ...i, mode } : i))
    );
  }, []);

  const updateQuantity = useCallback((costumeId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.costumeId === costumeId
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const totalSOL = items.reduce((sum, i) => {
    const costume = getCostumeById(i.costumeId);
    if (!costume) return sum;
    const price = i.mode === "buy" ? costume.buyPrice : costume.rentPrice;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalSOL,
        addItem,
        removeItem,
        updateMode,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
