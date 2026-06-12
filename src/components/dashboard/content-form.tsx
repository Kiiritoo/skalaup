"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "url" | "email" | "image";
  placeholder?: string;
  rows?: number;
}

interface ContentFormProps {
  title: string;
  fields: FormField[];
  initialData: Record<string, string | number | string[]>;
  endpoint: string;
  arrayFields?: string[];
}

export function ContentForm({
  title,
  fields,
  initialData,
  endpoint,
  arrayFields = [],
}: ContentFormProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleChange(name: string, value: string | number) {
    setData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  async function handleImageUpload(fieldName: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Gagal mengupload gambar");
      }

      const result = await res.json();
      handleChange(fieldName, result.url);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengupload gambar. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload: Record<string, unknown> = { ...data };
    arrayFields.forEach((field) => {
      if (typeof payload[field] === "string") {
        payload[field] = (payload[field] as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    });

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setErrorMsg("Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={!!errorMsg}
        title="Terjadi Kesalahan"
        description={errorMsg ?? ""}
        confirmLabel="OK"
        cancelLabel=""
        variant="warning"
        onConfirm={() => setErrorMsg(null)}
        onCancel={() => setErrorMsg(null)}
      />
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "image" ? (
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                      {data[field.name] ? (
                        <img
                          src={String(data[field.name])}
                          alt={field.label}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-zinc-400 text-[10px] text-center px-1">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input
                        id={field.name}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(field.name, e)}
                        disabled={uploading}
                        className="max-w-xs"
                      />
                      <p className="text-xs text-zinc-400">
                        {uploading ? "Mengupload..." : "Upload logo/gambar (.png, .jpg, .svg, .webp)"}
                      </p>
                    </div>
                  </div>
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={String(data[field.name] ?? "")}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.rows ?? 4}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={String(data[field.name] ?? "")}
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                    placeholder={field.placeholder}
                  />
                )}
                {arrayFields.includes(field.name) && (
                  <p className="text-xs text-zinc-400">
                    Pisahkan dengan koma (contoh: Design, Development, SEO)
                  </p>
                )}
              </div>
            ))}

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={loading || uploading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              {saved && (
                <span className="text-sm text-emerald-600 font-medium">
                  ✓ Berhasil disimpan
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
