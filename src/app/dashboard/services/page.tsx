export const dynamic = "force-dynamic";

import { ServicesManager } from "@/components/dashboard/services-manager";
import { PageHeader } from "@/components/dashboard/page-header";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getServices } from "@/lib/data/store";

export default async function ServicesDashboardPage() {
  const services = await getServices();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Layanan"
        description="Kelola daftar layanan yang ditawarkan"
      />
      <ServicesManager initialServices={services} />
    </>
  );
}
