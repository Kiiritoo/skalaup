import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client — uses SERVICE ROLE KEY.
 * Bypasses Row Level Security completely.
 * ONLY use server-side (API routes, Server Components). Never expose to client.
 * Returns null if not configured — callers must handle the null case.
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Return null if not configured or still a placeholder
  if (
    !url ||
    !serviceRoleKey ||
    serviceRoleKey === "your_service_role_key_here" ||
    url === "your_supabase_project_url"
  ) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
