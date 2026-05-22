// 1. 文件最顶部：先写运行时声明
export const runtime = "edge";

// 2. 然后是所有导入（注意：服务端组件不能直接用 useState/useEffect）
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

// 3. 服务端数据组件（纯服务端逻辑，不能用 'use client'）
async function MenuData() {
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

// 4. 客户端组件：必须单独声明 'use client'，放在文件的最前面或单独文件
("use client");
import { useState, useEffect } from "react";

function ClientItemCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 这里先简化，直接调用 listItems 接口获取数量
    fetch("/api/menu/items-count")
      .then((res) => res.json())
      .then((data) => setCount(data.count || 0))
      .catch(() => setCount(0));
  }, []);

  return <>{count}</>;
}

// 5. 主页面组件（服务端组件，只渲染骨架和 Suspense）
export default function MenuPage() {
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
          <span className="font-semibold text-foreground">
            <ClientItemCount />
          </span>{" "}
          道菜品，按热销与个性化偏好动态排序。
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <MenuData />
      </Suspense>
    </div>
  );
}
