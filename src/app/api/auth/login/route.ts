import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  DEMO_CREDENTIALS,
  createDemoSessionCookie,
  type AuthUser,
} from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase tidak tersedia" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name ?? "Admin",
      },
    });
  }

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
