/**
 * Soft env access — never throws at import time. The API layer checks
 * `isSupabaseConfigured` and falls back to a local mock dataset when missing,
 * so a fresh clone runs `npm run dev` without any setup friction.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseEnv = { url, anonKey } as const;

export const isSupabaseConfigured =
  url.startsWith("https://") &&
  !url.includes("your-project") &&
  anonKey.length > 20;
