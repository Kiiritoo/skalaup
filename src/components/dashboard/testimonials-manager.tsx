"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Testimonial } from "@/lib/types";

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

const emptyTestimonial: Omit<Testimonial, "id"> = {
  name: "",
  role: "",
  company: "",
  content: "",
  avatar_url: "",
  rating: 5,
  featured: false,
};

export function TestimonialsManager({
  initialTestimonials,
}: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyTestimonial);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function saveAll(updated: Testimonial[]) {
    const res = await fetch("/api/content/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      setErrorMsg("Gagal menyimpan testimoni. Silakan coba lagi.");
      return;
    }
    setTestimonials(updated);
  }

  function startEdit(index: number) {
    setEditing(index);
    setForm(testimonials[index]);
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyTestimonial);
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
  }

  async function handleSave() {
    let updated: Testimonial[];

    if (creating) {
      updated = [...testimonials, { ...form, id: `test-${Date.now()}` }];
    } else if (editing !== null) {
      updated = testimonials.map((t, i) =>
        i === editing ? { ...t, ...form } : t
      );
    } else {
      return;
    }

    await saveAll(updated);
    cancel();
  }

  async function confirmDelete() {
    if (deleteIndex === null) return;
    const updated = testimonials.filter((_, i) => i !== deleteIndex);
    await saveAll(updated);
    setDeleteIndex(null);
  }

  const showForm = creating || editing !== null;

  return (
    <div className="space-y-6">
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteIndex !== null}
        title="Hapus Testimoni?"
        description="Testimoni ini akan dihapus secara permanen dan tidak dapat dipulihkan."
        confirmLabel="Ya, Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />

      {/* Error Dialog */}
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

      <div className="flex justify-end">
        {!showForm && (
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Tambah Testimoni
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Perusahaan</Label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Posisi/Role</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Isi Testimoni</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm({ ...form, featured: v })}
              />
              <Label>Tampilkan di Homepage</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Simpan
              </Button>
              <Button variant="ghost" onClick={cancel}>
                <X className="h-4 w-4" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {testimonials.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                    <div className="flex">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {item.role}, {item.company}
                  </p>
                  <p className="text-sm text-zinc-600 mt-2 italic">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(index)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteIndex(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
