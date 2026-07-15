"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const actions = [
  ["Criar site com IA", "Descreva seu negócio e receba um site completo.", "/dashboard/novo-site", "✦"],
  ["Criar identidade visual", "Gere logos, cores e tipografia para sua marca.", "/dashboard/logos", "◈"],
  ["Criar banner profissional", "Artes prontas para anúncios e redes sociais.", "/dashboard/banners", "▤"],
] as const;

export default function DashboardHomeClient() {
  const { user } = useAuth();
  const name = (user?.displayName || "Olá").split(" ")[0];

  return (
    <>
      <header className="premium-top">
        <div>
          <small>VISÃO GERAL</small>
          <h1>{name === "Olá" ? "Olá!" : `Olá, ${name}.`}</h1>
          <p>O que vamos criar hoje?</p>
        </div>
        <div className="top-actions">
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
          <div className="ai-orbit" aria-hidden="true">
            <span className="orbit-main">PF</span>
            <i className="orbit o1">WEB</i><i className="orbit o2">LOGO</i><i className="orbit o3">SEO</i><i className="orbit o4">ADS</i>
          </div>
        </section>

        <section className="quick-grid">
          {actions.map(([title, description, href, icon]) => (
            <Link href={href} className="quick-card" key={title}>
              <span>{icon}</span><div><h3>{title}</h3><p>{description}</p></div><b>↗</b>
            </Link>
          ))}
        </section>

        <section className="stats-grid">
          {[["Sites publicados", "0", "Comece criando seu site"], ["Visualizações", "0", "Últimos 30 dias"], ["Leads capturados", "0", "Últimos 30 dias"], ["Créditos de IA", "25", "Plano atual"]].map(([a,b,c]) => (
            <article key={a}><div><small>{a}</small></div><strong>{b}</strong><p>{c}</p></article>
          ))}
        </section>

        <section className="dashboard-columns">
          <article className="project-panel">
            <div className="panel-title"><div><small>PROJETOS RECENTES</small><h2>Seus sites</h2></div><Link href="/dashboard/sites">Ver todos →</Link></div>
            <div className="empty-premium">
              <div className="empty-art"><span>＋</span><i></i><i></i></div>
              <h3>Seu próximo projeto começa aqui</h3>
              <p>Crie um site profissional completo usando nossa inteligência artificial.</p>
              <Link href="/dashboard/novo-site" className="premium-primary">✦ Criar primeiro site</Link>
            </div>
          </article>
          <aside className="activity-panel">
            <div className="panel-title"><div><small>PRIMEIROS PASSOS</small><h2>Prepare sua conta</h2></div><span>0%</span></div>
            {[["01","Crie seu primeiro site"],["02","Defina sua identidade visual"],["03","Conecte seu domínio"],["04","Publique e acompanhe"]].map(([n,t]) => (
              <div className="step-row" key={n}><span>{n}</span><div><strong>{t}</strong><small>Concluir etapa</small></div><b>›</b></div>
            ))}
          </aside>
        </section>
      </div>
    </>
  );
}
