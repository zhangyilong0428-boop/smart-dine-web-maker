// 1. 文件最顶部：先写运行时声明
export const runtime = "edge";

// 2. 导入所有需要的模块
import { Suspense } from "react";
import { BestSellers } from "@/components/menu/best-sellers";
import { MenuGrid } from "@/components/menu/menu-grid";
import { SearchBar } from "@/components/menu/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { listCategories, listItems, bestSellers } from "@/lib/api/menu";

export const metadata = {
  title: "菜单",
  description: "Yilong 主厨菜单 · 实时库存 · 个性化推荐",
};

// 3. 数据组件：获取菜单数据（服务端组件）
async function MenuContent() {
  const [categories, items, top] = await Promise.all([
    listCategories(),
    listItems(),
    bestSellers(8),
  ]);

  return (
    <>
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
        <BestSellers items={top} />
      </Suspense>

      <div className="sticky top-[68px] z-20 -mx-4 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <SearchBar />
      </div>

      <MenuGrid categories={categories} items={items} />
    </>
  );
}

// 4. 主页面组件：必须是 async 函数，提前获取 items 数据
export default async function MenuPage() {
  // 提前获取 items 数据，用于显示商品数量
  const items = await listItems();

  return (
    <div className="container space-y-10">
      <header className="space-y-2 pt-2">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          chefs table · spring 2026
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          今日菜单
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          懂工出好味，一秒下单，三分钟上桌，当前展示{" "}
          <span className="font-semibold text-foreground">{items.length}</span>{" "}
          道菜品，按热销与个性化偏好动态排序。
        </p>
      </header>

      {/* 用 Suspense 包裹数据组件，显示加载状态 */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <MenuContent />
      </Suspense>
    </div>
  );
}
