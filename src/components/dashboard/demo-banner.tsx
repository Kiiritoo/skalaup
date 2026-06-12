import { AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function DemoBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-amber-800">Mode Demo Aktif</p>
        <p className="text-xs text-amber-600 mt-1">
          Supabase belum dikonfigurasi. Data disimpan secara lokal. Tambahkan
          kredensial Supabase di <code className="bg-amber-100 px-1 rounded">.env.local</code> untuk
          production.
        </p>
      </div>
    </div>
  );
}
