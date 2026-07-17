import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server-auth";
import { getCreditWallet } from "@/lib/credits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const wallet = await getCreditWallet(user.uid);

    return NextResponse.json(
      {
        plan: wallet.plan,
        credits: wallet.credits,
        totalReceived: wallet.totalReceived,
        totalUsed: wallet.totalUsed,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro em GET /api/credits:", error);

    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Token do usuário inválido ou ausente.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error: "Erro interno ao carregar os créditos.",
        code: message,
      },
      { status: 500 },
    );
  }
}