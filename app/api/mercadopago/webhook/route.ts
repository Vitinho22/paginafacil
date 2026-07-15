import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function handle(request: NextRequest) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) return NextResponse.json({ received: true });

  const url = new URL(request.url);
  let paymentId = url.searchParams.get("data.id") || url.searchParams.get("id");

  if (request.method === "POST") {
    try {
      const body = await request.json();
      paymentId = body?.data?.id || body?.id || paymentId;
    } catch {
      // Algumas notificações chegam sem corpo JSON.
    }
  }

  if (paymentId) {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      const payment = await response.json();
      console.info("Mercado Pago payment update", {
        id: payment?.id,
        status: payment?.status,
        externalReference: payment?.external_reference,
      });
    } catch (error) {
      console.error("Mercado Pago webhook error", error);
    }
  }

  return NextResponse.json({ received: true });
}

export async function POST(request: NextRequest) {
  return handle(request);
}

export async function GET(request: NextRequest) {
  return handle(request);
}
