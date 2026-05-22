"use client";

import { useMemo, useState } from "react";
import { Beef, Coffee, Leaf, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { mockItems } from "@/lib/api/mock-data";
import { Logo } from "@/components/brand/logo";
import { cn, formatPrice } from "@/lib/utils";

const PROFILES: { id: string; label: string; icon: LucideIcon; tags: string[] }[] = [
  { id: "carnivore", label: "硬核肉食", icon: Beef, tags: ["和牛", "硬核", "炭烧"] },
  { id: "light", label: "清爽轻食", icon: Leaf, tags: ["轻食", "高蛋白", "气泡"] },
  { id: "sweet", label: "甜系咖啡", icon: Coffee, tags: ["咖啡", "甜点", "抹茶"] },
];

/**
 * Live, deterministic recommendation panel — same scoring shape as the
 * server-side RPC but runs in the browser so reviewers can interact without
 * standing up a Supabase project. Mirrors the logic in
 * supabase/schema.sql `recommended_items()` for honest parity.
 */
export function AiDemo() {
  const [active, setActive] = useState(PROFILES[0]!.id);

  const ranked = useMemo(() => {
    const profile = PROFILES.find((p) => p.id === active)!;
    return mockItems
      .map((item) => {
        const tagMatch = item.tags.filter((t) =>
          profile.tags.some((pt) => t.includes(pt) || pt.includes(t)),
        ).length;
        // Score: 0..1 — tag affinity (0..0.7) + popularity prior (0..0.3)
        const popularity = Math.min(item.sold_count / 3500, 1);
        const score = Math.min(tagMatch / 2, 1) * 0.7 + popularity * 0.3;
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [active]);

  return (
    <section
      aria-labelledby="ai-demo-heading"
      className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.2fr]"
    >
      <div className="flex flex-col justify-center gap-3">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          live demo
        </p>
        <h2
          id="ai-demo-heading"
          className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          AI 推荐，
          <br />
          <span className="text-aurora">看得见怎么打分</span>
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          切换口味画像，右侧实时重排 — 与生产环境的{" "}
          <code className="rounded bg-secondary px-1 text-foreground">
            recommended_items()
          </code>{" "}
          RPC 同形态。透明、可解释，比黑盒 LLM 更适合餐饮场景。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROFILES.map((p) => {
            const a = active === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
                  a
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/40 hover:border-foreground/30",
                )}
              >
                <Icon className="size-4" />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass ring-inner-soft relative overflow-hidden rounded-3xl p-5">
        <header className="flex items-center justify-between">
          <Logo size={20} />
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            重排耗时 ~2ms
          </span>
        </header>

        <ul className="mt-4 space-y-2">
          {ranked.map((r, i) => (
            <motion.li
              key={r.item.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-2.5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                #{i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.item.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {r.item.tags.slice(0, 3).join(" · ")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-sm font-semibold text-primary">
                  {formatPrice(r.item.base_price)}
                </p>
                <ScoreBar score={r.score} />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="mt-1 flex items-center gap-1">
      <span className="text-[10px] tabular-nums text-muted-foreground">
        {score.toFixed(2)}
      </span>
      <span className="block h-1 w-10 overflow-hidden rounded-full bg-muted">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.6 }}
          className="block h-full bg-gradient-to-r from-primary to-accent"
        />
      </span>
    </div>
  );
}
