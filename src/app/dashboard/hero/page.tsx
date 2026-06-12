import { PageHeader } from "@/components/dashboard/page-header";
import { ContentForm } from "@/components/dashboard/content-form";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getSiteContent } from "@/lib/data/store";

export default async function HeroDashboardPage() {
  const content = await getSiteContent();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Hero Section"
        description="Edit bagian utama halaman depan website"
      />
      <ContentForm
        title="Konten Hero"
        endpoint="/api/content/hero"
        initialData={{
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          description: content.hero.description,
          cta_text: content.hero.cta_text,
          cta_link: content.hero.cta_link,
        }}
        fields={[
          { name: "title", label: "Judul Utama", type: "text", placeholder: "Bangun Website Impianmu" },
          { name: "subtitle", label: "Subjudul", type: "text", placeholder: "Platform modern untuk kreator" },
          { name: "description", label: "Deskripsi", type: "textarea", rows: 4 },
          { name: "cta_text", label: "Teks Tombol CTA", type: "text" },
          { name: "cta_link", label: "Link Tombol CTA", type: "text" },
        ]}
      />
    </>
  );
}
