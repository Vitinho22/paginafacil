"use client";

import type { TemplateDefinition } from "@/lib/templates";

type Props = {
  template: TemplateDefinition;
  selected?: boolean;
  onSelect?: () => void;
};

export default function TemplatePreviewCard({
  template,
  selected = false,
  onSelect,
}: Props) {
  const previewImage = template.previewImage?.trim();

  return (
    <button
      type="button"
      className={`template-preview-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Selecionar template ${template.nome}`}
    >
      <div className="preview-browser">
        <div className="preview-browser-bar">
          <div className="preview-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <div className="preview-address">
            <span className="preview-lock">●</span>
            <span>{template.nome.toLowerCase().replace(/\s+/g, "")}.com.br</span>
          </div>

          <div className="preview-browser-icons" aria-hidden="true">
            <i />
            <i />
          </div>
        </div>

        <div
          className="preview-site"
          style={{
            backgroundColor: template.corFundo,
            color: template.corTexto,
          }}
        >
          {previewImage ? (
            <>
              <img
                src={previewImage}
                alt=""
                className="preview-background"
                loading="lazy"
              />
              <div className="preview-shade" />
            </>
          ) : (
            <div className="preview-fallback">
              <div
                className="fallback-orb fallback-one"
                style={{ background: template.cor }}
              />
              <div
                className="fallback-orb fallback-two"
                style={{ background: template.corSecundaria }}
              />
            </div>
          )}

          <header className="preview-nav">
            <div className="preview-brand">
              <span
                className="preview-brand-mark"
                style={{ background: template.cor }}
              >
                {template.nome.charAt(0)}
              </span>
              <strong>{template.nome}</strong>
            </div>

            <nav aria-hidden="true">
              <span>Início</span>
              <span>Serviços</span>
              <span>Sobre</span>
            </nav>

            <span
              className="preview-nav-button"
              style={{ background: template.cor }}
            >
              Contato
            </span>
          </header>

          <div className="preview-hero">
            <span className="preview-kicker">
              {template.categoria}
            </span>

            <h3>{template.descricao}</h3>

            <p>{template.indicadoPara}</p>

            <div className="preview-actions" aria-hidden="true">
              <span
                className="preview-primary"
                style={{ background: template.cor }}
              >
                Conhecer
              </span>
              <span className="preview-secondary">Saiba mais</span>
            </div>
          </div>

          <div className="preview-bottom" aria-hidden="true">
            <div>
              <span>01</span>
              <strong>Design responsivo</strong>
            </div>
            <div>
              <span>02</span>
              <strong>SEO preparado</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Editor visual</strong>
            </div>
          </div>

          <div className="preview-hover">
            <span>Visualizar template</span>
          </div>

          {template.premium && (
            <span className="premium-badge">Premium</span>
          )}

          {selected && (
            <span className="selected-badge">
              <b>✓</b>
              Selecionado
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        .template-preview-card {
          width: 100%;
          display: block;
          padding: 0;
          border: 0;
          border-radius: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
          appearance: none;
        }

        .preview-browser {
          width: 100%;
          overflow: hidden;
          border-radius: 15px;
          border: 1px solid rgba(16, 24, 40, 0.1);
          background: #ffffff;
          box-shadow: 0 18px 50px rgba(16, 24, 40, 0.12);
          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease,
            border-color 0.28s ease;
        }

        .template-preview-card:hover .preview-browser,
        .template-preview-card.selected .preview-browser {
          transform: translateY(-4px);
          border-color: ${template.cor};
          box-shadow: 0 28px 65px rgba(16, 24, 40, 0.18);
        }

        .preview-browser-bar {
          height: 34px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 12px;
          border-bottom: 1px solid #e9edf2;
          background: rgba(255, 255, 255, 0.96);
        }

        .preview-dots,
        .preview-browser-icons {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .preview-dots i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #cdd3dc;
        }

        .preview-browser-icons {
          justify-self: end;
        }

        .preview-browser-icons i {
          width: 11px;
          height: 11px;
          border: 1px solid #d8dde5;
          border-radius: 3px;
        }

        .preview-address {
          min-width: 150px;
          height: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0 12px;
          border-radius: 999px;
          color: #8b94a3;
          background: #f3f5f8;
          font-size: 7px;
          font-weight: 700;
        }

        .preview-lock {
          color: #52b788;
          font-size: 5px;
        }

        .preview-site {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          min-height: 0;
          overflow: hidden;
          isolation: isolate;
        }

        .preview-background,
        .preview-shade,
        .preview-fallback {
          position: absolute;
          inset: 0;
        }

        .preview-background {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.01);
          transition: transform 0.55s ease;
        }

        .template-preview-card:hover .preview-background {
          transform: scale(1.07);
        }

        .preview-shade {
          z-index: 1;
          background:
            linear-gradient(
              90deg,
              rgba(9, 13, 18, 0.84) 0%,
              rgba(9, 13, 18, 0.58) 48%,
              rgba(9, 13, 18, 0.16) 100%
            ),
            linear-gradient(
              180deg,
              rgba(9, 13, 18, 0.04),
              rgba(9, 13, 18, 0.38)
            );
        }

        .preview-fallback {
          overflow: hidden;
          background:
            linear-gradient(145deg, ${template.corFundo}, #ffffff);
        }

        .fallback-orb {
          position: absolute;
          width: 58%;
          aspect-ratio: 1;
          border-radius: 50%;
          filter: blur(42px);
          opacity: 0.3;
        }

        .fallback-one {
          left: -15%;
          top: -35%;
        }

        .fallback-two {
          right: -20%;
          bottom: -40%;
        }

        .preview-nav {
          position: relative;
          z-index: 3;
          height: 58px;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
        }

        .preview-brand {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preview-brand-mark {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 8px;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
        }

        .preview-brand strong {
          overflow: hidden;
          max-width: 110px;
          font-size: 10px;
          line-height: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-nav nav {
          display: flex;
          gap: 12px;
          margin-left: auto;
          font-size: 7px;
          color: rgba(255, 255, 255, 0.8);
        }

        .preview-nav-button {
          min-height: 27px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          border-radius: 999px;
          color: #ffffff;
          font-size: 7px;
          font-weight: 850;
        }

        .preview-hero {
          position: relative;
          z-index: 3;
          width: min(65%, 430px);
          padding: 34px 22px 22px;
          color: #ffffff;
        }

        .preview-kicker {
          display: inline-flex;
          align-items: center;
          min-height: 20px;
          padding: 0 8px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .preview-hero h3 {
          display: -webkit-box;
          overflow: hidden;
          margin: 12px 0 8px;
          font-size: clamp(17px, 2.3vw, 28px);
          line-height: 1.02;
          letter-spacing: -0.04em;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .preview-hero p {
          display: -webkit-box;
          overflow: hidden;
          max-width: 360px;
          margin: 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 7px;
          line-height: 1.5;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .preview-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
        }

        .preview-actions span {
          min-height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 11px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 850;
        }

        .preview-primary {
          color: #ffffff;
        }

        .preview-secondary {
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .preview-bottom {
          position: absolute;
          z-index: 3;
          right: 16px;
          bottom: 14px;
          left: 16px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .preview-bottom div {
          min-width: 0;
          padding: 9px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9px;
          background: rgba(13, 18, 24, 0.42);
          backdrop-filter: blur(12px);
          color: #ffffff;
        }

        .preview-bottom span,
        .preview-bottom strong {
          display: block;
        }

        .preview-bottom span {
          margin-bottom: 3px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 5px;
        }

        .preview-bottom strong {
          overflow: hidden;
          font-size: 6px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-hover {
          position: absolute;
          z-index: 7;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0;
          background: rgba(8, 12, 17, 0.68);
          backdrop-filter: blur(4px);
          transition: opacity 0.24s ease;
        }

        .preview-hover span {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          font-size: 8px;
          font-weight: 850;
        }

        .template-preview-card:hover .preview-hover {
          opacity: 1;
        }

        .premium-badge,
        .selected-badge {
          position: absolute;
          z-index: 8;
          top: 12px;
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          border-radius: 999px;
          box-shadow: 0 10px 28px rgba(16, 24, 40, 0.16);
          font-size: 7px;
          font-weight: 900;
        }

        .premium-badge {
          left: 12px;
          padding: 0 10px;
          color: #513c06;
          background: #f8d66d;
        }

        .selected-badge {
          right: 12px;
          gap: 6px;
          padding: 0 10px 0 6px;
          color: #075c3e;
          background: #e9fbf3;
        }

        .selected-badge b {
          width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #ffffff;
          background: #18a66b;
          font-size: 8px;
        }

        @media (max-width: 620px) {
          .preview-nav nav,
          .preview-nav-button {
            display: none;
          }

          .preview-hero {
            width: 78%;
          }

          .preview-bottom {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .preview-browser,
          .preview-background,
          .preview-hover {
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}