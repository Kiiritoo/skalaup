import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  GithubIcon,
} from "@/components/ui/social-icons";
import type { ContactInfo } from "@/lib/types";

interface FooterProps {
  siteName?: string;
  tagline?: string;
  contact?: ContactInfo;
}

export function Footer({
  siteName = "StudioWave",
  tagline = "Create. Launch. Grow.",
  contact,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-zinc-100 bg-zinc-50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-900">{siteName}</span>
            </div>
            <p className="text-zinc-500 max-w-sm leading-relaxed">{tagline}</p>
            {contact && (
              <div className="flex gap-3 mt-6">
                {contact.social_instagram && (
                  <a
                    href={contact.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-violet-600 hover:border-violet-200 transition-colors"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {contact.social_linkedin && (
                  <a
                    href={contact.social_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-violet-600 hover:border-violet-200 transition-colors"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </a>
                )}
                {contact.social_twitter && (
                  <a
                    href={contact.social_twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-violet-600 hover:border-violet-200 transition-colors"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </a>
                )}
                {contact.social_github && (
                  <a
                    href={contact.social_github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:text-violet-600 hover:border-violet-200 transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4">Navigasi</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/portfolio", label: "Portofolio" },
                { href: "/contact", label: "Kontak" },
                { href: "/login", label: "CMS Login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-violet-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              {contact?.email && <li>{contact.email}</li>}
              {contact?.phone && <li>{contact.phone}</li>}
              {contact?.address && <li>{contact.address}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-400">
            &copy; {year} {siteName}. All rights reserved.
          </p>
          <p className="text-sm text-zinc-400">
            Dibuat dengan ❤️ menggunakan Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
