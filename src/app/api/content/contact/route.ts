import { NextResponse } from "next/server";
import { updateContact } from "@/lib/data/store";

export async function PUT(request: Request) {
  const data = await request.json();
  const contact = await updateContact(data);
  return NextResponse.json(contact);
}
