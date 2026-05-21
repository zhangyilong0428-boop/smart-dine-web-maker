import { Suspense } from "react";

import { BestSellers } from "@/components/menu/best-sellers";
import { MenuGrid } from "@/components/menu/menu-grid";
import { SearchBar } from "@/components/menu/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { bestSellers, listCategories, listItems } from "@/lib/api/menu";

export const revalidate = 60; // ISR — fresh menu every minute, edge-cached.

export default async function HomePage() {
  // Parallel fetches keep TTFB low.
  const [categories, items, top] = await Promise.all([
    listCategories(),
    listItems(),
    bestSellers(8),
  ]);

  return (
    <div className="container space-y-10">
      <Hero />

      <Suspense fallback={<RailFallback />}>
        <BestSellers items={top} />
      </Suspense>

      <div className="sticky top-[68px] z-20 -mx-4 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <SearchBar />
      </div>

      <MenuGrid categories={categories} items={items} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/15 via-card/40 to-background p-6 sm:p-10">
      <div className="relative z-10 max-w-2xl">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">
          chef’s table · 2026 spring
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          慢工出好味，
          <br className="hidden sm:block" />
          一秒下单，三分钟上桌。
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          基于实时库存与个性化推荐的智能点餐体验。Next.js · Supabase · 设计系统
          一体化，性能与美感同时在线。
        </p>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 size-72 rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-10 size-72 rounded-full bg-accent/40 blur-3xl"
      />
    </section>
  );
}

function RailFallback() {
  return (
    <div className="-mx-4 flex gap-3 overflow-hidden px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-64 shrink-0" />
      ))}
    </div>
  );
}
