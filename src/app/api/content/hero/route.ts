import { NextResponse } from "next/server";
import { updateHero } from "@/lib/data/store";

export async function PUT(request: Request) {
  const data = await request.json();
  const hero = await updateHero(data);
  return NextResponse.json(hero);
}
