import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024;

function apiError(payload: unknown, status: number): string {
  const message =
    payload && typeof payload === "object" && "error" in payload
      ? (payload as { error?: { message?: string; code?: string } }).error?.message
      : undefined;

  if (status === 401) return "A chave da IA é inválida. Atualize OPENAI_API_KEY na Vercel e publique novamente.";
  if (status === 429) return "A conta da IA está sem saldo, atingiu o limite ou recebeu muitas solicitações. Confira a cobrança da API.";
  if (status === 403) return "Sua organização ainda não foi liberada para modelos de imagem. Confira a verificação na plataforma da API.";
  if (status === 403) return "Sua organização ainda não foi liberada para modelos de imagem. Confira a verificação na plataforma da API.";
  if (status === 400 && message) return `A IA recusou a imagem: ${message}`;
  return message || "A IA não conseguiu editar a imagem agora.";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "IA não configurada. Adicione OPENAI_API_KEY nas variáveis da Vercel e faça um novo deploy." },
        { status: 503 },
      );
    }

    const incoming = await request.formData();
    const image = incoming.get("image");
    const idea = String(incoming.get("idea") || "").trim();
    const objective = String(incoming.get("objective") || "Divulgar um produto ou serviço").trim();
    const format = String(incoming.get("format") || "Instagram").trim();

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Envie uma imagem para criar o banner." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(image.type)) {
      return NextResponse.json({ error: "Use uma imagem PNG, JPG ou WEBP." }, { status: 400 });
    }
    if (image.size > MAX_BYTES) {
      return NextResponse.json({ error: "A imagem processada deve ter no máximo 8 MB." }, { status: 400 });
    }
    if (idea.length < 8) {
      return NextResponse.json({ error: "Descreva melhor como deseja o banner." }, { status: 400 });
    }

    const portrait = format === "Stories" || format === "Pinterest";
    const size = portrait ? "1024x1536" : "1536x1024";
    const prompt = [
      "Transforme a fotografia enviada na imagem principal de uma campanha publicitária profissional.",
      `Objetivo: ${objective}.`,
      `Direção do cliente: ${idea}.`,
      portrait ? "Composição vertical para redes sociais." : "Composição horizontal ou quadrada com enquadramento flexível.",
      "Preserve fielmente o produto, pessoa, embalagem e identidade visual presentes na foto original.",
      "Melhore fundo, iluminação, contraste, recorte e profundidade com aparência fotográfica natural.",
      "Deixe uma área limpa e escura ou de baixo detalhe para o aplicativo inserir título, descrição e botão.",
      "Não escreva palavras, preços, letras, logotipos novos ou marcas inventadas.",
      "Não duplique objetos e não altere características essenciais do produto.",
    ].join(" ");

    const body = new FormData();
    body.append("model", process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1.5");
    body.append("image", image, "entrada.png");
    body.append("prompt", prompt);
    body.append("size", size);
    body.append("quality", "medium");
    body.append("output_format", "webp");
    body.append("output_compression", "86");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
      cache: "no-store",
    });

    const payload = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
      error?: { message?: string; code?: string };
    };

    if (!response.ok) {
      console.error("OpenAI banner error", response.status, payload.error);
      return NextResponse.json({ error: apiError(payload, response.status) }, { status: response.status });
    }

    const result = payload.data?.[0];
    const imageUrl = result?.b64_json ? `data:image/webp;base64,${result.b64_json}` : result?.url;
    if (!imageUrl) return NextResponse.json({ error: "A IA não devolveu uma imagem válida." }, { status: 502 });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Banner route error", error);
    return NextResponse.json({ error: "Falha interna ao processar a imagem. Tente novamente." }, { status: 500 });
  }
}
