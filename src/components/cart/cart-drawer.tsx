"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useCart, cartSelectors } from "@/store/cart";
import { useUi } from "@/store/ui";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart(cartSelectors.subtotal);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      title="购物车"
      description={lines.length === 0 ? "还没有添加任何菜品" : `共 ${lines.length} 项`}
    >
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <EmptyCart onClose={() => setOpen(false)} />
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <motion.li
                    key={line.key}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        {line.imageUrl && (
                          <Image
                            src={line.imageUrl}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <p className="truncate font-medium">{line.name}</p>
                          {line.optionsSummary && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {line.optionsSummary}
                            </p>
                          )}
                          <p className="mt-1 font-display text-sm font-semibold text-primary">
                            {formatPrice(line.unitPrice)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Stepper
                            qty={line.quantity}
                            onChange={(q) => setQty(line.key, q)}
                          />
                          <button
                            aria-label="移除"
                            onClick={() => remove(line.key)}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-border/60 bg-card/40 p-6 backdrop-blur">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>小计</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>配送 / 服务费</dt>
                <dd>免费</dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <dt className="font-display font-semibold">合计</dt>
                <dd className="font-display text-2xl font-bold">
                  {formatPrice(subtotal)}
                </dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-base font-medium text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.55)] transition-all hover:shadow-[0_12px_32px_-8px_hsl(var(--primary)/0.65)] hover:brightness-105 active:scale-[0.98]"
            >
              去结算
            </Link>
          </footer>
        )}
      </div>
    </Sheet>
  );
}

function Stepper({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card">
      <button
        aria-label="减少数量"
        className="grid size-8 place-items-center rounded-full transition-colors hover:bg-secondary"
        onClick={() => onChange(qty - 1)}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-7 text-center text-sm font-medium tabular-nums">
        {qty}
      </span>
      <button
        aria-label="增加数量"
        className="grid size-8 place-items-center rounded-full transition-colors hover:bg-secondary"
        onClick={() => onChange(qty + 1)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="grid size-20 place-items-center rounded-full bg-secondary">
        <ShoppingBag className="size-8 text-muted-foreground" />
      </div>
      <p className="mt-4 font-display font-semibold">购物车是空的</p>
      <p className="mt-1 text-sm text-muted-foreground">挑选你喜欢的菜品开始体验</p>
      <Button variant="secondary" className="mt-4" onClick={onClose}>
        浏览菜单
      </Button>
    </div>
  );
}
