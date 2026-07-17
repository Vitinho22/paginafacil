import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const MAX_BYTES = 8 * 1024 * 1024;

type GenerationMode = "ai" | "upload";

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

function apiError(payload: OpenAIImagePayload, status: number): string {
  const message = payload.error?.message;

  if (status === 401) {
    return "A chave da IA é inválida. Atualize OPENAI_API_KEY na Vercel e publique novamente.";
  }

  if (status === 429) {
    return "A conta da IA está sem saldo, atingiu o limite ou recebeu muitas solicitações. Confira a cobrança da API.";
  }

  if (status === 403) {
    return "Sua organização ainda não foi liberada para modelos de imagem. Confira a verificação na plataforma da API.";
  }

  if (status === 400 && message) {
    return `A IA recusou a solicitação: ${message}`;
  }

  return message || "A IA não conseguiu gerar a imagem agora.";
}

function getImageSize(format: string): string {
  if (format === "Stories" || format === "Pinterest") {
    return "1024x1536";
  }

  if (format === "YouTube") {
    return "1536x1024";
  }

  return "1024x1024";
}

function buildPrompt({
  idea,
  objective,
  format,
  style,
  editing,
}: {
  idea: string;
  objective: string;
  format: string;
  style: string;
  editing: boolean;
}): string {
  const formatDirection =
    format === "Stories" || format === "Pinterest"
      ? "composição vertical para redes sociais"
      : format === "YouTube"
        ? "composição horizontal para capa de vídeo"
        : "composição quadrada para publicação em rede social";

  const styleDirection: Record<string, string> = {
    Luxo:
      "estética sofisticada, iluminação cinematográfica, materiais refinados e acabamento publicitário premium",
    Minimalista:
      "estética minimalista, composição limpa, poucos elementos, iluminação suave e muito espaço visual",
    Moderno:
      "estética contemporânea, composição editorial, iluminação moderna e acabamento comercial elegante",
    Impactante:
      "estética marcante, alto contraste, enquadramento dinâmico e aparência de campanha publicitária",
    luxury:
      "estética sofisticada, iluminação cinematográfica, materiais refinados e acabamento publicitário premium",
    minimalist:
      "estética minimalista, composição limpa, poucos elementos, iluminação suave e muito espaço visual",
    modern:
      "estética contemporânea, composição editorial, iluminação moderna e acabamento comercial elegante",
    bold:
      "estética marcante, alto contraste, enquadramento dinâmico e aparência de campanha publicitária",
  };

  return [
    editing
      ? "Transforme a imagem enviada em uma fotografia publicitária profissional."
      : "Crie do zero uma imagem publicitária profissional.",
    `Objetivo da campanha: ${objective}.`,
    `Direção do cliente: ${idea}.`,
    `Formato: ${formatDirection}.`,
    `Estilo visual: ${styleDirection[style] || styleDirection.Moderno}.`,
    editing
      ? "Preserve fielmente o produto, pessoa, embalagem e identidade visual presentes na imagem original."
      : "Crie uma composição original, realista, elegante e comercialmente atraente.",
    "Melhore iluminação, contraste, profundidade, enquadramento e acabamento visual.",
    "A imagem deve parecer produzida por uma agência profissional, não por um template genérico.",
    "Não escreva palavras, preços, letras, frases ou chamadas dentro da imagem.",
    "Não crie logotipos, marcas d'água, assinaturas ou marcas inventadas.",
    "Não duplique objetos e não distorça mãos, rostos, produtos ou embalagens.",
    "Entregue somente a imagem final limpa, pronta para receber textos opcionais no editor.",
  ].join(" ");
}

function imageUrlFromPayload(
  payload: OpenAIImagePayload,
  outputFormat: "png" | "jpeg" | "webp",
): string | undefined {
  const result = payload.data?.[0];

  if (result?.b64_json) {
    return `data:image/${outputFormat};base64,${result.b64_json}`;
  }

  return result?.url;
}

async function generateFromPrompt({
  apiKey,
  model,
  prompt,
  size,
}: {
  apiKey: string;
  model: string;
  prompt: string;
  size: string;
}) {
  const response = await fetch(
    "https://api.openai.com/v1/images/generations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        size,
        quality: "medium",
        output_format: "webp",
        output_compression: 86,
        n: 1,
      }),
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as OpenAIImagePayload;

  return {
    response,
    payload,
  };
}

async function editUploadedImage({
  apiKey,
  model,
  prompt,
  size,
  image,
}: {
  apiKey: string;
  model: string;
  prompt: string;
  size: string;
  image: File;
}) {
  const body = new FormData();

  body.append("model", model);
  body.append("image", image, image.name || "entrada.png");
  body.append("prompt", prompt);
  body.append("size", size);
  body.append("quality", "medium");
  body.append("output_format", "webp");
  body.append("output_compression", "86");

  const response = await fetch(
    "https://api.openai.com/v1/images/edits",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body,
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as OpenAIImagePayload;

  return {
    response,
    payload,
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "IA não configurada. Adicione OPENAI_API_KEY nas variáveis da Vercel e faça um novo deploy.",
        },
        { status: 503 },
      );
    }

    const incoming = await request.formData();

    const modeValue = String(incoming.get("mode") || "ai");
    const mode: GenerationMode =
      modeValue === "upload" ? "upload" : "ai";

    const image = incoming.get("image");
    const idea = String(incoming.get("idea") || "").trim();
    const objective = String(
      incoming.get("objective") ||
        "Divulgar um produto ou serviço",
    ).trim();
    const format = String(
      incoming.get("format") || "Instagram",
    ).trim();
    const style = String(
      incoming.get("style") || "Moderno",
    ).trim();

    if (idea.length < 8) {
      return NextResponse.json(
        {
          error: "Descreva melhor como deseja a imagem.",
        },
        { status: 400 },
      );
    }

    if (mode === "upload") {
      if (!(image instanceof File)) {
        return NextResponse.json(
          {
            error:
              "Envie uma imagem para usar o modo de melhoria.",
          },
          { status: 400 },
        );
      }

      if (!ALLOWED_TYPES.has(image.type)) {
        return NextResponse.json(
          {
            error: "Use uma imagem PNG, JPG ou WEBP.",
          },
          { status: 400 },
        );
      }

      if (image.size > MAX_BYTES) {
        return NextResponse.json(
          {
            error:
              "A imagem processada deve ter no máximo 8 MB.",
          },
          { status: 400 },
        );
      }
    }

    const model =
      process.env.OPENAI_IMAGE_MODEL?.trim() ||
      "gpt-image-1.5";

    const size = getImageSize(format);

    const prompt = buildPrompt({
      idea,
      objective,
      format,
      style,
      editing: mode === "upload",
    });

    const { response, payload } =
      mode === "upload" && image instanceof File
        ? await editUploadedImage({
            apiKey,
            model,
            prompt,
            size,
            image,
          })
        : await generateFromPrompt({
            apiKey,
            model,
            prompt,
            size,
          });

    if (!response.ok) {
      console.error(
        "OpenAI banner error",
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

    const imageUrl = imageUrlFromPayload(payload, "webp");

    if (!imageUrl) {
      return NextResponse.json(
        {
          error:
            "A IA não devolveu uma imagem válida.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      imageUrl,
      mode,
      format,
      size,
    });
  } catch (error) {
    console.error("Banner route error", error);

    return NextResponse.json(
      {
        error:
          "Falha interna ao gerar a imagem. Tente novamente.",
      },
      { status: 500 },
    );
  }
}