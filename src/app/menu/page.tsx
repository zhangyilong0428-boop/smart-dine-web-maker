export const runtime = "edge";
import { Suspense } from "react";

import { BestSellers } from "@/components/menu/best-sellers";
import { MenuGrid } from "@/components/menu/menu-grid";
import { SearchBar } from "@/components/menu/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { bestSellers, listCategories, listItems } from "@/lib/api/menu";

export const revalidate = 60;

export const metadata = {
  title: "菜单",
  description: "Yilong 主厨菜单 · 实时库存 · 个性化推荐",
};

export default async function MenuPage() {
  const [categories, items, top] = await Promise.all([
    listCategories(),
    listItems(),
    bestSellers(8),
  ]);

  return (
    <div className="container space-y-10">
      <header className="space-y-2 pt-2">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          chef’s table · spring 2026
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          今日菜单
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          慢工出好味，一秒下单，三分钟上桌。当前展示{" "}
          <span className="font-semibold text-foreground">{items.length}</span>{" "}
          道菜品，按热销与个性化偏好动态排序。
        </p>
      </header>

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

function RailFallback() {
  return (
    <div className="-mx-4 flex gap-3 overflow-hidden px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-64 shrink-0" />
      ))}
    </div>
  );
}
