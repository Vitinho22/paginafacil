import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

type SiteSection = {
  titulo: string;
  texto: string;
};

type GeneratedSite = {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  ctaPrimario: string;
  ctaSecundario: string;
  servicos: SiteSection[];
  beneficios: SiteSection[];
};

type RequestBody = {
  nome?: string;
  segmento?: string;
  cidade?: string;
  estilo?: string;
  descricaoInicial?: string;
  templateId?: string;
};

type OpenAIErrorPayload = {
  error?: {
    message?: string;
    type?: string;
    code?: string | null;
  };
};

type OpenAIResponsePayload = {
  id?: string;
  status?: string;
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
      refusal?: string;
    }>;
  }>;
  error?: {
    message?: string;
    code?: string;
  } | null;
  incomplete_details?: {
    reason?: string;
  } | null;
};

const SITE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    etiqueta: { type: "string", minLength: 3, maxLength: 90 },
    titulo: { type: "string", minLength: 8, maxLength: 150 },
    subtitulo: { type: "string", minLength: 20, maxLength: 320 },
    ctaPrimario: { type: "string", minLength: 2, maxLength: 40 },
    ctaSecundario: { type: "string", minLength: 2, maxLength: 40 },
    servicos: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          titulo: { type: "string", minLength: 3, maxLength: 70 },
          texto: { type: "string", minLength: 15, maxLength: 220 },
        },
        required: ["titulo", "texto"],
      },
    },
    beneficios: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          titulo: { type: "string", minLength: 3, maxLength: 70 },
          texto: { type: "string", minLength: 15, maxLength: 220 },
        },
        required: ["titulo", "texto"],
      },
    },
  },
  required: [
    "etiqueta",
    "titulo",
    "subtitulo",
    "ctaPrimario",
    "ctaSecundario",
    "servicos",
    "beneficios",
  ],
} as const;

function jsonError(message: string, status: number, details?: string) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

function normalizeSecret(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "").trim();
}

function apiError(
  payload: OpenAIErrorPayload | null,
  status: number,
): string {
  const message = payload?.error?.message?.trim();

  if (status === 400) {
    return message
      ? `A API recusou a solicitação: ${message}`
      : "A API recusou os dados enviados.";
  }

  if (status === 401) {
    return "A chave da IA é inválida ou foi revogada. Atualize OPENAI_API_KEY no Vercel.";
  }

  if (status === 403) {
    return "A conta não tem permissão para usar o modelo configurado.";
  }

  if (status === 404) {
    return "O modelo configurado não foi encontrado. Verifique OPENAI_TEXT_MODEL.";
  }

  if (status === 429) {
    return "A conta da API atingiu o limite ou está sem saldo disponível.";
  }

  if (status >= 500) {
    return "O serviço de IA está temporariamente indisponível. Tente novamente.";
  }

  return message || "A IA não conseguiu criar o conteúdo do site.";
}

function extractText(payload: OpenAIResponsePayload): string {
  if (
    typeof payload.output_text === "string" &&
    payload.output_text.trim()
  ) {
    return payload.output_text.trim();
  }

  for (const item of payload.output ?? []) {
    for (const part of item.content ?? []) {
      if (typeof part.text === "string" && part.text.trim()) {
        return part.text.trim();
      }

      if (
        typeof part.refusal === "string" &&
        part.refusal.trim()
      ) {
        throw new Error(
          `A IA recusou a geração: ${part.refusal.trim()}`,
        );
      }
    }
  }

  return "";
}

function isSectionArray(value: unknown): value is SiteSection[] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as SiteSection).titulo === "string" &&
        (item as SiteSection).titulo.trim().length >= 3 &&
        typeof (item as SiteSection).texto === "string" &&
        (item as SiteSection).texto.trim().length >= 15,
    )
  );
}

function isGeneratedSite(value: unknown): value is GeneratedSite {
  if (!value || typeof value !== "object") {
    return false;
  }

  const site = value as GeneratedSite;

  return (
    typeof site.etiqueta === "string" &&
    site.etiqueta.trim().length >= 3 &&
    typeof site.titulo === "string" &&
    site.titulo.trim().length >= 8 &&
    typeof site.subtitulo === "string" &&
    site.subtitulo.trim().length >= 20 &&
    typeof site.ctaPrimario === "string" &&
    site.ctaPrimario.trim().length >= 2 &&
    typeof site.ctaSecundario === "string" &&
    site.ctaSecundario.trim().length >= 2 &&
    isSectionArray(site.servicos) &&
    isSectionArray(site.beneficios)
  );
}

async function readJsonSafely<T>(
  response: Response,
): Promise<{ data: T | null; raw: string }> {
  const raw = await response.text();

  if (!raw.trim()) {
    return { data: null, raw: "" };
  }

  try {
    return {
      data: JSON.parse(raw) as T,
      raw,
    };
  } catch {
    return {
      data: null,
      raw,
    };
  }
}

