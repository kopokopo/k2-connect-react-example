import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import k2 from "@/lib/k2-client";
import { getValidToken } from "@/tools/token-instance";
import { formatPhone } from "@/lib/format-phone";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    const location = await k2.SendMoneyService.sendMoney({
      sourceIdentifier: body.sourceIdentifier ?? process.env.K2_TILL_NUMBER!,
      currency: "KES",
      destinations: body.destinations.map((d: Record<string, unknown>) =>
        d.phone_number
          ? { ...d, phone_number: formatPhone(d.phone_number as string).replace(/^\+/, "") }
          : d
      ),
      callbackUrl: process.env.K2_CALLBACK_URL!,
      accessToken,
      metadata: body.metadata,
    });

    return NextResponse.json({ location });
  } catch (error) {
    return errorResponse(error);
  }
}
