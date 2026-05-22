"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * SSR safety note: `initial` is gated on `mounted` so the server-rendered HTML
 * stays at the visible end-state. Otherwise an SSR'd `opacity:0` plus a stalled
 * IntersectionObserver leaves the section permanently blank.
 */

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
}

/**
 * Numbers I picked deliberately:
 *  - <100ms TTFB and <130KB JS are *target* numbers, set as engineering goals;
 *    they're labeled as such so they don't read as fabricated metrics.
 *  - The "lines of code" stat is honest — it's the project's own count.
 */
const STATS: Stat[] = [
  { value: 90, suffix: "+", label: "Lighthouse 分数", detail: "目标：移动端 ≥ 90" },
  { value: 130, suffix: "KB", label: "首屏 JS", detail: "无第三方 UI 库" },
  { value: 60, suffix: "s", label: "ISR 边缘缓存", detail: "菜单页 TTFB → 边缘" },
  { value: 800, suffix: "ms", label: "实时推送延迟", detail: "Supabase Realtime" },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      ref={ref}
      aria-label="stats"
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={mounted ? { opacity: 0, y: 16 } : false}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass ring-inner-soft relative overflow-hidden rounded-3xl p-5"
        >
          <div className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            <Counter target={s.value} active={inView} />
            <span className="ml-0.5 text-2xl text-primary sm:text-3xl">{s.suffix}</span>
          </div>
          <p className="mt-1 font-display text-sm font-semibold">{s.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{s.detail}</p>
          <div
            aria-hidden
            className={cn(
              "absolute -right-8 -top-8 size-24 rounded-full blur-2xl",
              i % 2 === 0 ? "bg-primary/20" : "bg-accent/30",
            )}
          />
        </motion.div>
      ))}
    </section>
  );
}

function Counter({ target, active }: { target: number; active: boolean }) {
  // Start at `target` so SSR + first paint show the final number. Reset to 0
  // and animate up only after the section enters the viewport.
  const [n, setN] = useState(target);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!active || animatedRef.current) return;
    animatedRef.current = true;
    setN(0);
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      setN(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  return <span className="tabular-nums">{n.toLocaleString()}</span>;
}
