import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import k2 from "@/lib/k2-client";
import { getValidToken } from "@/tools/token-instance";

export async function GET(req: NextRequest) {
  try {
    const location = new URL(req.url).searchParams.get("location");

    if (!location) {
      return NextResponse.json({ error: "location is required" }, { status: 400 });
    }

    const accessToken = await getValidToken();
    const status = await k2.StkService.getStatus({ location, accessToken });

    return NextResponse.json(status);
  } catch (error) {
    return errorResponse(error);
  }
}
