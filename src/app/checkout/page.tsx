"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { placeOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { useCart, cartSelectors } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const subtotal = useCart(cartSelectors.subtotal);
  const clear = useCart((s) => s.clear);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (lines.length === 0 && !submitting) {
    return (
      <div className="container max-w-xl py-12 text-center">
        <h1 className="font-display text-2xl font-bold">购物车是空的</h1>
        <p className="mt-2 text-muted-foreground">先去挑选几道菜吧</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.55)] transition-all hover:brightness-105 active:scale-[0.98]"
        >
          返回菜单
        </Link>
      </div>
    );
  }

  async function handlePay() {
    setSubmitting(true);
    const result = await placeOrder({
      lines: lines.map((l) => ({
        itemId: l.itemId,
        name: l.name,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        optionsSummary: l.optionsSummary,
      })),
      note: note || undefined,
    });
    if (!result.ok || !result.orderId) {
      toast.error(result.error ?? "下单失败，请稍后再试");
      setSubmitting(false);
      return;
    }
    clear();
    toast.success("支付成功，正在前往订单详情");
    router.replace(`/orders/${result.orderId}`);
  }

  return (
    <div className="container max-w-xl space-y-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">结算</h1>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border/60 bg-card/60 p-5"
      >
        <h2 className="font-display font-semibold">订单明细</h2>
        <ul className="mt-3 divide-y divide-border/60">
          {lines.map((l) => (
            <li
              key={l.key}
              className="flex items-center justify-between gap-3 py-3 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{l.name}</p>
                {l.optionsSummary && (
                  <p className="truncate text-xs text-muted-foreground">
                    {l.optionsSummary}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="tabular-nums">{formatPrice(l.unitPrice)}</p>
                <p className="text-xs text-muted-foreground">× {l.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.section>

      <section className="rounded-3xl border border-border/60 bg-card/60 p-5">
        <label htmlFor="note" className="font-display font-semibold">
          备注 (可选)
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="忌口、口味偏好、配送提示 …"
          className="mt-2 w-full rounded-2xl border border-input bg-background/60 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </section>

      <footer className="glass sticky bottom-4 flex items-center justify-between gap-4 rounded-2xl p-4">
        <div>
          <p className="text-xs text-muted-foreground">合计</p>
          <p className="font-display text-2xl font-bold">{formatPrice(subtotal)}</p>
        </div>
        <Button size="lg" onClick={handlePay} disabled={submitting}>
          {submitting ? "支付中…" : "模拟支付"}
        </Button>
      </footer>
    </div>
  );
}
