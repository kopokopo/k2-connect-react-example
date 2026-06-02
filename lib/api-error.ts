import { NextResponse } from "next/server";

export function serializeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "An unknown error occurred";
  }
}

export function errorResponse(error: unknown, status = 500) {
  return NextResponse.json({ error: serializeError(error) }, { status });
}
