"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Site } from "@/types/site";

type Props = { site: Site; editing?: boolean };

type IconName = "arrow" | "check" | "spark" | "phone" | "star";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
    phone: <path d="M8.2 3.7 10 7.8 7.8 9.1c1.1 2.3 2.8 4 5.1 5.1l1.3-2.2 4.1 1.8-.8 4.2c-.2.9-1 1.5-1.9 1.5C9.5 19.5 4.5 14.5 4.5 8.4c0-.9.6-1.7 1.5-1.9l2.2-.8Z"/>,
    star: <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9L12 3Z"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function WhatsappButton({ site, secondary = false }: { site: Site; secondary?: boolean }) {
  const href = site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` : "#contato";
  return (
    <a href={href} className={`template-button ${secondary ? "is-secondary" : ""}`} style={secondary ? undefined : { background: site.cor }}>
      {secondary ? site.ctaSecundario : site.ctaPrimario}
      {!secondary && <Icon name="arrow" />}
    </a>
  );
}

export default function TemplateRenderer({ site, editing = false }: Props) {
  const surface = site.corFundo || "#F6F8FC";
  const initials = site.nome.trim().slice(0, 2).toUpperCase() || "PF";

  return (
    <div className={`professional-template template-${site.templateId}`} style={{ background: surface, "--brand": site.cor } as CSSProperties}>
      <div className="template-announcement">
        <span><Icon name="spark" /> Atendimento profissional e personalizado</span>
        <span>{site.cidade || "Atendimento online"}</span>
      </div>

      <header className="template-header">
        <a className="template-brand" href="#inicio" aria-label={site.nome}>
          <span className="template-logo" style={{ background: site.cor }}>{initials}</span>
          <div><strong>{site.nome}</strong><span>{site.segmento}</span></div>
        </a>
        <nav className="template-nav" aria-label="Navegação">
          <a href="#servicos">Serviços</a><a href="#beneficios">Diferenciais</a><a href="#processo">Processo</a><a href="#contato">Contato</a>
        </nav>
        <WhatsappButton site={site} />
      </header>

      <main id="inicio">
        <section className="template-hero">
          <div className="template-hero-orb" />
          <div className="template-copy">
            <span className="template-eyebrow"><i style={{ background: site.cor }} />{site.etiqueta}</span>
            <h1>{site.titulo}</h1>
            <p>{site.subtitulo}</p>
            <div className="template-actions"><WhatsappButton site={site} /><WhatsappButton site={site} secondary /></div>
            <div className="template-trust">
              {["Resposta rápida", "Atendimento humano", "Experiência completa"].map((text) => <div key={text}><Icon name="check" /><span>{text}</span></div>)}
            </div>
          </div>

          <div className="template-visual-wrap">
            <div className="template-visual">
              <div className="visual-image">
                <div className="visual-monogram" style={{ color: site.cor }}>{initials}</div>
                <div className="visual-caption"><small>{site.segmento}</small><strong>{site.nome}</strong><span>{site.cidade || "Atendimento com excelência"}</span></div>
              </div>
              <div className="visual-rating"><div><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /></div><strong>Excelência em cada detalhe</strong><span>Uma experiência pensada para o cliente</span></div>
            </div>
            <div className="floating-card floating-card-one"><span style={{ background: site.cor }}><Icon name="phone" /></span><div><small>CONTATO DIRETO</small><strong>Fale com nossa equipe</strong></div></div>
            <div className="floating-card floating-card-two"><small>PROPOSTA</small><strong>Clara, moderna e profissional.</strong></div>
          </div>
        </section>

        <section className="template-logo-strip">
          <span>Uma presença digital que comunica</span>
          {["Confiança", "Qualidade", "Clareza", "Resultado"].map((item) => <strong key={item}>{item}</strong>)}
        </section>

        <section id="servicos" className="template-section">
          <div className="template-section-heading">
            <div><span>O que fazemos</span><h2>Soluções apresentadas com clareza e personalidade.</h2></div>
            <p>Uma estrutura visual sólida para valorizar sua marca, facilitar a decisão e transformar interesse em contato.</p>
          </div>
          <div className="template-card-grid">
            {site.servicos.map((item, index) => (
              <article key={`${item.titulo}-${index}`} className="template-card">
                <div className="template-card-icon" style={{ color: site.cor }}><span>0{index + 1}</span><Icon name="arrow" /></div>
                <h3>{item.titulo}</h3><p>{item.texto}</p><a href="#contato">Saiba mais <Icon name="arrow" /></a>
              </article>
            ))}
          </div>
        </section>

        <section id="beneficios" className="template-feature">
          <div className="feature-panel" style={{ background: site.cor }}>
            <span>Por que escolher {site.nome}</span><h2>Profissionalismo que o cliente percebe antes mesmo do primeiro contato.</h2>
            <p>Comunicação consistente, atendimento próximo e uma apresentação à altura da qualidade do seu trabalho.</p>
            <div className="feature-stat"><strong>100%</strong><span>foco em uma experiência clara, segura e memorável</span></div>
          </div>
          <div className="feature-list">
            {site.beneficios.map((item, index) => <article key={`${item.titulo}-${index}`}><span>0{index + 1}</span><div><h3>{item.titulo}</h3><p>{item.texto}</p></div></article>)}
          </div>
        </section>

        <section id="processo" className="template-process">
          <div className="template-section-heading centered"><div><span>Como funciona</span><h2>Uma jornada simples do primeiro contato até a solução.</h2></div></div>
          <div className="process-grid">
            {[['01','Conversa inicial','Entendemos sua necessidade e o resultado esperado.'],['02','Direção ideal','Organizamos a melhor solução para o seu momento.'],['03','Execução cuidadosa','Cada etapa é conduzida com clareza e atenção.'],['04','Entrega e suporte','Você recebe orientação para seguir com segurança.']].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section id="contato" className="template-cta">
          <div><span>Pronto para começar?</span><h2>Vamos transformar sua necessidade em uma solução profissional.</h2><p>Converse com nossa equipe, tire suas dúvidas e descubra o melhor caminho para o seu projeto.</p></div>
          <div className="template-cta-action"><WhatsappButton site={site} /><small>Atendimento rápido e sem compromisso</small></div>
        </section>
      </main>

      <footer className="template-footer">
        <div className="template-brand"><span className="template-logo" style={{ background: site.cor }}>{initials}</span><div><strong>{site.nome}</strong><span>{site.cidade || "Atendimento online e presencial"}</span></div></div>
        <div className="footer-links"><a href="#servicos">Serviços</a><a href="#beneficios">Diferenciais</a><a href="#contato">Contato</a></div>
        <span>{editing ? "Prévia do projeto" : `© ${new Date().getFullYear()} ${site.nome}. Todos os direitos reservados.`}</span>
      </footer>
    </div>
  );
}
