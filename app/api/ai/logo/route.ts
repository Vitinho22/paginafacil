import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

function apiError(payload: unknown, status: number): string {
  const message =
    payload && typeof payload === "object" && "error" in payload
      ? (payload as { error?: { message?: string } }).error?.message
      : undefined;
  if (status === 401) return "A chave da IA é inválida. Atualize OPENAI_API_KEY na Vercel.";
  if (status === 429) return "A conta da IA está sem saldo ou atingiu o limite de uso.";
  if (status === 403) return "Sua organização ainda não foi liberada para modelos de imagem. Confira a verificação na plataforma da API.";
  if (status === 403) return "Sua organização ainda não foi liberada para modelos de imagem. Confira a verificação na plataforma da API.";
  return message || "A IA não conseguiu criar o símbolo agora.";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "IA não configurada. Adicione OPENAI_API_KEY na Vercel e faça um novo deploy." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      name?: string;
      segment?: string;
      style?: string;
      colors?: string;
      idea?: string;
    };
    const name = String(body.name || "").trim();
    const segment = String(body.segment || "").trim();
    const style = String(body.style || "Moderno").trim();
    const colors = String(body.colors || "roxo e azul").trim();
    const idea = String(body.idea || "").trim();
    if (name.length < 2) return NextResponse.json({ error: "Informe o nome da marca." }, { status: 400 });
    if (segment.length < 2) return NextResponse.json({ error: "Informe o segmento da marca." }, { status: 400 });

    const prompt = [
      "Crie somente um símbolo gráfico original para uma identidade visual profissional.",
      `Marca: ${name}. Segmento: ${segment}. Estilo: ${style}. Paleta: ${colors}.`,
      idea ? `Ideia do cliente: ${idea}.` : "",
      "O símbolo deve ser simples, memorável, equilibrado, legível em tamanho pequeno e adequado para uso comercial.",
      "Centralize um único símbolo em fundo totalmente transparente.",
      "Não escreva o nome da empresa, não use letras, palavras, mockups, cartões, paredes ou fotografias.",
    ].filter(Boolean).join(" ");

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-1.5",
        prompt,
        size: "1024x1024",
        quality: "medium",
        background: "transparent",
        output_format: "png",
        n: 1,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
      error?: { message?: string };
    };
    if (!response.ok) {
      console.error("OpenAI logo error", response.status, payload.error);
      return NextResponse.json({ error: apiError(payload, response.status) }, { status: response.status });
    }
    const result = payload.data?.[0];
    const imageUrl = result?.b64_json ? `data:image/png;base64,${result.b64_json}` : result?.url;
    if (!imageUrl) return NextResponse.json({ error: "A IA não devolveu um símbolo válido." }, { status: 502 });
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Logo route error", error);
    return NextResponse.json({ error: "Falha interna ao gerar o símbolo." }, { status: 500 });
  }
}
