import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import k2 from "@/lib/k2-client";
import { getValidToken } from "@/tools/token-instance";

function sanitizeText(text: string): string {
  return text
    .replace(/[–—]/g, "-")   // unicode dashes → ASCII hyphen
    .replace(/['']/g, "'")   // curly single quotes → straight
    .replace(/[""]/g, '"')   // curly double quotes → straight
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    const payload = {
      amount: Number(body.amount),
      currency: "KES",
      tillNumber: process.env.K2_TILL_NUMBER!,
      callbackUrl: process.env.K2_CALLBACK_URL!,
      accessToken,
      paymentReference: body.paymentReference ? sanitizeText(body.paymentReference) : undefined,
      note: body.note ? sanitizeText(body.note) : undefined,
      metadata: body.metadata ?? undefined,
    };

    console.log("[payment-links] request payload:", JSON.stringify({ ...payload, accessToken: "***" }));

    const location = await k2.PaymentLinkService.createPaymentLink(payload);

    return NextResponse.json({ location });
  } catch (error) {
    console.error("[payment-links] error:", error);
    return errorResponse(error);
  }
}
