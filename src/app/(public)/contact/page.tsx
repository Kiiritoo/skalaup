import { ContactSection } from "@/components/public/contact-section";
import { getSiteContent } from "@/lib/data/store";

export const metadata = {
  title: "Kontak — StudioWave",
  description: "Hubungi kami untuk memulai proyek website kamu",
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <div className="pt-24">
      <ContactSection contact={content.contact} />
    </div>
  );
}
