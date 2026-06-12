import { NextResponse } from "next/server";
import { markMessageRead, deleteMessage } from "@/lib/data/store";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const message = await markMessageRead(id);
  if (!message) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(message);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteMessage(id);
  return NextResponse.json({ success: true });
}
