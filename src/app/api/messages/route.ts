import { NextResponse } from "next/server";
import { getMessages, addMessage } from "@/lib/data/store";

export async function GET() {
  return NextResponse.json(await getMessages());
}

export async function POST(request: Request) {
  const data = await request.json();
  const message = await addMessage(data);
  return NextResponse.json(message);
}
