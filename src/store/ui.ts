"use client";

import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeCategoryId: string | null;
  setActiveCategoryId: (v: string | null) => void;
}

export const useUi = create<UiState>((set) => ({
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  searchQuery: "",
  setSearchQuery: (v) => set({ searchQuery: v }),
  activeCategoryId: null,
  setActiveCategoryId: (v) => set({ activeCategoryId: v }),
}));
