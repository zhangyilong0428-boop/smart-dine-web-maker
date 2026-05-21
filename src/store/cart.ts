"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartLine {
  /** Stable composite key for an item + selected options. */
  key: string;
  itemId: string;
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  optionsSummary?: string;
}

interface CartState {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line, qty = 1) =>
        set((s) => {
          const idx = s.lines.findIndex((l) => l.key === line.key);
          if (idx >= 0) {
            const next = s.lines.slice();
            const existing = next[idx]!;
            next[idx] = { ...existing, quantity: existing.quantity + qty };
            return { lines: next };
          }
          return { lines: [...s.lines, { ...line, quantity: qty }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, quantity: qty } : l)),
        })),
      remove: (key) =>
        set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "dine.cart.v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const cartSelectors = {
  count: (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0),
  subtotal: (s: CartState) =>
    s.lines.reduce((n, l) => n + l.quantity * l.unitPrice, 0),
};
