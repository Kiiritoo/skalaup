import { NextResponse } from "next/server";
import { updatePortfolioItem, deletePortfolioItem } from "@/lib/data/store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const item = await updatePortfolioItem(id, data);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deletePortfolioItem(id);
  return NextResponse.json({ success: true });
}
