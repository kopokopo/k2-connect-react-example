import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import k2 from "@/lib/k2-client";
import { getValidToken } from "@/tools/token-instance";
import { formatPhone } from "@/lib/format-phone";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = await getValidToken();

    const location = await k2.StkService.initiateIncomingPayment({
      tillNumber: process.env.K2_TILL_NUMBER!,
      phoneNumber: formatPhone(body.phoneNumber),
      currency: "KES",
      amount: String(body.amount),
      callbackUrl: process.env.K2_CALLBACK_URL!,
      paymentChannel: "M-PESA STK Push",
      accessToken,
      firstName: body.firstName || undefined,
      lastName: body.lastName || undefined,
      email: body.email || undefined,
      metadata: body.metadata,
    });

    return NextResponse.json({ location });
  } catch (error) {
    return errorResponse(error);
  }
}
