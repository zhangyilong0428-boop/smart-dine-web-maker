"use client";

import { createBrowserClient } from "@supabase/ssr";

import { supabaseEnv } from "./env";

let cached: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser Supabase client — singleton, reused across the SPA shell.
 * We deliberately skip the `<Database>` generic: hand-written row types live
 * in `./types.ts` and are applied at the call site, which keeps the inference
 * surface predictable without committing to `supabase gen types` in CI.
 */
export function getSupabaseBrowser() {
  if (cached) return cached;
  cached = createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
  return cached;
}
