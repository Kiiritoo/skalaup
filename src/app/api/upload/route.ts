import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;

    // 1. Try Supabase Storage
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
          } as any);

        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from("uploads")
            .getPublicUrl(filename);

          if (urlData?.publicUrl) {
            return NextResponse.json({ url: urlData.publicUrl, source: "supabase" });
          }
        }

        // Try the 'testimonials' bucket as fallback bucket name
        const { data: data2, error: error2 } = await supabase.storage
          .from("testimonials")
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
          } as any);

        if (!error2 && data2) {
          const { data: urlData2 } = supabase.storage
            .from("testimonials")
            .getPublicUrl(filename);

          if (urlData2?.publicUrl) {
            return NextResponse.json({ url: urlData2.publicUrl, source: "supabase" });
          }
        }

        console.warn("Supabase upload failed:", error?.message || error2?.message);
      }
    } catch (sbErr) {
      console.warn("Supabase upload exception:", sbErr);
    }

    // 2. Local dev fallback — only works outside Vercel
    if (process.env.VERCEL !== "1") {
      try {
        const { writeFile, mkdir } = await import("fs/promises");
        const { join } = await import("path");
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);
        return NextResponse.json({ url: `/uploads/${filename}`, source: "local" });
      } catch (fsErr) {
        console.error("Local filesystem write failed:", fsErr);
      }
    }

    // 3. On Vercel with no Supabase bucket configured — return clear error
    return NextResponse.json(
      {
        error:
          "Upload failed: Supabase Storage is not configured or the bucket does not exist. " +
          "Please create a public bucket named 'uploads' in your Supabase project.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
