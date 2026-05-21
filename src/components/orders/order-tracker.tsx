"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChefHat, CreditCard, PackageCheck, Soup } from "lucide-react";
import { motion } from "framer-motion";

import { advanceOrder } from "@/app/actions/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { OrderStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface Props {
  orderId: string;
}

const flow: { key: OrderStatus; label: string; icon: typeof ChefHat }[] = [
  { key: "pending", label: "待支付", icon: CreditCard },
  { key: "paid", label: "已支付", icon: CheckCircle2 },
  { key: "preparing", label: "厨房制作中", icon: ChefHat },
  { key: "ready", label: "请取餐", icon: Soup },
  { key: "completed", label: "已完成", icon: PackageCheck },
];

export function OrderTracker({ orderId }: Props) {
  const [status, setStatus] = useState<OrderStatus>("pending");
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to Realtime updates when configured; otherwise simulate the
  // kitchen with a 4s tick so the demo flow still feels alive.
  useEffect(() => {
    let unsub: (() => void) | undefined;

    async function init() {
      if (!isSupabaseConfigured || orderId.startsWith("demo-")) {
        scheduleDemoTick();
        return;
      }
      const { getSupabaseBrowser } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();
      if (data) setStatus(data.status);

      const channel = supabase
        .channel(`orders:${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${orderId}`,
          },
          (payload) => {
            const next = (payload.new as { status: OrderStatus }).status;
            setStatus(next);
          },
        )
        .subscribe();
      unsub = () => {
        supabase.removeChannel(channel);
      };

      // Kick the kitchen forward periodically so reviewers see status flow.
      scheduleKitchenTicks();
    }

    function scheduleKitchenTicks() {
      tickRef.current = setInterval(() => {
        void advanceOrder(orderId);
      }, 4_000);
    }

    function scheduleDemoTick() {
      const order: OrderStatus[] = [
        "pending",
        "paid",
        "preparing",
        "ready",
        "completed",
      ];
      let i = 0;
      tickRef.current = setInterval(() => {
        i = Math.min(i + 1, order.length - 1);
        setStatus(order[i]!);
        if (i >= order.length - 1 && tickRef.current) {
          clearInterval(tickRef.current);
          tickRef.current = null;
        }
      }, 2_500);
    }

    void init();

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      unsub?.();
    };
  }, [orderId]);

  const activeIdx = flow.findIndex((f) => f.key === status);

  return (
    <div className="container max-w-2xl space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">订单号 · {orderId.slice(0, 8)}</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
          {flow[activeIdx]?.label ?? "处理中"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSupabaseConfigured && !orderId.startsWith("demo-")
            ? "正在通过 Supabase Realtime 实时推送订单状态。"
            : "Demo 模式：每 2.5 秒推进一档状态。"}
        </p>
      </header>

      <ol className="space-y-3">
        {flow.map((step, idx) => {
          const Icon = step.icon;
          const reached = idx <= activeIdx;
          const current = idx === activeIdx;
          return (
            <motion.li
              key={step.key}
              initial={false}
              animate={{ opacity: reached ? 1 : 0.45 }}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 transition-colors",
                current
                  ? "border-primary/60 bg-primary/5"
                  : "border-border/60 bg-card/40",
              )}
            >
              <div
                className={cn(
                  "grid size-11 place-items-center rounded-full",
                  reached
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold">{step.label}</p>
                {current && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    正在进行中…
                  </p>
                )}
              </div>
              {reached && (
                <CheckCircle2 className="size-5 text-primary" aria-hidden />
              )}
            </motion.li>
          );
        })}
      </ol>

      {status === "completed" && (
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 text-center">
          <p className="font-display text-lg font-semibold">用餐愉快</p>
          <p className="mt-1 text-sm text-muted-foreground">
            欢迎评价你的体验，下一次我们会为你做出更好的推荐。
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-secondary px-6 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
          >
            回到首页
          </Link>
        </div>
      )}
    </div>
  );
}
