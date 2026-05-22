import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Category, Item, ItemWithOptions } from "@/lib/supabase/types";

import { mockCategories, mockItemWithOptions, mockItems } from "./mock-data";

async function getServer() {
  const { getSupabaseServer } = await import("@/lib/supabase/server");
  return getSupabaseServer();
}

export async function listCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return mockCategories;

  const supabase = await getServer();

  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function listItems(params?: {
  categoryId?: string;
  search?: string;
}): Promise<Item[]> {
  if (!isSupabaseConfigured) {
    return mockItems;
  }

  const supabase = await getServer();

  let q = supabase.from("dishes").select("*");

  if (params?.categoryId) {
    q = q.eq("category_id", params.categoryId);
  }

  const { data, error } = await q;

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getItem(id: string): Promise<ItemWithOptions | null> {
  if (!isSupabaseConfigured) {
    return mockItemWithOptions(id);
  }

  const supabase = await getServer();

  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

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
  const items = await listItems();

  return items.slice(0, limit);
}
