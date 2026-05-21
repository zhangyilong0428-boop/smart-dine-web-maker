"use client";

import { createBrowserClient } from "@supabase/ssr";

import { supabaseEnv } from "./env";
import type { Database } from "./types";

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Browser Supabase client — singleton, reused across the SPA shell.
 * Keep auth state in cookies (via @supabase/ssr) so server components see it too.
 */
export function getSupabaseBrowser() {
  if (cached) return cached;
  cached = createBrowserClient<Database>(supabaseEnv.url, supabaseEnv.anonKey);
  return cached;
}
