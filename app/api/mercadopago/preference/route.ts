import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const plans = {
  profissional: {
    title: "PáginaFácil Profissional — acesso por 30 dias",
    description: "Acesso ao plano Profissional da plataforma PáginaFácil",
    price: 59,
  },
  agencia: {
    title: "PáginaFácil Agência — acesso por 30 dias",
    description: "Acesso ao plano Agência da plataforma PáginaFácil",
    price: 149,
  },
} as const;

type PlanId = keyof typeof plans;

export async function POST(request: NextRequest) {
  try {
    const accessToken =
      process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();

    if (!accessToken) {
      console.error(
        "A variável MERCADO_PAGO_ACCESS_TOKEN não foi encontrada."
      );

      return NextResponse.json(
        {
          error:
            "Pagamento ainda não configurado no servidor.",
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as {
      plan?: PlanId;
      userId?: string;
      userEmail?: string;
    };

    if (!body.plan || !(body.plan in plans)) {
      return NextResponse.json(
        { error: "Plano inválido." },
        { status: 400 }
      );
    }

    const selected = plans[body.plan];

    const configuredUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

    const origin = configuredUrl || request.nextUrl.origin;

    // Em produção, a URL não pode ser localhost.
    const isLocalhost =
      origin.includes("localhost") ||
      origin.includes("127.0.0.1");

    const externalReference = [
      body.plan,
      body.userId || "usuario",
      crypto.randomUUID(),
    ].join(":");

    const preference = {
      items: [
        {
          id: body.plan,
          title: selected.title,
          description: selected.description,
          quantity: 1,
          currency_id: "BRL",
          unit_price: selected.price,
        },
      ],

      payer: body.userEmail
        ? {
            email: body.userEmail,
          }
        : undefined,

      external_reference: externalReference,
      statement_descriptor: "PAGINAFACIL",

      back_urls: {
        success: `${origin}/pagamento/sucesso`,
        pending: `${origin}/pagamento/pendente`,
        failure: `${origin}/pagamento/falha`,
      },

      auto_return: "approved",

      // O Mercado Pago não consegue chamar localhost.
      notification_url: isLocalhost
        ? undefined
        : `${origin}/api/mercadopago/webhook`,

      payment_methods: {
        installments: 12,
      },

      metadata: {
        plan: body.plan,
        user_id: body.userId || null,
        source: "paginafacil-web",
      },
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(preference),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro do Mercado Pago:", {
        status: response.status,
        data,
      });

      return NextResponse.json(
        {
          error:
            data?.message ||
            "O Mercado Pago recusou a criação do pagamento.",
          details:
            process.env.NODE_ENV === "development"
              ? data
              : undefined,
        },
        { status: response.status }
      );
    }

    const useSandbox =
      process.env.MERCADO_PAGO_SANDBOX === "true";

    const checkoutUrl = useSandbox
      ? data.sandbox_init_point
      : data.init_point;

    if (!checkoutUrl) {
      return NextResponse.json(
        {
          error:
            "O Mercado Pago não devolveu o endereço do checkout.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      checkoutUrl,
      preferenceId: data.id,
    });
  } catch (error) {
    console.error("Erro interno da rota de pagamento:", error);

    return NextResponse.json(
      { error: "Erro interno ao iniciar o pagamento." },
      { status: 500 }
    );
  }
}