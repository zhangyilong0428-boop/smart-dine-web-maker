"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  initial: string;
}

/**
 * NOTE: These are written as plausible *fictional* product quotes for the
 * demo site. The /about page makes that explicit so the project doesn't
 * misrepresent itself as having real customers. They exist to set tone.
 */
const ROWS: Testimonial[] = [
  {
    quote:
      "从设计 token 到 RLS 策略全部一手搭建，这种端到端把控在校招项目里我没怎么见过。",
    author: "K. Wei",
    role: "前端 Tech Lead · Demo 留言",
    initial: "K",
  },
  {
    quote:
      "Aurora 的色彩节奏让我想到 Linear，但是用得克制 — 主色只在 CTA 出现，是高级的克制。",
    author: "Mira",
    role: "产品设计师 · Demo 留言",
    initial: "M",
  },
  {
    quote:
      "把推荐打分逻辑做成可视化交互，比把 LLM 包一层 API 然后写 'AI 加持' 真诚多了。",
    author: "Tan",
    role: "全栈工程师 · Demo 留言",
    initial: "T",
  },
];

export function Testimonials() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section aria-labelledby="testi-heading" className="space-y-6">
      <header className="space-y-2 sm:text-center">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          field notes
        </p>
        <h2
          id="testi-heading"
          className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          有人这样评价
        </h2>
        <p className="mx-auto max-w-xl text-balance text-xs text-muted-foreground sm:text-sm">
          以下评价为示例素材，用于呈现产品调性。真实部署后将替换为真实留言。
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {ROWS.map((t, i) => (
          <motion.figure
            key={t.author}
            initial={mounted ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass ring-inner-soft relative flex flex-col gap-4 rounded-3xl p-5"
          >
            <Quote className="size-5 text-primary/60" />
            <blockquote className="text-sm leading-relaxed">{t.quote}</blockquote>
            <figcaption className="mt-auto flex items-center gap-3 border-t border-border/60 pt-3">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full font-display text-sm font-bold",
                  i === 0 && "bg-primary/10 text-primary",
                  i === 1 && "bg-accent/30 text-accent-foreground",
                  i === 2 && "bg-secondary text-foreground",
                )}
              >
                {t.initial}
              </span>
              <div>
                <p className="text-sm font-medium">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
