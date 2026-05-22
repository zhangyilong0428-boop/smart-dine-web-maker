"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ClosingCta() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.section
      initial={mounted ? { opacity: 0, y: 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate overflow-hidden rounded-[2rem] border border-border/60 px-6 py-14 text-center sm:px-12 sm:py-20"
    >
      <div aria-hidden className="aurora opacity-60" />
      <div aria-hidden className="noise absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-xl space-y-4">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          准备好<span className="text-aurora">下单</span>了吗？
        </h2>
        <p className="text-balance text-sm text-muted-foreground sm:text-base">
          所有功能可即时体验 — 无需注册、无需配置数据库。
        </p>
        <Link
          href="/menu"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_hsl(var(--primary)/0.6)] transition-all hover:shadow-[0_14px_36px_-8px_hsl(var(--primary)/0.7)] hover:brightness-105 active:scale-[0.98]"
        >
          浏览菜单
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.section>
  );
}
