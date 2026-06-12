import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

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

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;

    // 1. Try Supabase Storage via admin client (bypasses bucket RLS)
    const admin = createAdminSupabaseClient();
    if (admin) {
      // Try 'uploads' bucket first, then 'testimonials' as legacy fallback
      for (const bucket of ["uploads", "testimonials"]) {
        const { data, error } = await admin.storage
          .from(bucket)
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
          } as any);

        if (!error && data) {
          const { data: urlData } = admin.storage.from(bucket).getPublicUrl(filename);
          if (urlData?.publicUrl) {
            return NextResponse.json({ url: urlData.publicUrl, source: "supabase", bucket });
          }
        }
        console.warn(`Supabase bucket "${bucket}" upload failed:`, error?.message);
      }
    }

    // 2. Local dev fallback — only in non-Vercel environments
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

    return NextResponse.json(
      {
        error:
          "Upload failed: Please create a public Supabase Storage bucket named 'uploads' " +
          "and add SUPABASE_SERVICE_ROLE_KEY to your environment variables.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
