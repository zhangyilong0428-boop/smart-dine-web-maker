"use client";

import { useEffect, useState } from "react";
import { Activity, Database, Layers, ScanSearch, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * SSR safety: `initial` is suppressed until the client mounts so the static
 * HTML renders at the visible end-state. See landing/reveal.tsx for the
 * full rationale.
 */

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI 个性化推荐",
    description:
      "基于用户历史品类与全局热销的协同推荐，冷启动用户回落到全局排行。规则透明、不依赖黑盒 LLM。",
    span: "lg:col-span-2 lg:row-span-2",
    art: <RecommendArt />,
  },
  {
    icon: Activity,
    title: "实时订单同步",
    description: "WebSocket 订阅 orders.id，状态机端到端推送。",
    span: "",
    art: <RealtimeArt />,
  },
  {
    icon: ScanSearch,
    title: "Postgres 全文搜索",
    description: "tsvector 生成列 + GIN 索引，220ms 防抖。",
    span: "",
    art: <SearchArt />,
  },
  {
    icon: Database,
    title: "RLS 行级安全",
    description: "权限下沉到数据库层，应用层不可绕过。",
    span: "lg:col-span-2",
    art: <RlsArt />,
  },
  {
    icon: Layers,
    title: "Aurora 设计语言",
    description: "CSS variables 双主题，零运行时切换。",
    span: "",
    art: <PaletteArt />,
  },
  {
    icon: Wand2,
    title: "Server Components",
    description: "RSC + ISR 60s 边缘缓存，首屏直出。",
    span: "",
    art: <RscArt />,
  },
];

export function Bento() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section aria-labelledby="features-heading" className="space-y-6">
      <header className="space-y-2 sm:text-center">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          features
        </p>
        <h2
          id="features-heading"
          className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          这不是普通点餐系统
        </h2>
        <p className="mx-auto max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">
          每一项都对应一段真实代码，而不是产品 PPT。点击菜单页就能看到它们工作的样子。
        </p>
      </header>

      <div className="grid auto-rows-[14rem] grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.article
              key={f.title}
              initial={mounted ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className={cn(
                "glass ring-inner-soft group relative overflow-hidden rounded-3xl p-5 transition-shadow",
                "hover:shadow-[0_24px_60px_-24px_hsl(var(--primary)/0.4)]",
                f.span,
              )}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="font-display font-bold tracking-tight">{f.title}</h3>
                </div>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {f.description}
                </p>
                <div className="relative mt-auto flex-1">{f.art}</div>
              </div>
              <div
                aria-hidden
                className="absolute -right-10 -top-10 size-32 rounded-full bg-accent/15 opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
              />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------- bento art bits ---------------------------- */

function RecommendArt() {
  return (
    <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-2 px-1">
      {["和牛", "拉面", "战斧", "可丽露", "冷萃", "藜麦"].map((t, i) => (
        <motion.div
          key={t}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.06 }}
          className={cn(
            "rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs",
            i === 0 && "border-primary/50 bg-primary/10 text-primary",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{t}</span>
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {(0.98 - i * 0.08).toFixed(2)}
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(0.98 - i * 0.08) * 100}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.7 }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RealtimeArt() {
  const steps = ["pending", "paid", "preparing", "ready"];
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center gap-1">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          className="flex-1 rounded-full px-2 py-1 text-center text-[10px] font-medium"
          initial={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
          whileInView={{
            background: i <= 2 ? "hsl(var(--primary))" : "hsl(var(--muted))",
            color:
              i <= 2
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--muted-foreground))",
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 * i, duration: 0.4 }}
        >
          {s}
        </motion.div>
      ))}
    </div>
  );
}

function SearchArt() {
  return (
    <div className="absolute inset-x-0 bottom-0 space-y-1.5 font-mono text-[11px]">
      <div className="rounded-lg border border-border/60 bg-card/60 px-2 py-1 text-muted-foreground">
        <span className="text-primary">$</span> select * from items where
      </div>
      <div className="rounded-lg border border-border/60 bg-card/60 px-2 py-1">
        <span className="text-primary">search_vec</span> @@ websearch_to_tsquery(
        <span className="text-accent">'松露'</span>)
      </div>
    </div>
  );
}

function RlsArt() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 font-mono text-[11px]">
      <div className="flex-1 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-2 py-1.5 text-emerald-600 dark:text-emerald-400">
        <span className="opacity-60">policy</span> auth.uid() = user_id
      </div>
      <div className="flex-1 rounded-lg border border-destructive/40 bg-destructive/5 px-2 py-1.5 text-destructive">
        <span className="opacity-60">deny</span> other users' rows
      </div>
    </div>
  );
}

function PaletteArt() {
  const swatches = [
    "bg-primary",
    "bg-[hsl(var(--brand-fire-to))]",
    "bg-accent",
    "bg-foreground",
    "bg-secondary",
    "bg-card",
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 flex gap-1.5">
      {swatches.map((s, i) => (
        <motion.span
          key={s}
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * i, type: "spring" }}
          className={cn("h-8 flex-1 rounded-md border border-border/40", s)}
        />
      ))}
    </div>
  );
}

function RscArt() {
  return (
    <div className="absolute inset-x-0 bottom-0 space-y-1 font-mono text-[11px]">
      <div className="rounded-lg border border-border/60 bg-card/60 px-2 py-1 text-muted-foreground">
        <span className="text-primary">async</span> page.tsx
      </div>
      <div className="rounded-lg border border-accent/50 bg-accent/10 px-2 py-1">
        <span className="text-accent-foreground">revalidate = 60</span>
      </div>
    </div>
  );
}
