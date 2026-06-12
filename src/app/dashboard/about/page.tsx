export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/dashboard/page-header";
import { ContentForm } from "@/components/dashboard/content-form";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getSiteContent } from "@/lib/data/store";

export default async function AboutDashboardPage() {
  const content = await getSiteContent();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Tentang"
        description="Edit informasi tentang perusahaan/tim"
      />
      <ContentForm
        title="Konten Tentang"
        endpoint="/api/content/about"
        initialData={{
          title: content.about.title,
          description: content.about.description,
          experience_years: content.about.experience_years,
          skills: content.about.skills.join(", "),
          image_url: content.about.image_url || "",
        }}
        arrayFields={["skills"]}
        fields={[
          { name: "title", label: "Judul", type: "text" },
          { name: "description", label: "Deskripsi", type: "textarea", rows: 5 },
          { name: "experience_years", label: "Tahun Pengalaman", type: "number" },
          { name: "skills", label: "Keahlian", type: "text", placeholder: "Web Design, UI/UX, Development" },
          { name: "image_url", label: "Gambar Section", type: "image" },
        ]}
      />
    </>
  );
}
