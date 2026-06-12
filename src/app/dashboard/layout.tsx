export const dynamic = "force-dynamic";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { getSiteContent } from "@/lib/data/store";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-zinc-50">
      <DashboardSidebar siteName={content.settings.site_name} />
      <div className="lg:pl-64 transition-all duration-300">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
