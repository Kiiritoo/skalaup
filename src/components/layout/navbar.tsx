"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/#about", label: "Tentang" },
  { href: "/portfolio", label: "Portofolio" },
  { href: "/#services", label: "Layanan" },
  { href: "/contact", label: "Kontak" },
];

interface NavbarProps {
  siteName?: string;
  logoUrl?: string;
}

export function Navbar({ siteName = "StudioWave", logoUrl }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mt-4 flex items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-6 py-3 shadow-lg shadow-violet-500/5 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-9 w-auto object-contain max-h-9 rounded-lg"
              />
            ) : (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-md shadow-violet-500/30">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
                  {siteName}
                </span>
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact">
              <Button size="sm">Hubungi Kami</Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-violet-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          )}
        >
          <div className="rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl p-4 shadow-lg space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-zinc-600 rounded-lg hover:text-violet-700 hover:bg-violet-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="secondary" className="w-full" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)}>
                <Button className="w-full" size="sm">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
