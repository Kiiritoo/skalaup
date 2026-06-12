export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { getSiteContent } from "@/lib/data/store";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <>
      <Navbar siteName={content.settings.site_name} logoUrl={content.settings.logo_url} />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={content.settings.site_name}
        tagline={content.settings.site_tagline}
        contact={content.contact}
      />
      <WhatsAppButton phone={content.contact.phone} />
    </>
  );
}
