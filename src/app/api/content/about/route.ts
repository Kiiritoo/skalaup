import { NextResponse } from "next/server";
import { updateAbout } from "@/lib/data/store";

export async function PUT(request: Request) {
  const data = await request.json();
  const about = await updateAbout(data);
  return NextResponse.json(about);
}
