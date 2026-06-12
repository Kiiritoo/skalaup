"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/lib/types";

interface MessagesManagerProps {
  initialMessages: ContactMessage[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function markRead(id: string) {
    const res = await fetch(`/api/messages/${id}`, { method: "PATCH" });
    if (!res.ok) return;
    const updated = await res.json();
    setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    if (selected?.id === id) setSelected(updated);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/messages/${deleteId}`, { method: "DELETE" });
    if (!res.ok) {
      setDeleteId(null);
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== deleteId));
    if (selected?.id === deleteId) setSelected(null);
    setDeleteId(null);
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Mail className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">Belum ada pesan masuk</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Hapus Pesan?"
        description="Pesan ini akan dihapus secara permanen dan tidak dapat dipulihkan."
        confirmLabel="Ya, Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => {
                setSelected(msg);
                if (!msg.read) markRead(msg.id);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selected?.id === msg.id
                  ? "border-violet-300 bg-violet-50"
                  : "border-zinc-100 bg-white hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {!msg.read ? (
                  <Mail className="h-3 w-3 text-violet-500" />
                ) : (
                  <MailOpen className="h-3 w-3 text-zinc-400" />
                )}
                <span className="text-sm font-medium text-zinc-900 truncate">
                  {msg.subject}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{msg.name}</p>
              <p className="text-xs text-zinc-400 mt-1">
                {formatDate(msg.created_at)}
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900">
                      {selected.subject}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      Dari: {selected.name} ({selected.email})
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {formatDate(selected.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selected.read ? "secondary" : "default"}>
                      {selected.read ? "Dibaca" : "Baru"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(selected.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 text-zinc-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-zinc-400">Pilih pesan untuk melihat detail</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
