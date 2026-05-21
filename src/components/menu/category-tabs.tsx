"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/supabase/types";

interface CategoryTabsProps {
  categories: Category[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}

export function CategoryTabs({ categories, activeId, onChange }: CategoryTabsProps) {
  const items = [{ id: null, name: "全部" } as const, ...categories];

  return (
    <nav
      role="tablist"
      aria-label="菜品分类"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1"
    >
      {items.map((c) => {
        const active = activeId === c.id;
        return (
          <button
            key={c.id ?? "all"}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c.id)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 rounded-full bg-primary shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.7)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{c.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
