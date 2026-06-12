import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename to avoid filesystem issues
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;

    // 1. Try Supabase Storage first if configured
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        // We will try uploading to 'testimonials' bucket. 
        // If they use other images, we still upload to the same bucket to simplify setup.
        const { data, error } = await supabase.storage
          .from("testimonials")
          .upload(filename, buffer, {
            contentType: file.type,
            duplex: "half",
          } as any);

        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from("testimonials")
            .getPublicUrl(filename);
          
          if (urlData?.publicUrl) {
            return NextResponse.json({ url: urlData.publicUrl, source: "supabase" });
          }
        } else {
          console.warn(
            "Supabase bucket upload unsuccessful. Falling back to local storage. Details:",
            error?.message
          );
        }
      }
    } catch (sbErr) {
      console.warn("Supabase upload exception. Falling back to local storage:", sbErr);
    }

    // 2. Local fallback
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const localPath = join(uploadDir, filename);
    await writeFile(localPath, buffer);

    const localUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: localUrl, source: "local" });
  } catch (error: any) {
    console.error("General upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
