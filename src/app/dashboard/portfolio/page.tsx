export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/dashboard/page-header";
import { PortfolioManager } from "@/components/dashboard/portfolio-manager";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getPortfolio } from "@/lib/data/store";

export default async function PortfolioDashboardPage() {
  const items = await getPortfolio();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Portofolio"
        description="Kelola proyek-proyek di halaman portofolio"
      />
      <PortfolioManager initialItems={items} />
    </>
  );
}
