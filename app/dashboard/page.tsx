"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type CreditWallet = {
  plan?: "free" | "professional" | "agency";
  credits?: number;
  totalReceived?: number;
  totalUsed?: number;
};

const actions = [
  ["Criar site com IA", "Descreva seu negócio e receba um site completo.", "/dashboard/novo-site", "✦"],
  ["Criar identidade visual", "Gere logos, cores e tipografia para sua marca.", "/dashboard/logos", "◈"],
  ["Criar banner profissional", "Artes prontas para anúncios e redes sociais.", "/dashboard/banners", "▤"],
] as const;

function planLabel(plan?: CreditWallet["plan"]) {
  if (plan === "professional") return "Profissional";
  if (plan === "agency") return "Agência";
  return "Gratuito";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<CreditWallet | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [creditsError, setCreditsError] = useState("");

  const name = (user?.displayName || "Victor").split(" ")[0];

  useEffect(() => {
    let cancelled = false;

    async function loadCredits() {
      if (!user) {
        setWallet(null);
        setCreditsLoading(false);
        return;
      }

      setCreditsLoading(true);
      setCreditsError("");

      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/credits", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = (await response.json()) as CreditWallet & { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Não foi possível carregar os créditos.");
        }

        if (!cancelled) setWallet(data);
      } catch (error) {
        if (!cancelled) {
          setCreditsError(
            error instanceof Error ? error.message : "Não foi possível carregar os créditos.",
          );
        }
      } finally {
        if (!cancelled) setCreditsLoading(false);
      }
    }

    loadCredits();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const creditsText = creditsLoading ? "..." : creditsError ? "—" : String(wallet?.credits ?? 0);

  const stats = [
    ["Sites publicados", "0", "+0% este mês"],
    ["Visualizações", "0", "Últimos 30 dias"],
    ["Leads capturados", "0", "Últimos 30 dias"],
    ["Créditos de IA", creditsText, creditsError ? "Erro ao carregar saldo" : `Plano ${planLabel(wallet?.plan)}`],
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
          <button className="icon-button" type="button" aria-label="Pesquisar">⌕</button>
          <button className="icon-button" type="button" aria-label="Notificações">◔</button>
          <Link className="premium-primary" href="/dashboard/novo-site">✦ Novo projeto</Link>
        </div>
      </header>

      <div className="premium-content">
        <section className="ai-hero">
          <div>
            <span className="spark-pill">✦ CRIAÇÃO INTELIGENTE</span>
            <h2>Transforme uma ideia em uma marca completa.</h2>
            <p>Crie site, logo, textos, SEO e materiais de divulgação em poucos minutos, mantendo tudo consistente.</p>
            <div>
              <Link className="white-button" href="/dashboard/novo-site">Começar com a IA <b>→</b></Link>
              <Link className="ghost-button" href="/dashboard/templates">Explorar templates</Link>
            </div>
            <small>Não precisa saber programar ou design.</small>
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
          {actions.map(([title, description, href, icon]) => (
            <Link href={href} className="quick-card" key={title}>
              <span>{icon}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
              <b>↗</b>
            </Link>
          ))}
        </section>

        <section className="stats-grid">
          {stats.map(([label, value, detail]) => (
            <article key={label}>
              <div><small>{label}</small><b>•••</b></div>
              <strong>{value}</strong>
              <p>{detail}</p>
            </article>
          ))}
        </section>

        {creditsError && (
          <div style={{ marginBottom: 20, padding: "12px 14px", border: "1px solid #fecaca", borderRadius: 12, background: "#fff1f2", color: "#b42318", fontSize: 13 }}>
            {creditsError}
          </div>
        )}

        <section className="dashboard-columns">
          <article className="project-panel">
            <div className="panel-title">
              <div><small>PROJETOS RECENTES</small><h2>Seus sites</h2></div>
              <Link href="/dashboard/sites">Ver todos →</Link>
            </div>
            <div className="empty-premium">
              <div className="empty-art"><span>＋</span><i /><i /></div>
              <h3>Seu próximo projeto começa aqui</h3>
              <p>Crie um site profissional completo usando nossa inteligência artificial.</p>
              <Link href="/dashboard/novo-site" className="premium-primary">✦ Criar primeiro site</Link>
            </div>
          </article>

          <aside className="activity-panel">
            <div className="panel-title">
              <div><small>PRIMEIROS PASSOS</small><h2>Prepare sua conta</h2></div>
              <span>0%</span>
            </div>
            {[["01", "Crie seu primeiro site"], ["02", "Defina sua identidade visual"], ["03", "Conecte seu domínio"], ["04", "Publique e acompanhe"]].map(([number, title]) => (
              <div className="step-row" key={number}>
                <span>{number}</span>
                <div><strong>{title}</strong><small>Concluir etapa</small></div>
                <b>›</b>
              </div>
            ))}
          </aside>
        </section>
      </div>
    </>
  );
}