"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type CreditWallet = {
  plan?: "free" | "professional" | "agency";
  credits?: number;
  totalReceived?: number;
  totalUsed?: number;
};

type CreditsApiResponse = CreditWallet & {
  error?: string;
  code?: string;
};

const actions = [
  [
    "Criar site com IA",
    "Descreva seu negócio e receba um site completo.",
    "/dashboard/novo-site",
    "✦",
  ],
  [
    "Criar identidade visual",
    "Gere logos, cores e tipografia para sua marca.",
    "/dashboard/logos",
    "◈",
  ],
  [
    "Criar banner profissional",
    "Artes prontas para anúncios e redes sociais.",
    "/dashboard/banners",
    "▤",
  ],
] as const;

function planLabel(plan?: CreditWallet["plan"]) {
  if (plan === "professional") return "Profissional";
  if (plan === "agency") return "Agência";
  return "Gratuito";
}

async function readApiResponse(
  response: Response,
): Promise<CreditsApiResponse> {
  const contentType =
    response.headers.get("content-type") || "";

  const raw = await response.text();

  if (!raw.trim()) {
    throw new Error(
      `A API de créditos respondeu vazia (status ${response.status}).`,
    );
  }

  if (!contentType.includes("application/json")) {
    console.error("Resposta inesperada em /api/credits", {
      status: response.status,
      contentType,
      preview: raw.slice(0, 500),
    });

    if (
      raw.includes("<!DOCTYPE") ||
      raw.includes("<html")
    ) {
      throw new Error(
        `A rota /api/credits devolveu uma página HTML em vez de JSON (status ${response.status}). Verifique os logs do Vercel e possíveis redirecionamentos.`,
      );
    }

    throw new Error(
      `A rota /api/credits devolveu um formato inválido (status ${response.status}).`,
    );
  }

  try {
    return JSON.parse(raw) as CreditsApiResponse;
  } catch {
    console.error("JSON inválido em /api/credits", {
      status: response.status,
      preview: raw.slice(0, 500),
    });

    throw new Error(
      "A API de créditos devolveu um JSON inválido.",
    );
  }
}

