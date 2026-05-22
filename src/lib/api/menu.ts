import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Category, Item, ItemWithOptions } from "@/lib/supabase/types";

import { mockCategories, mockItemWithOptions, mockItems } from "./mock-data";

/**
 * Menu API — runs on the server. Falls back to local mock data when env
 * isn't configured so the project boots end-to-end on a fresh clone.
 *
 * The fallback is a *deliberate* design choice, not a workaround: it lets
 * reviewers (and future you) browse the UI without standing up Supabase.
 */

async function getServer() {
  // Lazy import — Server Component module graph only.
  const { getSupabaseServer } = await import("@/lib/supabase/server");
  return getSupabaseServer();
}

export async function listCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return mockCategories;
  const supabase = await getServer();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function listItems(params?: {
  categoryId?: string;
  search?: string;
}): Promise<Item[]> {
  if (!isSupabaseConfigured) {
    let rows = mockItems;
    if (params?.categoryId) {
      rows = rows.filter((i) => i.category_id === params.categoryId);
    }
    if (params?.search) {
      const q = params.search.trim().toLowerCase();
      rows = rows.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description ?? "").toLowerCase().includes(q) ||
          (i.tags ?? []).some((t) => t.toLowerCase().includes(q)),
      );
    }
    return rows;
  }

  const supabase = await getServer();
  let q = supabase.from("dishes").select("*").eq("is_available", true);
  if (params?.categoryId) q = q.eq("category_id", params.categoryId);
  if (params?.search) {
    // Postgres full-text — uses the `search_vec` GIN index from schema.sql
    q = q.textSearch("search_vec", params.search, { type: "websearch" });
  }
  const { data, error } = await q.order("sold_count", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getItem(id: string): Promise<ItemWithOptions | null> {
  if (!isSupabaseConfigured) return mockItemWithOptions(id);

  const supabase = await getServer();

  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...data,
    option_groups: [],
  } as ItemWithOptions;
}

export async function bestSellers(limit = 6): Promise<Item[]> {
  const items = await listItems();
  return [...items].sort((a, b) => b.sold_count - a.sold_count).slice(0, limit);
}

export async function recommendedItems(limit = 6): Promise<Item[]> {
  if (!isSupabaseConfigured) {
    // Cold-start strategy: featured first, then top sellers.
    const featured = mockItems.filter((i) => i.is_featured);
    const rest = mockItems
      .filter((i) => !i.is_featured)
      .sort((a, b) => b.sold_count - a.sold_count);
    return [...featured, ...rest].slice(0, limit);
  }
  const supabase = await getServer();
  const { data, error } = await supabase.rpc("recommended_items", {
    p_limit: limit,
  });
  if (error) throw error;
  return data ?? [];
}
