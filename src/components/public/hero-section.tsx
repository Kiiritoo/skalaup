"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/lib/types";

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-400/15 to-violet-400/15 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              {content.subtitle}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              {(() => {
                const words = content.title.split(" ");
                const lastWord = words.at(-1) ?? "";
                const rest = words.length > 1 ? words.slice(0, -1).join(" ") : "";
                return (
                  <>
                    {rest && <span className="text-zinc-900">{rest} </span>}
                    <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                      {lastWord}
                    </span>
                  </>
                );
              })()}
            </h1>

            <p className="mt-6 text-lg text-zinc-500 leading-relaxed max-w-lg">
              {content.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={content.cta_link}>
                <Button size="lg" className="group">
                  {content.cta_text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Mulai Proyek
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8">
              {[
                { value: "50+", label: "Proyek Selesai" },
                { value: "30+", label: "Klien Happy" },
                { value: "5+", label: "Tahun Pengalaman" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 opacity-10 rotate-6" />
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm border border-white/50 flex items-center justify-center overflow-hidden">
                {content.image_url ? (
                  <img
                    src={content.image_url}
                    alt={content.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="text-8xl mb-4">🚀</div>
                    <p className="text-lg font-semibold text-zinc-700">
                      Your Digital Presence
                    </p>
                    <p className="text-sm text-zinc-500 mt-2">
                      Starts Here
                    </p>
                  </div>
                )}
              </div>
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl bg-white shadow-lg border border-zinc-100 text-sm font-medium text-violet-700 animate-bounce">
                ✨ Modern Design
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-2xl bg-white shadow-lg border border-zinc-100 text-sm font-medium text-fuchsia-700">
                ⚡ Fast & Responsive
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
