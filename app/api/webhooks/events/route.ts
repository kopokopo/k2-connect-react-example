import { NextResponse } from "next/server";
import { getWebhookEvents, clearWebhookEvents } from "@/lib/webhook-store";

export async function GET() {
  return NextResponse.json(getWebhookEvents());
}

export async function DELETE() {
  clearWebhookEvents();
  return NextResponse.json({ cleared: true });
}
