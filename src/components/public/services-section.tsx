"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Code,
  Sparkles,
  TrendingUp,
  Check,
  Zap,
  Globe,
  Smartphone,
  ShoppingCart,
  Camera,
  PenTool,
  BarChart2,
  Mail,
  Search,
  Shield,
  Settings,
  Layers,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { ServiceItem } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  palette: Palette,
  code: Code,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  globe: Globe,
  smartphone: Smartphone,
  "shopping-cart": ShoppingCart,
  camera: Camera,
  "pen-tool": PenTool,
  "bar-chart-2": BarChart2,
  mail: Mail,
  search: Search,
  shield: Shield,
  settings: Settings,
  layers: Layers,
  star: Star,
  zap: Zap,
};

interface ServicesSectionProps {
  services: ServiceItem[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const sorted = [...services].sort((a, b) => a.order - b.order);

  // Show only first 3 for the 3-column grid; extras fall to bottom
  const featured = sorted.slice(0, 3);

  return (
    <section id="services" className="py-20 md:py-28 bg-zinc-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-3">
            Layanan
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Apa yang Kami Tawarkan
          </h2>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
            Solusi lengkap untuk kebutuhan digital kamu — pilih paket yang
            sesuai
          </p>
        </div>

        {/* 3-column grid — middle card is highlighted */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {featured.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            const isMiddle = index === 1; // second card = highlighted

            // Parse description and benefits
            const lines = service.description
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            const mainDesc = lines[0] || "";
            const benefits = lines
              .slice(1)
              .map((l) => l.replace(/^[-*•]\s*/, ""));

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden
                  ${
                    isMiddle
                      ? "bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-700 border-transparent shadow-2xl shadow-violet-500/30 scale-[1.03] md:-mt-3 md:-mb-3 z-10"
                      : "bg-white border-zinc-200/70 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 shadow-sm"
                  }`}
              >
                {/* Floating Discount Badge */}
                {service.discount_label && (
                  <div className="absolute top-0 right-0 z-20">
                    <div
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl shadow-md border-b border-l animate-pulse flex items-center gap-1.5
                        ${
                          isMiddle
                            ? "bg-white text-rose-600 border-violet-200"
                            : "bg-gradient-to-r from-rose-500 to-amber-500 text-white border-white/20"
                        }`}
                    >
                      <span>🔥</span>
                      {service.discount_label}
                    </div>
                  </div>
                )}

                {/* Best Seller badge */}
                {isMiddle && (
                  <div className="flex justify-center pt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/30">
                      <Zap className="h-3 w-3 fill-white stroke-none" />
                      Best Seller
                    </span>
                  </div>
                )}

                <div className="flex flex-col flex-1 p-8">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors
                        ${
                          isMiddle
                            ? "bg-white/20 text-white"
                            : "bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          isMiddle ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed mb-5 ${
                      isMiddle ? "text-violet-100" : "text-zinc-500"
                    }`}
                  >
                    {mainDesc}
                  </p>

                  {/* Pricing Block */}
                  <div
                    className={`mb-6 p-4 rounded-xl border transition-all duration-300
                      ${
                        isMiddle
                          ? "bg-white/10 border-white/10 backdrop-blur-md text-white shadow-inner"
                          : "bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 border-violet-100/40 text-zinc-900"
                      }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider
                          ${isMiddle ? "text-violet-200/90" : "text-zinc-400"}`}
                      >
                        Mulai Dari
                      </span>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {service.price_original && (
                          <span
                            className={`text-sm line-through decoration-rose-500/80 decoration-2
                              ${isMiddle ? "text-violet-300/80" : "text-zinc-400 font-medium"}`}
                          >
                            {service.price_original}
                          </span>
                        )}
                        <span
                          className={`text-3xl font-extrabold tracking-tight
                            ${
                              isMiddle
                                ? "text-white drop-shadow-sm"
                                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
                            }`}
                        >
                          {service.price_starting}
                        </span>
                      </div>
                      
                      {service.discount_expires && (
                        <div
                          className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[10px] font-semibold w-fit border animate-pulse
                            ${
                              isMiddle
                                ? "bg-white/15 text-amber-200 border-white/10"
                                : "bg-amber-50/80 text-amber-700 border-amber-200/40"
                            }`}
                        >
                          <span className="text-xs">⏰</span>
                          <span>Promo s/d {service.discount_expires}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits list */}
                  {benefits.length > 0 && (
                    <ul
                      className={`space-y-3 border-t pt-6 mb-8 flex-1 ${
                        isMiddle ? "border-white/20" : "border-zinc-100"
                      }`}
                    >
                      {benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className={`flex items-start gap-2.5 text-sm ${
                            isMiddle ? "text-violet-100" : "text-zinc-600"
                          }`}
                        >
                          <div
                            className={`flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded-full ${
                              isMiddle ? "bg-white/20" : "bg-emerald-50"
                            }`}
                          >
                            <Check
                              className={`h-2.5 w-2.5 ${
                                isMiddle ? "text-white" : "text-emerald-600"
                              }`}
                            />
                          </div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  <a
                    href="#contact"
                    className={`mt-auto flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-all duration-300 border
                      ${
                        isMiddle
                          ? "bg-white text-violet-700 hover:bg-violet-50 border-transparent shadow-lg"
                          : "bg-zinc-50 text-zinc-700 hover:bg-violet-600 hover:text-white border-zinc-200/50 hover:border-transparent"
                      }`}
                  >
                    Pilih Paket
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Extra services if > 3 */}
        {sorted.length > 3 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {sorted.slice(3).map((service, index) => {
              const Icon = iconMap[service.icon] || Sparkles;
              const lines = service.description
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean);
              const mainDesc = lines[0] || "";
              const benefits = lines
                .slice(1)
                .map((l) => l.replace(/^[-*•]\s*/, ""));

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative overflow-hidden flex flex-col bg-white rounded-2xl border border-zinc-200/70 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 shadow-sm transition-all duration-300 p-8"
                >
                  {/* Floating Discount Badge */}
                  {service.discount_label && (
                    <div className="absolute top-0 right-0 z-20">
                      <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl shadow-md border-b border-l border-white/20 animate-pulse flex items-center gap-1.5">
                        <span>🔥</span>
                        {service.discount_label}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 group-hover:from-violet-600 group-hover:to-fuchsia-500 group-hover:text-white transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 group-hover:text-violet-600 transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-500 mb-5">
                    {mainDesc}
                  </p>

                  {/* Pricing Block */}
                  <div className="mb-6 p-4 rounded-xl border border-violet-100/40 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 text-zinc-900 transition-all duration-300">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Mulai Dari
                      </span>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {service.price_original && (
                          <span className="text-sm line-through decoration-rose-500/80 decoration-2 text-zinc-400 font-medium">
                            {service.price_original}
                          </span>
                        )}
                        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent text-2xl font-black">
                          {service.price_starting}
                        </span>
                      </div>
                      
                      {service.discount_expires && (
                        <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[10px] font-semibold w-fit border border-amber-200/40 bg-amber-50/80 text-amber-700 animate-pulse">
                          <span className="text-xs">⏰</span>
                          <span>Promo s/d {service.discount_expires}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {benefits.length > 0 && (
                    <ul className="space-y-3 border-t border-zinc-100 pt-6 mb-8 flex-1">
                      {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600">
                          <div className="flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded-full bg-emerald-50">
                            <Check className="h-2.5 w-2.5 text-emerald-600" />
                          </div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href="#contact"
                    className="mt-auto flex w-full items-center justify-center rounded-xl bg-zinc-50 py-3.5 text-sm font-bold text-zinc-700 hover:bg-violet-600 hover:text-white transition-all duration-300 border border-zinc-200/50 hover:border-transparent"
                  >
                    Pilih Paket
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
