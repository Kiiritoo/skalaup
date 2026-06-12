"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { ServiceItem } from "@/lib/types";

interface ServicesManagerProps {
  initialServices: ServiceItem[];
}

const emptyService: Omit<ServiceItem, "id"> = {
  title: "",
  description: "",
  icon: "sparkles",
  price_starting: "",
  price_original: "",
  discount_label: "",
  discount_expires: "",
  featured: false,
  order: 0,
};

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState(initialServices);
  const [editing, setEditing] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyService);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function saveAll(updated: ServiceItem[]) {
    setSaving(true);
    const res = await fetch("/api/content/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    if (!res.ok) {
      setErrorMsg("Gagal menyimpan layanan. Silakan coba lagi.");
      return false;
    }
    setServices(updated);
    return true;
  }

  function startEdit(index: number) {
    setEditing(index);
    setForm(services[index]);
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ ...emptyService, order: services.length + 1 });
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
  }

  async function handleSave() {
    let updated: ServiceItem[];

    if (creating) {
      updated = [...services, { ...form, id: `svc-${Date.now()}` }];
    } else if (editing !== null) {
      updated = services.map((s, i) => (i === editing ? { ...s, ...form } : s));
    } else {
      return;
    }

    const ok = await saveAll(updated);
    if (ok) cancel();
  }

  async function confirmDelete() {
    if (deleteIndex === null) return;
    const updated = services.filter((_, i) => i !== deleteIndex);
    const ok = await saveAll(updated);
    if (ok) setDeleteIndex(null);
  }

  const showForm = creating || editing !== null;
  const hasDiscount = !!form.discount_label || !!form.price_original;

  return (
    <div className="space-y-6">
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteIndex !== null}
        title="Hapus Layanan?"
        description="Layanan ini akan dihapus secara permanen dan tidak dapat dipulihkan."
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
            Tambah Layanan
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            {/* Title & Icon */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="sparkles, code, palette, trending-up, globe..."
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Deskripsi & Benefit</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
                placeholder={"Deskripsi singkat layanan.\n- Benefit 1\n- Benefit 2\n- Benefit 3"}
              />
              <p className="text-xs text-zinc-400">
                Baris pertama = deskripsi. Baris berikutnya (dengan tanda -) = list benefit.
              </p>
            </div>

            {/* Pricing Section */}
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                <Tag className="h-4 w-4" />
                Pengaturan Harga
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harga Mulai (Harga Final)</Label>
                  <Input
                    value={form.price_starting}
                    onChange={(e) => setForm({ ...form, price_starting: e.target.value })}
                    placeholder="Rp 5jt"
                  />
                  <p className="text-xs text-zinc-400">Harga yang ditampilkan besar.</p>
                </div>
                <div className="space-y-2">
                  <Label>Harga Asli (Sebelum Diskon)</Label>
                  <Input
                    value={form.price_original}
                    onChange={(e) => setForm({ ...form, price_original: e.target.value })}
                    placeholder="Rp 8jt — kosongkan jika tidak ada diskon"
                  />
                  <p className="text-xs text-zinc-400">Akan tampil sebagai harga coret.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Label Diskon (Badge)</Label>
                  <Input
                    value={form.discount_label}
                    onChange={(e) => setForm({ ...form, discount_label: e.target.value })}
                    placeholder="20% OFF, PROMO, HEMAT 50%, BEST DEAL..."
                  />
                  <p className="text-xs text-zinc-400">Kosongkan untuk menyembunyikan badge.</p>
                </div>
                <div className="space-y-2">
                  <Label>Berlaku Sampai</Label>
                  <Input
                    value={form.discount_expires}
                    onChange={(e) => setForm({ ...form, discount_expires: e.target.value })}
                    placeholder="31 Des 2026 — kosongkan jika tidak ada batas"
                  />
                  <p className="text-xs text-zinc-400">Tampil sebagai keterangan batas waktu promo.</p>
                </div>
              </div>

              {/* Live preview */}
              {hasDiscount && (
                <div className="rounded-lg bg-white border border-violet-200 p-3">
                  <p className="text-xs font-medium text-zinc-500 mb-2">Preview Harga:</p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {form.discount_label && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                        🔥 {form.discount_label}
                      </span>
                    )}
                    {form.price_original && (
                      <span className="text-sm text-zinc-400 line-through">{form.price_original}</span>
                    )}
                    <span className="text-lg font-bold text-violet-700">
                      {form.price_starting || "Rp ???"}
                    </span>
                  </div>
                  {form.discount_expires && (
                    <p className="text-xs text-amber-600 mt-1">⏰ Berlaku s/d {form.discount_expires}</p>
                  )}
                </div>
              )}
            </div>

            {/* Order & Featured */}
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label>Urutan Tampil</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
                <Label>Featured (tampil highlight)</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="ghost" onClick={cancel} disabled={saving}>
                <X className="h-4 w-4" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {services.map((service, index) => {
          const hasServiceDiscount = !!service.discount_label || !!service.price_original;
          return (
            <Card key={service.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-zinc-900">{service.title}</h3>
                      {service.featured && <Badge>Featured</Badge>}
                      {service.discount_label && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                          🔥 {service.discount_label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      {service.price_original && (
                        <span className="text-sm text-zinc-400 line-through">{service.price_original}</span>
                      )}
                      <span className={`text-sm font-semibold ${hasServiceDiscount ? "text-red-600" : "text-violet-600"}`}>
                        {service.price_starting}
                      </span>
                      {service.discount_expires && (
                        <span className="text-xs text-amber-600">s/d {service.discount_expires}</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{service.description}</p>
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
          );
        })}
      </div>
    </div>
  );
}
