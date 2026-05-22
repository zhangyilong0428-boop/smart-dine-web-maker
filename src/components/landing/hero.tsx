import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Hero — intentionally non-animated.
 *
 * Earlier versions wrapped the headline in `motion.h1` with `initial={{ opacity: 0 }}`.
 * Next.js renders that initial state into the SSR HTML, so a slow JS chunk or a
 * hydration hiccup leaves users staring at an invisible page. For above-the-fold
 * content, "always visible" beats "fades in nicely" — the choreography lives in
 * the sections below, which only animate when their viewport entries fire.
 */
export function Hero() {
  return (
    <section
      aria-label="hero"
      className="relative isolate overflow-hidden rounded-[2.5rem] border border-border/60 px-6 py-16 sm:px-12 sm:py-24"
    >
      <div aria-hidden className="aurora" />
      <div aria-hidden className="bg-grid absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-start gap-6 sm:items-center sm:text-center">
        <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
          <Sparkles className="size-3.5 text-primary" />
          Yilong v0.1 · Smart Dining OS by <span className="font-semibold">张艺泷</span>
        </span>

        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          重新定义
          <br />
          <span className="text-aurora">点餐体验</span>
        </h1>

        <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          Aurora 设计语言 · Supabase Realtime 订单同步 · AI 个性化推荐。 一套从设计
          token 到数据库 RLS 都自己写的智能点单系统，由独立开发者
          <span className="font-medium text-foreground"> 张艺泷 </span>
          打造。
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/menu"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_hsl(var(--primary)/0.6)] transition-all hover:shadow-[0_14px_36px_-8px_hsl(var(--primary)/0.7)] hover:brightness-105 active:scale-[0.98]"
          >
            进入菜单
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card/40 px-6 text-sm font-medium backdrop-blur transition-colors hover:bg-card"
          >
            关于作者
          </Link>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {[
            "Next.js 14 App Router",
            "Supabase Realtime",
            "TypeScript strict",
            "PWA",
            "RLS",
          ].map((label) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary/70" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
