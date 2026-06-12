"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioItem } from "@/lib/types";

interface PortfolioSectionProps {
  items: PortfolioItem[];
  showAll?: boolean;
}

export function PortfolioSection({ items, showAll = false }: PortfolioSectionProps) {
  const displayItems = showAll ? items : items.filter((i) => i.featured).slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-3">
            Portofolio
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Karya Terbaik Kami
          </h2>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
            Lihat proyek-proyek yang sudah kami kerjakan untuk berbagai klien
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="rounded-2xl bg-white border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[16/10] bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-5xl">
                      {["🎨", "📱", "📸", "💻"][index % 4]}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/90 text-zinc-700 hover:text-violet-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.featured && <Badge variant="default">Featured</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAll && items.length > 3 && (
          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button variant="secondary" size="lg" className="group">
                Lihat Semua Proyek
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
