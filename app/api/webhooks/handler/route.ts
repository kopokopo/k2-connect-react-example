import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import { addWebhookEvent } from "@/lib/webhook-store";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-kopokopo-signature");
    const body = await req.text();

    const expected = createHmac("sha256", process.env.K2_API_KEY!)
      .update(body)
      .digest("hex");

    console.log("[webhook] received — signature match:", signature === expected);

    if (!signature || signature !== expected) {
      console.warn("[webhook] signature mismatch — got:", signature, "expected:", expected);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body) as Record<string, unknown>;
    console.log("[webhook] stored event — topic:", payload?.topic);
    addWebhookEvent(payload);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] handler error:", error);
    return errorResponse(error);
  }
}
