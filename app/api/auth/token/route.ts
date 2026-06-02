import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import { getValidToken } from "@/tools/token-instance";

export async function GET() {
  try {
    const access_token = await getValidToken();
    return NextResponse.json({ access_token });
  } catch (error) {
    return errorResponse(error);
  }
}
