import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const DEMO_CREDENTIALS = {
  email: "admin@demo.com",
  password: "demo123",
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

const DEMO_SESSION_COOKIE = "demo_session";

export async function getUser(): Promise<AuthUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Admin",
    };
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(DEMO_SESSION_COOKIE);
  if (!session?.value) return null;

  try {
    return JSON.parse(session.value) as AuthUser;
  } catch {
    return null;
  }
}

export function createDemoSessionCookie(user: AuthUser) {
  return {
    name: DEMO_SESSION_COOKIE,
    value: JSON.stringify(user),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}

export function clearDemoSessionCookie() {
  return {
    name: DEMO_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}
