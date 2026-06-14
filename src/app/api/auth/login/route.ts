import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  DEMO_CREDENTIALS,
  createDemoSessionCookie,
  type AuthUser,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (isSupabaseConfigured()) {
    // Build a response object FIRST so we can attach cookies to it
    const response = NextResponse.json({ user: null });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          // Write session cookies directly onto the response
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Overwrite the body with real user data (cookies already attached above)
    const body = JSON.stringify({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name ?? "Admin",
      },
    });

    return new NextResponse(body, {
      status: 200,
      headers: response.headers, // carries the Set-Cookie headers from above
    });
  }

  // ── Demo mode (no Supabase configured) ──────────────────────────────────────
  if (
    email === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    const user: AuthUser = {
      id: "demo-admin",
      email: DEMO_CREDENTIALS.email,
      name: "Admin Demo",
    };

    const response = NextResponse.json({ user });
    const cookie = createDemoSessionCookie(user);
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      maxAge: cookie.maxAge,
      path: cookie.path,
    });

    return response;
  }

  return NextResponse.json(
    { error: "Email atau password salah" },
    { status: 401 }
  );
}
