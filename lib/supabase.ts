import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once both env vars are present — UI uses this to show a config hint. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Singleton browser client. We pass harmless fallbacks when env is missing so
 * importing this module never throws at build time; real calls then fail at the
 * network layer and are caught by the per-page error states.
 */
// Use `||` (not `??`) so empty-string env vars also fall back — an unset var in
// .env.local arrives as "" which would otherwise crash createClient at import.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "public-anon-key-placeholder",
  {
    auth: { persistSession: false },
  }
);
