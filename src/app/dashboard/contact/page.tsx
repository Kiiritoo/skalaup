import { PageHeader } from "@/components/dashboard/page-header";
import { ContentForm } from "@/components/dashboard/content-form";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getSiteContent } from "@/lib/data/store";

export default async function ContactDashboardPage() {
  const content = await getSiteContent();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Kontak"
        description="Edit informasi kontak dan media sosial"
      />
      <ContentForm
        title="Informasi Kontak"
        endpoint="/api/content/contact"
        initialData={{
          email: content.contact.email,
          phone: content.contact.phone,
          address: content.contact.address,
          social_instagram: content.contact.social_instagram,
          social_linkedin: content.contact.social_linkedin,
          social_twitter: content.contact.social_twitter,
          social_github: content.contact.social_github,
        }}
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Telepon", type: "text" },
          { name: "address", label: "Alamat", type: "text" },
          { name: "social_instagram", label: "Instagram URL", type: "url" },
          { name: "social_linkedin", label: "LinkedIn URL", type: "url" },
          { name: "social_twitter", label: "Twitter URL", type: "url" },
          { name: "social_github", label: "GitHub URL", type: "url" },
        ]}
      />
    </>
  );
}
