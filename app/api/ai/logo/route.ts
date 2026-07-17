import { NextResponse } from "next/server";
import { requireUser } from "@/lib/server-auth";
import { addCredits, consumeCredits } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 120;

const LOGO_CREDIT_COST = 2;

type LogoRequestBody = {
  name?: string;
  segment?: string;
  style?: string;
  colors?: string;
  idea?: string;
};

type OpenAIImagePayload = {
  data?: Array<{
    b64_json?: string;
    url?: string;
  }>;
  error?: {
    message?: string;
    code?: string;
    type?: string;
  };
};

function apiError(
  payload: OpenAIImagePayload,
  status: number,
): string {
  const message = payload.error?.message;

  if (status === 401) {
    return "A chave da IA é inválida. Atualize OPENAI_API_KEY na Vercel.";
  }

  if (status === 429) {
    return "A conta da IA está sem saldo, atingiu o limite ou recebeu muitas solicitações.";
  }

  if (status === 403) {
    return "Sua organização ainda não foi liberada para modelos de imagem.";
  }

  if (status === 400 && message) {
    return `A IA recusou a solicitação: ${message}`;
  }

  return message || "A IA não conseguiu criar o símbolo agora.";
}

function buildLogoPrompt({
  name,
  segment,
  style,
  colors,
  idea,
}: {
  name: string;
  segment: string;
  style: string;
  colors: string;
  idea: string;
}) {
  const styleDirections: Record<string, string> = {
    Minimalista:
      "minimalista, geométrico, limpo, com poucas formas e excelente leitura em tamanhos pequenos",
    Luxo:
      "sofisticado, refinado, elegante, com proporções premium e acabamento de estúdio de branding",
    Moderno:
      "contemporâneo, inteligente, tecnológico e visualmente equilibrado",
    Criativo:
      "original, expressivo, autoral e marcante, sem perder simplicidade",
  };

  return [
    "Crie somente um símbolo de marca profissional, original e autoral.",
    `A marca se chama ${name} e atua no segmento de ${segment}.`,
    `Direção visual: ${styleDirections[style] || styleDirections.Moderno}.`,
    `Paleta desejada: ${colors}.`,
    idea ? `Briefing adicional do cliente: ${idea}.` : "",
    "O resultado deve parecer desenvolvido por um estúdio profissional de identidade visual.",
    "Crie um símbolo vetorial simples, memorável, equilibrado, reconhecível e escalável.",
    "Use geometria limpa, proporções consistentes e boa leitura em tamanho pequeno.",
    "Evite qualquer solução genérica, óbvia ou parecida com clipart de banco de imagens.",
    "Não crie mascote, personagem, desenho infantil ou ilustração literal do segmento.",
    "Não use cupcake, bolo, lâmpada, foguete, coroa, escudo, globo, folha ou ícones clichês, a menos que o briefing peça explicitamente.",
    "Prefira abstração inteligente, monograma não textual, formas negativas, ritmo visual e construção simbólica.",
    "Não escreva o nome da empresa.",
    "Não use letras, palavras, números, slogan ou tipografia.",
    "Não crie mockup, cartão, parede, embalagem, papelaria, cenário ou fotografia.",
    "Não use efeito 3D, sombra pesada, brilho exagerado, textura realista ou fundo decorativo.",
    "Entregue um único símbolo centralizado, isolado e ocupando bem a área.",
    "Fundo totalmente transparente.",
    "A saída deve conter somente o símbolo final.",
  ]
    .filter(Boolean)
    .join(" ");
}

function getImageUrl(payload: OpenAIImagePayload) {
  const result = payload.data?.[0];

  if (result?.b64_json) {
    return `data:image/png;base64,${result.b64_json}`;
  }

  return result?.url;
}

export async function POST(request: Request) {
  let chargedUid: string | null = null;
  let refunded = false;

  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "IA não configurada. Adicione OPENAI_API_KEY na Vercel e faça um novo deploy.",
        },
        { status: 503 },
      );
    }

    const user = await requireUser(request);
    const body = (await request.json()) as LogoRequestBody;

    const name = String(body.name || "").trim();
    const segment = String(body.segment || "").trim();
    const style = String(body.style || "Moderno").trim();
    const colors = String(body.colors || "roxo e azul").trim();
    const idea = String(body.idea || "").trim();

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Informe o nome da marca." },
        { status: 400 },
      );
    }

    if (segment.length < 2) {
      return NextResponse.json(
        { error: "Informe o segmento da marca." },
        { status: 400 },
      );
    }

    if (idea.length > 500) {
      return NextResponse.json(
        { error: "A ideia do símbolo deve ter no máximo 500 caracteres." },
        { status: 400 },
      );
    }

    let remainingCredits: number;

    try {
      const creditResult = await consumeCredits({
        uid: user.uid,
        amount: LOGO_CREDIT_COST,
        reason: "logo_generation",
        metadata: {
          resource: "logo",
          style,
          segment,
        },
      });

      chargedUid = user.uid;
      remainingCredits = creditResult.remainingCredits;
    } catch (creditError) {
      if (
        creditError instanceof Error &&
        creditError.message === "INSUFFICIENT_CREDITS"
      ) {
        return NextResponse.json(
          {
            error:
              "Você precisa de pelo menos 2 créditos para gerar um logo.",
          },
          { status: 402 },
        );
      }

      throw creditError;
    }

    const prompt = buildLogoPrompt({
      name,
      segment,
      style,
      colors,
      idea,
    });

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:
            process.env.OPENAI_IMAGE_MODEL?.trim() ||
            "gpt-image-1.5",
          prompt,
          size: "1024x1024",
          quality: "high",
          background: "transparent",
          output_format: "png",
          n: 1,
        }),
        cache: "no-store",
      },
    );

    const payload =
      (await response.json()) as OpenAIImagePayload;

    if (!response.ok) {
      if (chargedUid) {
        await addCredits({
          uid: chargedUid,
          amount: LOGO_CREDIT_COST,
          reason: "refund",
          metadata: {
            resource: "logo",
            cause: "openai_error",
            status: response.status,
          },
        });

        refunded = true;
      }

      console.error(
        "OpenAI logo error",
        response.status,
        payload.error,
      );

      return NextResponse.json(
        {
          error: apiError(payload, response.status),
        },
        { status: response.status },
      );
    }

    const imageUrl = getImageUrl(payload);

    if (!imageUrl) {
      if (chargedUid) {
        await addCredits({
          uid: chargedUid,
          amount: LOGO_CREDIT_COST,
          reason: "refund",
          metadata: {
            resource: "logo",
            cause: "invalid_image_response",
          },
        });

        refunded = true;
      }

      return NextResponse.json(
        {
          error: "A IA não devolveu um símbolo válido.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      imageUrl,
      remainingCredits,
    });
  } catch (error) {
    console.error("Logo route error", error);

    if (chargedUid && !refunded) {
      try {
        await addCredits({
          uid: chargedUid,
          amount: LOGO_CREDIT_COST,
          reason: "refund",
          metadata: {
            resource: "logo",
            cause: "internal_error",
          },
        });
      } catch (refundError) {
        console.error(
          "Erro ao devolver créditos do logo:",
          refundError,
        );
      }
    }

    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error:
            "Sua sessão expirou. Entre novamente na sua conta.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error:
          "Falha interna ao gerar o símbolo. Tente novamente.",
      },
      { status: 500 },
    );
  }
}