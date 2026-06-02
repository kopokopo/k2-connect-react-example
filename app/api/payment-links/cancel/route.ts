import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import k2 from "@/lib/k2-client";
import { getValidToken } from "@/tools/token-instance";

export async function POST(req: NextRequest) {
  try {
    const { location } = await req.json();

    if (!location) {
      return NextResponse.json({ error: "location is required" }, { status: 400 });
    }

    const accessToken = await getValidToken();
    const result = await k2.PaymentLinkService.cancelPaymentLink({ location, accessToken });

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
