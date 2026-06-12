export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { PortfolioSection } from "@/components/public/portfolio-section";
import { ServicesSection } from "@/components/public/services-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { ContactSection } from "@/components/public/contact-section";
import { getSiteContent } from "@/lib/data/store";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      <PortfolioSection items={content.portfolio} />
      <ServicesSection services={content.services} />
      <TestimonialsSection testimonials={content.testimonials} />
      <ContactSection contact={content.contact} />
    </>
  );
}
