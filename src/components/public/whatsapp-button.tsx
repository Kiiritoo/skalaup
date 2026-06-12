"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
}

export function WhatsAppButton({
  phone,
  message = "Halo! Saya tertarik dengan layanan StudioWave. Boleh saya tanya-tanya?",
}: WhatsAppButtonProps) {
  // Strip non-digit chars and normalize the number
  const normalized = phone.replace(/\D/g, "").replace(/^0/, "62");
  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/${normalized}?text=${encodedMsg}`;

  if (!normalized) return null;

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BB5A] text-white rounded-full shadow-xl shadow-green-500/30 transition-colors group"
      aria-label="Chat via WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:opacity-0" />

      {/* Icon only pill */}
      <span className="relative flex items-center gap-2.5 px-4 py-3.5">
        <MessageCircle className="h-6 w-6 fill-white stroke-none" />
        <span className="text-sm font-semibold pr-1 hidden sm:block">
          Hubungi Kami
        </span>
      </span>
    </motion.a>
  );
}
