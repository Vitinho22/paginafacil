import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const firebaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  );

  const paymentConfigured = Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN);

  return NextResponse.json({
    online: true,
    firebaseConfigured,
    paymentConfigured,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
  });
}
