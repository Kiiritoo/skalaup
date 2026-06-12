import Link from "next/link";
import {
  Briefcase,
  MessageSquare,
  Star,
  Wrench,
  ArrowRight,
  Mail,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { getSiteContent, getMessages } from "@/lib/data/store";

const quickLinks = [
  { href: "/dashboard/hero", label: "Edit Hero Section", icon: Star },
  { href: "/dashboard/portfolio", label: "Kelola Portofolio", icon: Briefcase },
  { href: "/dashboard/contact", label: "Info Kontak", icon: MessageSquare },
  { href: "/dashboard/messages", label: "Pesan Masuk", icon: Mail },
];

export default async function DashboardPage() {
  const user = await getUser();
  const content = await getSiteContent();
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <DemoBanner />
      <DashboardHeader
        title="Dashboard"
        description="Selamat datang di panel CMS StudioWave"
        userName={user?.name}
        unreadMessages={unreadCount}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Proyek Portofolio"
          value={content.portfolio.length}
          icon={Briefcase}
        />
        <StatsCard
          title="Layanan"
          value={content.services.length}
          icon={Wrench}
        />
        <StatsCard
          title="Testimoni"
          value={content.testimonials.length}
          icon={Star}
        />
        <StatsCard
          title="Pesan Masuk"
          value={messages.length}
          description={`${unreadCount} belum dibaca`}
          icon={Mail}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-violet-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      {link.label}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 transition-colors" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pesan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-sm text-zinc-400 text-center py-8">
                Belum ada pesan masuk
              </p>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50"
                  >
                    <div
                      className={`h-2 w-2 rounded-full mt-2 shrink-0 ${
                        msg.read ? "bg-zinc-300" : "bg-violet-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {msg.name} — {msg.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
