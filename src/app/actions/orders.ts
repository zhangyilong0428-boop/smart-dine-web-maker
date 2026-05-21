"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { OrderStatus } from "@/lib/supabase/types";

const LineSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  optionsSummary: z.string().optional(),
});

const PlaceOrderSchema = z.object({
  lines: z.array(LineSchema).min(1),
  note: z.string().max(280).optional(),
});

export interface PlaceOrderResult {
  ok: boolean;
  orderId?: string;
  error?: string;
}

/**
 * Place order — Server Action.
 * Falls back to a synthetic in-memory id when Supabase isn't configured,
 * so the demo flow still completes for reviewers without env setup.
 */
export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const parsed = PlaceOrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "订单数据无效" };
  const { lines, note } = parsed.data;
  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);

  if (!isSupabaseConfigured) {
    // Demo mode — pretend it worked.
    const id = `demo-${Date.now().toString(36)}`;
    return { ok: true, orderId: id };
  }

  const { getSupabaseServer } = await import("@/lib/supabase/server");
  const supabase = getSupabaseServer();

  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      subtotal,
      discount: 0,
      total: subtotal,
      status: "pending" as OrderStatus,
      note: note ?? null,
    })
    .select()
    .single();
  if (error || !order) return { ok: false, error: error?.message ?? "下单失败" };

  const { error: e2 } = await supabase.from("order_items").insert(
    lines.map((l) => ({
      order_id: order.id,
      item_id: l.itemId,
      item_name: l.name,
      unit_price: l.unitPrice,
      quantity: l.quantity,
      options_summary: l.optionsSummary ?? null,
    })),
  );
  if (e2) return { ok: false, error: e2.message };

  revalidatePath("/orders");
  return { ok: true, orderId: order.id };
}

/**
 * Demo helper — drives the status machine forward by one step.
 * Wired to the "模拟支付" + a periodic kitchen tick on the order page.
 */
export async function advanceOrder(orderId: string): Promise<PlaceOrderResult> {
  if (!isSupabaseConfigured || orderId.startsWith("demo-")) {
    return { ok: true, orderId };
  }
  const { getSupabaseServer } = await import("@/lib/supabase/server");
  const supabase = getSupabaseServer();
  const { data: cur } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();
  if (!cur) return { ok: false, error: "订单不存在" };

  const transitions: Record<OrderStatus, OrderStatus | null> = {
    pending: "paid",
    paid: "preparing",
    preparing: "ready",
    ready: "completed",
    completed: null,
    cancelled: null,
  };
  const next = transitions[cur.status];
  if (!next) return { ok: true, orderId };

  const { error } = await supabase
    .from("orders")
    .update({ status: next })
    .eq("id", orderId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, orderId };
}
