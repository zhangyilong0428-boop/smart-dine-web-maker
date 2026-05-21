import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { supabaseEnv } from "./env";
import type { Database } from "./types";

/**
 * Server Supabase client — re-created per request so it binds to that
 * request's cookie jar. Do not memoize.
 */
export function getSupabaseServer() {
  const store = cookies();
  return createServerClient<Database>(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          store.set({ name, value, ...options });
        } catch {
          // `cookies()` is read-only inside Server Components.
          // Server Actions / Route Handlers can write — swallowing here keeps
          // the helper safe to use in both contexts.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          store.set({ name, value: "", ...options });
        } catch {
          // see above
        }
      },
    },
  });
}
