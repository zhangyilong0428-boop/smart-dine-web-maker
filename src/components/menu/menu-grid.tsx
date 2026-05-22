"use client";

import { useMemo } from "react";
import { useDebounce } from "use-debounce";
import { AnimatePresence, motion } from "framer-motion";

import { ItemCard } from "@/components/menu/item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUi } from "@/store/ui";
import type { Category, Item } from "@/lib/supabase/types";

import { CategoryTabs } from "./category-tabs";

interface MenuGridProps {
  categories: Category[];
  items: Item[];
  loading?: boolean;
}

export function MenuGrid({ categories, items, loading }: MenuGridProps) {
  const activeId = useUi((s) => s.activeCategoryId);
  const setActiveId = useUi((s) => s.setActiveCategoryId);
  const query = useUi((s) => s.searchQuery);
  const [debounced] = useDebounce(query, 220);

  // Client-side filter: instant feedback, no roundtrip per keystroke.
  // Server-side full-text kicks in via /api/items?search= (used elsewhere).
  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return items.filter((i) => {
      if (activeId && i.category_id !== activeId) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        (i.description ?? "").toLowerCase().includes(q) ||
        (i.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, activeId, debounced]);

  return (
    <section className="space-y-6">
      <CategoryTabs
        categories={categories}
        activeId={activeId}
        onChange={setActiveId}
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState query={debounced} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
              >
                <ItemCard item={item} priority={idx < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
      <p className="font-display text-lg font-semibold">暂无相关菜品</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {query ? `没有匹配「${query}」的结果，` : ""}试试切换分类或更换关键词。
      </p>
    </div>
  );
}
