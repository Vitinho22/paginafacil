import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json({ configured: Boolean(process.env.OPENAI_API_KEY?.trim()) });
}
