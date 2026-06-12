import { NextResponse } from "next/server";
import { getTestimonials, updateTestimonials } from "@/lib/data/store";

export async function GET() {
  return NextResponse.json(await getTestimonials());
}

export async function PUT(request: Request) {
  const testimonials = await request.json();
  const updated = await updateTestimonials(testimonials);
  return NextResponse.json(updated);
}
