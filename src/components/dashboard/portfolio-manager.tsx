"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { PortfolioItem } from "@/lib/types";

interface PortfolioManagerProps {
  initialItems: PortfolioItem[];
}

const emptyItem = {
  title: "",
  description: "",
  image_url: "",
  category: "",
  tags: [] as string[],
  project_url: "",
  featured: false,
};

export function PortfolioManager({ initialItems }: PortfolioManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyItem);
  const [tagsInput, setTagsInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function startEdit(item: PortfolioItem) {
    setEditing(item.id);
    setForm({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category: item.category,
      tags: item.tags,
      project_url: item.project_url,
      featured: item.featured,
    });
    setTagsInput(item.tags.join(", "));
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyItem);
    setTagsInput("");
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
    setForm(emptyItem);
    setTagsInput("");
  }

  async function handleSave() {
    const payload = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const url = editing ? `/api/portfolio/${editing}` : "/api/portfolio";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setErrorMsg("Gagal menyimpan proyek. Silakan coba lagi.");
      return;
    }

    const saved = await res.json();

    if (editing) {
      setItems((prev) => prev.map((i) => (i.id === editing ? saved : i)));
    } else {
      setItems((prev) => [...prev, saved]);
    }

    cancel();
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/portfolio/${deleteId}`, { method: "DELETE" });
    if (!res.ok) {
      setDeleteId(null);
      setErrorMsg("Gagal menghapus proyek. Silakan coba lagi.");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  }

  const showForm = creating || editing;

  return (
    <div className="space-y-6">
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Hapus Proyek?"
        description="Proyek ini akan dihapus secara permanen dan tidak dapat dipulihkan."
        confirmLabel="Ya, Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
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
            Tambah Proyek
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>URL Proyek</Label>
                <Input
                  value={form.project_url}
                  onChange={(e) => setForm({ ...form, project_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (pisahkan koma)</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm({ ...form, featured: v })}
              />
              <Label>Featured</Label>
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
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.featured && <Badge>Featured</Badge>}
                  </div>
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
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
