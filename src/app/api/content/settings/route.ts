import { NextResponse } from "next/server";
import { updateSettings } from "@/lib/data/store";

export async function PUT(request: Request) {
  const data = await request.json();
  const settings = await updateSettings(data);
  return NextResponse.json(settings);
}
