"use client";

import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  criarConteudoInicial,
  escolherTemplate,
  encontrarTemplate,
} from "@/lib/templates";
import type { TemplateId } from "@/types/site";

const stages = [
  "Conectando à inteligência artificial",
  "Criando textos personalizados",
  "Montando a estrutura do site",
  "Salvando o projeto",
];

type SavedProject = {
  nome?: string;
  segmento?: string;
  cidade?: string;
  whatsapp?: string;
  instagram?: string;
  estilo?: string;
  descricaoInicial?: string;
  templateId?: TemplateId;
};

type AiResponse<T> = {
  content?: Partial<T>;
  error?: string;
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export default function GerandoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function run() {
      try {
        setError("");
        setIndex(0);

        const raw = localStorage.getItem("paginafacil_novo");

        if (!raw) {
          throw new Error(
            "Os dados do projeto não foram encontrados. Volte e preencha as informações do negócio.",
          );
        }

        let data: SavedProject;

        try {
          data = JSON.parse(raw) as SavedProject;
        } catch {
          throw new Error(
            "Os dados salvos estão inválidos. Volte e inicie a criação novamente.",
          );
        }

        const nome = data.nome?.trim();

        if (!nome) {
          throw new Error(
            "Informe o nome do negócio antes de criar o site.",
          );
        }

        const templateId = (
          data.templateId ||
          escolherTemplate(data.segmento || "")
        ) as TemplateId;

        const template = encontrarTemplate(templateId);

        /*
         * O assistente antigo não salvava o segmento.
         * Para não interromper a criação, usamos o segmento informado
         * ou uma descrição compatível com o template escolhido.
         */
        const segmento =
          data.segmento?.trim() ||
          template.tags?.[0] ||
          template.indicadoPara?.split(",")[0]?.trim() ||
          "Empresa";

        const cidade = data.cidade?.trim() || "";
        const estilo = data.estilo?.trim() || template.nome;
        const descricaoInicial =
          data.descricaoInicial?.trim() ||
          `${nome} é um negócio do segmento de ${segmento}${
            cidade ? ` com atendimento em ${cidade}` : ""
          }.`;

        const base = criarConteudoInicial({
          nome,
          segmento,
          cidade,
          estilo,
          templateId,
        });

        setIndex(0);

        const response = await fetch("/api/ai/site", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            segmento,
            cidade,
            estilo,
            descricaoInicial,
            templateId,
          }),
        });

        let payload: AiResponse<typeof base>;

        try {
          payload = (await response.json()) as AiResponse<typeof base>;
        } catch {
          throw new Error(
            "A API respondeu de forma inválida. Verifique a configuração da IA e tente novamente.",
          );
        }

        if (!response.ok) {
          throw new Error(
            payload.error ||
              `A criação falhou com o código ${response.status}.`,
          );
        }

        if (!payload.content) {
          throw new Error(
            payload.error ||
              "A inteligência artificial não retornou o conteúdo do site.",
          );
        }

        if (cancelled) return;

        setIndex(1);
        await wait(450);

        const content = {
          ...base,
          ...payload.content,
          nome,
          segmento,
          cidade,
          estilo,
          templateId,
          /*
           * Mantém as configurações visuais do template quando
           * a resposta da IA não trouxer esses campos.
           */
          cor: payload.content.cor || base.cor,
          corSecundaria:
            payload.content.corSecundaria || base.corSecundaria,
          corFundo: payload.content.corFundo || base.corFundo,
          corTexto: payload.content.corTexto || base.corTexto,
          imagemHero:
            payload.content.imagemHero || base.imagemHero,
          servicos:
            payload.content.servicos?.length
              ? payload.content.servicos
              : base.servicos,
          beneficios:
            payload.content.beneficios?.length
              ? payload.content.beneficios
              : base.beneficios,
        };

        setIndex(2);
        await wait(450);

        const now = new Date().toISOString();

        if (!user) {
          throw new Error("Usuário não autenticado.");
        }

        const sitePayload = {
          userId: user.uid,
          ...content,
          whatsapp: data.whatsapp?.trim() || "",
          instagram: data.instagram?.trim() || "",
          descricaoInicial,
          status: "rascunho" as const,
          criadoEm: now,
          atualizadoEm: now,
        };

        setIndex(3);

        const ref = await addDoc(
          collection(db, "sites"),
          sitePayload,
        );

        if (cancelled) return;

        localStorage.removeItem("paginafacil_novo");
        router.replace(`/dashboard/editor/${ref.id}`);
      } catch (err) {
        if (cancelled) return;

        console.error("Erro ao criar site:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível criar o projeto com IA.",
        );
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [user, router, retry]);

  return (
    <main className="shell generating-page light-workspace">
      <section className="card generating-card ai-generating-card">
        <span className="ai-orb">✦</span>

        <span className="smallcaps generating-label">
          IA REAL EM EXECUÇÃO
        </span>

        <h1 className="section-title">
          Criando seu site com inteligência artificial.
        </h1>

        <p className="muted">
          Estamos preparando textos, estrutura e identidade visual
          especialmente para o seu negócio.
        </p>

        <div className="generating-list">
          {stages.map((stage, stageIndex) => {
            const completed = stageIndex < index;
            const active = stageIndex === index && !error;

            return (
              <div
                key={stage}
                className={`${completed ? "complete" : ""} ${
                  active ? "active" : ""
                }`}
              >
                <strong>
                  {completed ? "✓" : stageIndex + 1}
                </strong>

                <span>{stage}</span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="ai-error-panel" role="alert">
            <strong>A criação parou</strong>
            <p>{error}</p>

            <div className="error-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setRetry((value) => value + 1)
                }
              >
                Tentar novamente
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  router.push("/dashboard/assistente")
                }
              >
                Revisar informações
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .generating-list > div.active {
            border-color: #8b75ff;
            background: #f7f4ff;
            box-shadow: 0 0 0 3px rgba(118, 87, 255, 0.08);
          }

          .generating-list > div.active strong {
            color: #6946ff;
            background: #ede9ff;
            animation: pulse 1.2s ease-in-out infinite;
          }

          .error-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 16px;
          }

          .btn-secondary {
            border: 1px solid #d0d5dd;
            color: #344054;
            background: #ffffff;
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(1.08);
              opacity: 0.72;
            }
          }
        `}</style>
      </section>
    </main>
  );
}