export default function DashboardPage() {
  const { user } = useAuth();

  const [wallet, setWallet] =
    useState<CreditWallet | null>(null);
  const [creditsLoading, setCreditsLoading] =
    useState(true);
  const [creditsError, setCreditsError] =
    useState("");
  const [reloadCredits, setReloadCredits] =
    useState(0);

  const name = useMemo(
    () =>
      (user?.displayName || user?.email || "Victor")
        .split(/[ @]/)[0],
    [user],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadCredits() {
      if (!user) {
        setWallet(null);
        setCreditsLoading(false);
        setCreditsError("");
        return;
      }

      setCreditsLoading(true);
      setCreditsError("");

      try {
        /*
         * true força a renovação do token.
         * Isso evita usar um token expirado após login antigo.
         */
        const token = await user.getIdToken(true);

        const response = await fetch("/api/credits", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
          cache: "no-store",
        });

        const data = await readApiResponse(response);

        if (!response.ok) {
          throw new Error(
            data.error ||
              `Não foi possível carregar os créditos (status ${response.status}).`,
          );
        }

        if (!cancelled) {
          setWallet({
            plan: data.plan || "free",
            credits: Number(data.credits || 0),
            totalReceived: Number(
              data.totalReceived || 0,
            ),
            totalUsed: Number(data.totalUsed || 0),
          });
        }
      } catch (error) {
        console.error("Erro ao carregar créditos:", error);

        if (!cancelled) {
          setWallet(null);
          setCreditsError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os créditos.",
          );
        }
      } finally {
        if (!cancelled) {
          setCreditsLoading(false);
        }
      }
    }

    void loadCredits();

    return () => {
      cancelled = true;
    };
  }, [user, reloadCredits]);

  const creditsText = creditsLoading
    ? "..."
    : creditsError
      ? "—"
      : String(wallet?.credits ?? 0);

  const stats = [
    ["Sites publicados", "0", "+0% este mês"],
    ["Visualizações", "0", "Últimos 30 dias"],
    ["Leads capturados", "0", "Últimos 30 dias"],
    [
      "Créditos de IA",
      creditsText,
      creditsError
        ? "Erro ao carregar saldo"
        : `Plano ${planLabel(wallet?.plan)}`,
    ],
  ];

  return (
    <>
      <header className="premium-top">
        <div>
          <small>VISÃO GERAL</small>
          <h1>Bom dia, {name}.</h1>
          <p>O que vamos criar hoje?</p>
        </div>

        <div className="top-actions">
          <button
            className="icon-button"
            type="button"
            aria-label="Pesquisar"
          >
            ⌕
          </button>

          <button
            className="icon-button"
            type="button"
            aria-label="Notificações"
          >
            ◔
          </button>

          <Link
            className="premium-primary"
            href="/dashboard/novo-site"
          >
            ✦ Novo projeto
          </Link>
        </div>
      </header>

      <div className="premium-content">
        <section className="ai-hero">
          <div>
            <span className="spark-pill">
              ✦ CRIAÇÃO INTELIGENTE
            </span>

            <h2>
              Transforme uma ideia em uma marca completa.
            </h2>

            <p>
              Crie site, logo, textos, SEO e materiais de
              divulgação em poucos minutos, mantendo tudo
              consistente.
            </p>

            <div>
              <Link
                className="white-button"
                href="/dashboard/novo-site"
              >
                Começar com a IA <b>→</b>
              </Link>

              <Link
                className="ghost-button"
                href="/dashboard/templates"
              >
                Explorar templates
              </Link>
            </div>

            <small>
              Não precisa saber programar ou design.
            </small>
          </div>

          <div className="ai-orbit">
            <span className="orbit-main">PF</span>
            <i className="orbit o1">WEB</i>
            <i className="orbit o2">LOGO</i>
            <i className="orbit o3">SEO</i>
            <i className="orbit o4">ADS</i>
          </div>
        </section>

        <section className="quick-grid">
          {actions.map(
            ([title, description, href, icon]) => (
              <Link
                href={href}
                className="quick-card"
                key={title}
              >
                <span>{icon}</span>

                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>

                <b>↗</b>
              </Link>
            ),
          )}
        </section>

        <section className="stats-grid">
          {stats.map(([label, value, detail]) => (
            <article key={label}>
              <div>
                <small>{label}</small>
                <b>•••</b>
              </div>

              <strong>{value}</strong>
              <p>{detail}</p>
            </article>
          ))}
        </section>

        {creditsError && (
          <section className="credits-error" role="alert">
            <div>
              <strong>
                Não foi possível carregar os créditos
              </strong>

              <p>{creditsError}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                setReloadCredits((value) => value + 1)
              }
              disabled={creditsLoading}
            >
              {creditsLoading
                ? "Carregando..."
                : "Tentar novamente"}
            </button>
          </section>
        )}

        <section className="dashboard-columns">
          <article className="project-panel">
            <div className="panel-title">
              <div>
                <small>PROJETOS RECENTES</small>
                <h2>Seus sites</h2>
              </div>

              <Link href="/dashboard/sites">
                Ver todos →
              </Link>
            </div>

            <div className="empty-premium">
              <div className="empty-art">
                <span>＋</span>
                <i />
                <i />
              </div>

              <h3>Seu próximo projeto começa aqui</h3>

              <p>
                Crie um site profissional completo usando
                nossa inteligência artificial.
              </p>

              <Link
                href="/dashboard/novo-site"
                className="premium-primary"
              >
                ✦ Criar primeiro site
              </Link>
            </div>
          </article>

          <aside className="activity-panel">
            <div className="panel-title">
              <div>
                <small>PRIMEIROS PASSOS</small>
                <h2>Prepare sua conta</h2>
              </div>

              <span>0%</span>
            </div>

            {[
              ["01", "Crie seu primeiro site"],
              ["02", "Defina sua identidade visual"],
              ["03", "Conecte seu domínio"],
              ["04", "Publique e acompanhe"],
            ].map(([number, title]) => (
              <div className="step-row" key={number}>
                <span>{number}</span>

                <div>
                  <strong>{title}</strong>
                  <small>Concluir etapa</small>
                </div>

                <b>›</b>
              </div>
            ))}
          </aside>
        </section>
      </div>

      <style jsx>{`
        .credits-error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
          padding: 16px 18px;
          border: 1px solid #fecaca;
          border-radius: 14px;
          background: #fff1f2;
          color: #b42318;
        }

        .credits-error strong,
        .credits-error p {
          display: block;
        }

        .credits-error strong {
          font-size: 13px;
        }

        .credits-error p {
          margin: 5px 0 0;
          font-size: 12px;
          line-height: 1.5;
        }

        .credits-error button {
          flex: 0 0 auto;
          min-height: 38px;
          padding: 0 13px;
          border: 0;
          border-radius: 9px;
          color: #ffffff;
          background: #b42318;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .credits-error button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 680px) {
          .credits-error {
            align-items: stretch;
            flex-direction: column;
          }

          .credits-error button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}