export async function POST(request: Request) {
  const requestStartedAt = Date.now();

  try {
    const apiKey = normalizeSecret(process.env.OPENAI_API_KEY);

    if (!apiKey) {
      return jsonError(
        "IA não configurada. Adicione OPENAI_API_KEY no Vercel e faça uma nova implantação.",
        503,
      );
    }

    let input: RequestBody;

    try {
      input = (await request.json()) as RequestBody;
    } catch {
      return jsonError(
        "Os dados enviados para criação do site são inválidos.",
        400,
      );
    }

    const nome = String(input.nome ?? "").trim();
    const segmento = String(input.segmento ?? "").trim();
    const cidade = String(input.cidade ?? "").trim();
    const estilo = String(input.estilo ?? "Moderno").trim();
    const descricaoInicial = String(
      input.descricaoInicial ?? "",
    ).trim();
    const templateId = String(input.templateId ?? "").trim();

    if (nome.length < 2) {
      return jsonError("Informe o nome do negócio.", 400);
    }

    if (segmento.length < 2) {
      return jsonError("Informe o segmento do negócio.", 400);
    }

    const model =
      normalizeSecret(process.env.OPENAI_TEXT_MODEL) ||
      "gpt-4.1-mini";

    const prompt = [
      "Crie o conteúdo comercial de um site profissional em português do Brasil.",
      "",
      `Nome do negócio: ${nome}`,
      `Segmento: ${segmento}`,
      `Cidade: ${cidade || "não informada"}`,
      `Estilo visual: ${estilo}`,
      `Template: ${templateId || "não informado"}`,
      `Objetivo do cliente: ${
        descricaoInicial ||
        "apresentar o negócio, transmitir confiança e gerar contatos"
      }`,
      "",
      "Regras:",
      "- Escreva como um redator profissional, com linguagem natural e específica para o segmento.",
      "- Evite frases genéricas sobre inteligência artificial.",
      "- Não invente certificações, números, garantias, endereço, avaliações ou tempo de mercado.",
      "- Os três serviços devem ser diferentes entre si.",
      "- Os três benefícios devem explicar vantagens reais para o cliente.",
      "- Os CTAs devem ser curtos e adequados ao segmento.",
    ].join("\n");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50_000);

    let response: Response;

    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          store: false,
          max_output_tokens: 1200,
          input: [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text:
                    "Você é um diretor de conteúdo para sites de pequenos negócios brasileiros. Gere textos profissionais, específicos, claros e comercialmente úteis.",
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: prompt,
                },
              ],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "paginafacil_site_content",
              description:
                "Conteúdo estruturado para um site profissional.",
              strict: true,
              schema: SITE_SCHEMA,
            },
          },
        }),
        cache: "no-store",
        signal: controller.signal,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        return jsonError(
          "A criação demorou mais que o esperado. Tente novamente.",
          504,
        );
      }

      console.error("OpenAI request failed", error);

      return jsonError(
        "Não foi possível conectar ao serviço de IA.",
        502,
      );
    } finally {
      clearTimeout(timeout);
    }

    const requestId =
      response.headers.get("x-request-id") || undefined;

    const { data, raw } =
      await readJsonSafely<
        OpenAIResponsePayload & OpenAIErrorPayload
      >(response);

    if (!response.ok) {
      console.error("OpenAI API error", {
        status: response.status,
        requestId,
        body: data ?? raw.slice(0, 800),
      });

      return NextResponse.json(
        {
          error: apiError(data, response.status),
          ...(requestId ? { requestId } : {}),
        },
        { status: response.status },
      );
    }

    if (!data) {
      console.error("OpenAI returned non-JSON", {
        requestId,
        body: raw.slice(0, 800),
      });

      return jsonError(
        "A IA respondeu em um formato inesperado.",
        502,
        requestId
          ? `Código da solicitação: ${requestId}`
          : undefined,
      );
    }

    if (data.status === "failed" || data.error) {
      console.error("OpenAI response failed", {
        requestId,
        error: data.error,
      });

      return jsonError(
        data.error?.message ||
          "A IA não conseguiu concluir a geração.",
        502,
      );
    }

    if (data.status === "incomplete") {
      console.error("OpenAI response incomplete", {
        requestId,
        reason: data.incomplete_details?.reason,
      });

      return jsonError(
        "A resposta da IA ficou incompleta. Tente novamente.",
        502,
      );
    }

    let rawGenerated: string;

    try {
      rawGenerated = extractText(data);
    } catch (error) {
      return jsonError(
        error instanceof Error
          ? error.message
          : "A IA recusou a geração.",
        422,
      );
    }

    if (!rawGenerated) {
      console.error("OpenAI returned no output text", {
        requestId,
        status: data.status,
        output: data.output,
      });

      return jsonError(
        "A IA não devolveu o conteúdo do site.",
        502,
      );
    }

    let generated: unknown;

    try {
      generated = JSON.parse(rawGenerated);
    } catch (error) {
      console.error("Generated JSON parsing failed", {
        requestId,
        rawGenerated: rawGenerated.slice(0, 1200),
        error,
      });

      return jsonError(
        "A IA devolveu um conteúdo que não pôde ser processado.",
        502,
      );
    }

    if (!isGeneratedSite(generated)) {
      console.error("Generated content validation failed", {
        requestId,
        generated,
      });

      return jsonError(
        "O conteúdo gerado ficou incompleto. Tente novamente.",
        502,
      );
    }

    console.info("Site AI generated", {
      requestId,
      model,
      durationMs: Date.now() - requestStartedAt,
    });

    return NextResponse.json(
      {
        content: generated,
        ...(requestId ? { requestId } : {}),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Site AI route unexpected error", error);

    return jsonError(
      "Falha interna ao criar o site com IA.",
      500,
    );
  }
}