import { PortfolioSection } from "@/components/public/portfolio-section";
import { getSiteContent } from "@/lib/data/store";

export const metadata = {
  title: "Portofolio — StudioWave",
  description: "Lihat koleksi proyek dan karya terbaik kami",
};

export default async function PortfolioPage() {
  const content = await getSiteContent();

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">Portofolio</h1>
        <p className="text-zinc-500 mt-4 max-w-xl mx-auto">
          Koleksi lengkap proyek yang telah kami kerjakan
        </p>
      </div>
      <PortfolioSection items={content.portfolio} showAll />
    </div>
  );
}
