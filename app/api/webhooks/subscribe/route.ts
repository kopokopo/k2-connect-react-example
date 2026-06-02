import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import k2 from "@/lib/k2-client";
import { getValidToken } from "@/tools/token-instance";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    const location = await k2.Webhooks.subscribe({
      eventType: body.eventType,
      url: body.url,
      scope: body.scope || "till",
      scopeReference: body.scopeReference || process.env.K2_TILL_NUMBER!,
      accessToken,
    });

    return NextResponse.json({ location });
  } catch (error) {
    return errorResponse(error);
  }
}
