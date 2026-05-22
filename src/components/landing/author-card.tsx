"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "@/components/brand/logo";

const STACK = [
  "Next.js 14",
  "TypeScript strict",
  "Supabase",
  "Tailwind",
  "Framer Motion",
  "Zustand",
  "TanStack Query",
  "Postgres RLS",
];

export function AuthorCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.section
      initial={mounted ? { opacity: 0, y: 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="author-heading"
      className="glass ring-inner-soft relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="grid gap-6 md:grid-cols-[auto_1fr_auto]">
        <div className="flex flex-row items-center gap-4 md:flex-col md:items-start">
          {/* Monogram avatar — Aurora-gradient ring, ZYL = 张艺泷 */}
          <div className="relative size-16 shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-[hsl(var(--brand-fire-to))] to-accent" />
            <div className="absolute inset-[2px] grid place-items-center rounded-[calc(theme(borderRadius.2xl)-2px)] bg-card">
              <span className="text-aurora font-display text-xl font-extrabold tracking-tight">
                ZYL
              </span>
            </div>
          </div>
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-primary">
              built by
            </p>
            <p
              id="author-heading"
              className="font-display text-2xl font-extrabold tracking-tight"
            >
              张艺泷
            </p>
            <p className="text-xs text-muted-foreground">独立开发者 · 全栈方向</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm leading-relaxed">
            这是我设计、实现并独立维护的产品。从{" "}
            <span className="font-semibold text-foreground">设计 token</span> 到{" "}
            <span className="font-semibold text-foreground">数据库 RLS 策略</span>
            ，所有决策都是我自己做的。Yilong
            不是模板项目，它的每一个细节我都能解释为什么这样做。
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {STACK.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <ul className="flex flex-row gap-2 md:flex-col">
          <li>
            <Link
              href="https://github.com/zhangyilong5"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/30"
            >
              <Github className="size-4 transition-transform group-hover:rotate-12" />
              GitHub
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/30"
            >
              <Mail className="size-4" />
              联系作者
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          中国
        </span>
        <span className="flex items-center gap-1.5">
          <Logo size={12} withWordmark={false} mono />
          Yilong v0.1 — last shipped 2026·05
        </span>
      </div>
    </motion.section>
  );
}
