import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type SiteSection = { titulo: string; texto: string };
type GeneratedSite = {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  ctaPrimario: string;
  ctaSecundario: string;
  servicos: SiteSection[];
  beneficios: SiteSection[];
};

function apiError(payload: unknown, status: number): string {
  const message = payload && typeof payload === "object" && "error" in payload
    ? (payload as { error?: { message?: string } }).error?.message
    : undefined;
  if (status === 401) return "A chave da IA é inválida ou foi revogada. Cadastre uma nova OPENAI_API_KEY.";
  if (status === 429) return "A conta da API está sem créditos ou atingiu o limite de uso.";
  if (status === 403) return "Sua organização ainda não tem permissão para usar este modelo.";
  return message || "A IA não conseguiu criar o conteúdo do site.";
}

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const output = Array.isArray(payload?.output) ? payload.output : [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) if (typeof part?.text === "string") return part.text;
  }
  return "";
}

function cleanJson(value: string): string {
  return value.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

function isSectionArray(value: unknown): value is SiteSection[] {
  return Array.isArray(value) && value.length >= 3 && value.every((item) =>
    item && typeof item === "object" && typeof item.titulo === "string" && typeof item.texto === "string"
  );
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ error: "IA não configurada. Adicione OPENAI_API_KEY e reinicie ou publique novamente." }, { status: 503 });

    const input = (await request.json()) as { nome?: string; segmento?: string; cidade?: string; estilo?: string; descricaoInicial?: string };
    const nome = String(input.nome || "").trim();
    const segmento = String(input.segmento || "").trim();
    const cidade = String(input.cidade || "").trim();
    const estilo = String(input.estilo || "Moderno").trim();
    const descricaoInicial = String(input.descricaoInicial || "").trim();
    if (nome.length < 2 || segmento.length < 2) return NextResponse.json({ error: "Informe o nome e o segmento do negócio." }, { status: 400 });

    const prompt = `Crie o conteúdo comercial em português do Brasil para um site profissional.
Negócio: ${nome}
Segmento: ${segmento}
Cidade: ${cidade || "não informada"}
Estilo: ${estilo}
Pedido do cliente: ${descricaoInicial || "apresentar a empresa e gerar contatos"}

Retorne SOMENTE JSON válido, sem markdown, exatamente neste formato:
{"etiqueta":"frase curta","titulo":"título forte","subtitulo":"texto claro","ctaPrimario":"ação","ctaSecundario":"ação secundária","servicos":[{"titulo":"...","texto":"..."},{"titulo":"...","texto":"..."},{"titulo":"...","texto":"..."}],"beneficios":[{"titulo":"...","texto":"..."},{"titulo":"...","texto":"..."},{"titulo":"...","texto":"..."}]}
Não invente certificações, números, garantias, endereço ou avaliações. Escreva de forma persuasiva, natural e específica para o segmento.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_TEXT_MODEL?.trim() || "gpt-4.1-mini", input: prompt }),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok) return NextResponse.json({ error: apiError(payload, response.status) }, { status: response.status });

    const raw = extractText(payload);
    if (!raw) return NextResponse.json({ error: "A IA não devolveu conteúdo." }, { status: 502 });
    let generated: GeneratedSite;
    try { generated = JSON.parse(cleanJson(raw)); }
    catch { return NextResponse.json({ error: "A IA devolveu um formato inválido. Tente novamente." }, { status: 502 }); }

    if (!generated.etiqueta || !generated.titulo || !generated.subtitulo || !generated.ctaPrimario || !generated.ctaSecundario || !isSectionArray(generated.servicos) || !isSectionArray(generated.beneficios)) {
      return NextResponse.json({ error: "O conteúdo gerado ficou incompleto. Tente novamente." }, { status: 502 });
    }
    return NextResponse.json({ content: generated });
  } catch (error) {
    console.error("Site AI route error", error);
    return NextResponse.json({ error: "Falha interna ao criar o site com IA." }, { status: 500 });
  }
}
