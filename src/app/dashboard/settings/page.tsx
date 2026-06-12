import { PageHeader } from "@/components/dashboard/page-header";
import { ContentForm } from "@/components/dashboard/content-form";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getSiteContent } from "@/lib/data/store";

export default async function SettingsDashboardPage() {
  const content = await getSiteContent();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Pengaturan"
        description="Konfigurasi umum website"
      />
      <ContentForm
        title="Pengaturan Website"
        endpoint="/api/content/settings"
        initialData={{
          site_name: content.settings.site_name,
          site_tagline: content.settings.site_tagline,
          primary_color: content.settings.primary_color,
          logo_url: content.settings.logo_url || "",
        }}
        fields={[
          { name: "site_name", label: "Nama Website", type: "text" },
          { name: "site_tagline", label: "Tagline", type: "text" },
          { name: "primary_color", label: "Warna Utama (hex)", type: "text", placeholder: "#7C3AED" },
          { name: "logo_url", label: "Logo Website", type: "image" },
        ]}
      />
    </>
  );
}
