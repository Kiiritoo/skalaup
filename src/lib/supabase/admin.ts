import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client — uses SERVICE ROLE KEY.
 * Bypasses Row Level Security completely.
 * ONLY use server-side (API routes, Server Components). Never expose to client.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
