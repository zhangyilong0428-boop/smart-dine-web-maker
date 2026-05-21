"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { cn, formatPrice } from "@/lib/utils";
import type { ItemWithOptions } from "@/lib/supabase/types";

interface ItemDetailProps {
  item: ItemWithOptions;
}

/** Selected option ids keyed by group id. */
type Selection = Record<string, string[]>;

export function ItemDetail({ item }: ItemDetailProps) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.setCartOpen);
  const [qty, setQty] = useState(1);

  const initial = useMemo<Selection>(() => {
    const out: Selection = {};
    for (const g of item.option_groups) {
      const def = g.options.find((o) => o.is_default);
      if (def) out[g.id] = [def.id];
      else if (g.is_required && g.options.length) out[g.id] = [g.options[0]!.id];
      else out[g.id] = [];
    }
    return out;
  }, [item]);

  const [selection, setSelection] = useState<Selection>(initial);

  // Live SKU price calculation
  const { unitPrice, summary } = useMemo(() => {
    let delta = 0;
    const parts: string[] = [];
    for (const g of item.option_groups) {
      const ids = selection[g.id] ?? [];
      for (const id of ids) {
        const opt = g.options.find((o) => o.id === id);
        if (!opt) continue;
        delta += opt.price_delta;
        parts.push(opt.label);
      }
    }
    return {
      unitPrice: item.base_price + delta,
      summary: parts.join(" / "),
    };
  }, [item, selection]);

  function toggleOption(groupId: string, optionId: string, multi: boolean) {
    setSelection((prev) => {
      const cur = prev[groupId] ?? [];
      if (multi) {
        return cur.includes(optionId)
          ? { ...prev, [groupId]: cur.filter((x) => x !== optionId) }
          : { ...prev, [groupId]: [...cur, optionId] };
      }
      return { ...prev, [groupId]: [optionId] };
    });
  }

  const missingRequired = item.option_groups.some(
    (g) => g.is_required && (selection[g.id]?.length ?? 0) === 0,
  );

  function addToCart() {
    if (missingRequired) {
      toast.error("请先选择必填规格");
      return;
    }
    const optionPart = Object.values(selection).flat().sort().join("|");
    add(
      {
        key: `${item.id}::${optionPart}`,
        itemId: item.id,
        name: item.name,
        imageUrl: item.image_url,
        unitPrice,
        optionsSummary: summary || undefined,
      },
      qty,
    );
    toast.success(`已加入购物车 · ${formatPrice(unitPrice * qty)}`);
    openCart(true);
  }

  return (
    <div className="container">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-1 rounded-full bg-card/60 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> 返回
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          layoutId={`hero-${item.id}`}
          className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60"
        >
          {item.image_url && (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {item.name}
            </h1>
            {item.description && (
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            )}
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {item.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>已售 {item.sold_count.toLocaleString()} 份</span>
            </div>
          </header>

          {item.option_groups.length > 0 && (
            <section className="space-y-4">
              {item.option_groups.map((g) => {
                const multi = !g.is_required;
                return (
                  <div key={g.id}>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-display text-sm font-semibold">
                        {g.name}
                      </h3>
                      {g.is_required ? (
                        <Badge variant="secondary">必选</Badge>
                      ) : (
                        <Badge variant="outline">可多选</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {g.options.map((o) => {
                        const active = (selection[g.id] ?? []).includes(o.id);
                        return (
                          <button
                            key={o.id}
                            onClick={() => toggleOption(g.id, o.id, multi)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all",
                              active
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card/60 text-foreground hover:border-foreground/30",
                            )}
                          >
                            <span>{o.label}</span>
                            {o.price_delta !== 0 && (
                              <span className="text-xs text-muted-foreground">
                                {o.price_delta > 0 ? "+" : ""}
                                {formatPrice(o.price_delta)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          <section className="flex items-center gap-4">
            <h3 className="font-display text-sm font-semibold">数量</h3>
            <div className="inline-flex items-center rounded-full border border-border bg-card">
              <button
                aria-label="减少"
                className="grid size-9 place-items-center rounded-full transition-colors hover:bg-secondary"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-medium tabular-nums">
                {qty}
              </span>
              <button
                aria-label="增加"
                className="grid size-9 place-items-center rounded-full transition-colors hover:bg-secondary"
                onClick={() => setQty(qty + 1)}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </section>

          <footer className="glass sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl p-4 lg:static">
            <div>
              <p className="text-xs text-muted-foreground">合计</p>
              <p className="font-display text-2xl font-bold">
                {formatPrice(unitPrice * qty)}
              </p>
              {summary && (
                <p className="mt-0.5 text-xs text-muted-foreground">{summary}</p>
              )}
            </div>
            <Button size="lg" onClick={addToCart} disabled={missingRequired}>
              加入购物车
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
}
