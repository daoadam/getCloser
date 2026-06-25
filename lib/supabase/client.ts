import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

// Returns a browser Supabase client, or null when env vars aren't set yet,
// so the app runs fully without a configured backend.
export function getSupabaseClient() {
  if (!supabaseConfigured) return null;
  return createBrowserClient(url!, anonKey!);
}
