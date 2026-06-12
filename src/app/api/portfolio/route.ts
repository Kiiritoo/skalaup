import { NextResponse } from "next/server";
import { getPortfolio, addPortfolioItem } from "@/lib/data/store";

export async function GET() {
  return NextResponse.json(await getPortfolio());
}

export async function POST(request: Request) {
  const data = await request.json();
  const item = await addPortfolioItem(data);
  return NextResponse.json(item);
}
