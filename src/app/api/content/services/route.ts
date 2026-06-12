import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServices, updateServices } from "@/lib/data/store";

export async function GET() {
  return NextResponse.json(await getServices());
}

export async function PUT(request: Request) {
  const services = await request.json();
  const updated = await updateServices(services);
  revalidatePath("/");
  revalidatePath("/dashboard/services");
  return NextResponse.json(updated);
}
