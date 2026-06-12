export const dynamic = "force-dynamic";

import { TestimonialsManager } from "@/components/dashboard/testimonials-manager";
import { PageHeader } from "@/components/dashboard/page-header";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { getTestimonials } from "@/lib/data/store";

export default async function TestimonialsDashboardPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <DemoBanner />
      <PageHeader
        title="Testimoni"
        description="Kelola testimoni dari klien"
      />
      <TestimonialsManager initialTestimonials={testimonials} />
    </>
  );
}
