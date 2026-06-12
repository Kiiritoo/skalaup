"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { AboutContent } from "@/lib/types";

interface AboutSectionProps {
  content: AboutContent;
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center overflow-hidden">
              {content.image_url ? (
                <img
                  src={content.image_url}
                  alt={content.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-7xl mb-4">💡</div>
                  <p className="text-3xl font-bold text-violet-700">
                    {content.experience_years}+
                  </p>
                  <p className="text-sm text-zinc-500">Tahun Pengalaman</p>
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 opacity-20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-3">
              Tentang Kami
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-6">
              {content.title}
            </h2>
            <p className="text-zinc-500 leading-relaxed text-lg mb-8">
              {content.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
