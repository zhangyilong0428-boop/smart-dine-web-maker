import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        我们找不到这道菜
      </h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        链接可能已经失效，或菜品已下架。回到主页继续点单吧。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.55)] transition-all hover:brightness-105 active:scale-[0.98]"
      >
        返回首页
      </Link>
    </div>
  );
}
