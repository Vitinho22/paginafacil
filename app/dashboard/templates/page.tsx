"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import TemplatePreviewCard from "@/components/TemplatePreviewCard";
import { templates } from "@/lib/templates";
import type { TemplateId } from "@/types/site";

type Category =
  | "Todos"
  | "Negócios"
  | "Restaurantes"
  | "Saúde"
  | "Portfólio"
  | "Vendas"
  | "Serviços";

type SortMode = "relevantes" | "nome" | "categoria";

const categories: Category[] = [
  "Todos",
  "Negócios",
  "Restaurantes",
  "Saúde",
  "Portfólio",
  "Vendas",
  "Serviços",
];

function templateText(template: (typeof templates)[number]) {
  return JSON.stringify(template).toLowerCase();
}

function getTemplateCategory(
  template: (typeof templates)[number],
): Category {
  const content = templateText(template);

  if (
    content.includes("restaurante") ||
    content.includes("café") ||
    content.includes("delivery") ||
    content.includes("sabor") ||
    content.includes("pizzaria")
  ) {
    return "Restaurantes";
  }

  if (
    content.includes("clínica") ||
    content.includes("saúde") ||
    content.includes("médico") ||
    content.includes("dentista") ||
    content.includes("norte")
  ) {
    return "Saúde";
  }

  if (
    content.includes("portfólio") ||
    content.includes("designer") ||
    content.includes("fotógrafo") ||
    content.includes("ateliê")
  ) {
    return "Portfólio";
  }

  if (
    content.includes("produto") ||
    content.includes("curso") ||
    content.includes("oferta") ||
    content.includes("conversão") ||
    content.includes("landing")
  ) {
    return "Vendas";
  }

  if (
    content.includes("serviço") ||
    content.includes("profissional") ||
    content.includes("empresa")
  ) {
    return "Serviços";
  }

  return "Negócios";
}

function getTemplateName(template: (typeof templates)[number]) {
  if ("name" in template && typeof template.name === "string") {
    return template.name;
  }

  if ("title" in template && typeof template.title === "string") {
    return template.title;
  }

  return String(template.id);
}

function scoreTemplate(
  template: (typeof templates)[number],
  query: string,
) {
  const content = templateText(template);
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2);

  return terms.reduce(
    (score, term) => score + (content.includes(term) ? 1 : 0),
    0,
  );
}

export default function TemplatesPage() {
  const router = useRouter();

  const [selected, setSelected] =
    useState<TemplateId>("corporativo");
  const [category, setCategory] = useState<Category>("Todos");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] =
    useState<SortMode>("relevantes");
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantActive, setAssistantActive] = useState(false);
  const [previewId, setPreviewId] =
    useState<TemplateId | null>(null);

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = templates.filter((template) => {
      const matchesCategory =
        category === "Todos" ||
        getTemplateCategory(template) === category;

      const matchesSearch =
        !query || templateText(template).includes(query);

      return matchesCategory && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortMode === "nome") {
        return getTemplateName(a).localeCompare(
          getTemplateName(b),
          "pt-BR",
        );
      }

      if (sortMode === "categoria") {
        return getTemplateCategory(a).localeCompare(
          getTemplateCategory(b),
          "pt-BR",
        );
      }

      return 0;
    });
  }, [category, search, sortMode]);

  const recommendedTemplates = useMemo(() => {
    const query = assistantQuery.trim();

    if (!assistantActive || query.length < 3) {
      return [];
    }

    return templates
      .map((template) => ({
        template,
        score: scoreTemplate(template, query),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.template);
  }, [assistantActive, assistantQuery]);

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (template) => template.id === selected,
      ),
    [selected],
  );

  const previewTemplate = useMemo(
    () =>
      templates.find(
        (template) => template.id === previewId,
      ),
    [previewId],
  );

  function usarTemplate(templateId = selected) {
    const existing = JSON.parse(
      localStorage.getItem("paginafacil_novo") || "{}",
    );

    localStorage.setItem(
      "paginafacil_novo",
      JSON.stringify({
        ...existing,
        templateId,
      }),
    );

    router.push("/dashboard/assistente");
  }

  return (
    <>
      <DashboardHeader title="Templates" />

      <main className="templates-marketplace">
        <section className="marketplace-intro">
          <div>
            <span className="eyebrow">
              BIBLIOTECA PROFISSIONAL
            </span>

            <h1>
              Encontre uma base forte para o seu próximo
              site.
            </h1>

            <p>
              Escolha um modelo, personalize com IA e
              publique sem começar do zero. Nada de
              mockups decorativos: aqui o foco está nos
              templates.
            </p>
          </div>

          <div className="intro-stats">
            <div>
              <strong>{templates.length}</strong>
              <span>templates ativos</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>responsivos</span>
            </div>

            <div>
              <strong>IA</strong>
              <span>personalização assistida</span>
            </div>
          </div>
        </section>

        <section className="ai-template-finder">
          <div className="finder-copy">
            <span>✦ RECOMENDAÇÃO INTELIGENTE</span>
            <h2>Descreva o seu negócio.</h2>
            <p>
              A plataforma identifica os modelos mais
              adequados para o seu projeto.
            </p>
          </div>

          <div className="finder-form">
            <input
              value={assistantQuery}
              onChange={(event) =>
                setAssistantQuery(event.target.value)
              }
              placeholder="Ex.: pizzaria premium com delivery e reservas"
            />

            <button
              type="button"
              onClick={() => setAssistantActive(true)}
            >
              Encontrar templates
            </button>
          </div>
        </section>

        {recommendedTemplates.length > 0 && (
          <section className="recommendation-block">
            <div className="section-heading">
              <div>
                <span>RECOMENDADOS PELA IA</span>
                <h2>Boas opções para o seu projeto.</h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAssistantActive(false);
                  setAssistantQuery("");
                }}
              >
                Limpar
              </button>
            </div>

            <div className="recommendation-grid">
              {recommendedTemplates.map((template, index) => (
                <article
                  className="recommended-card"
                  key={template.id}
                >
                  <div className="recommendation-rank">
                    0{index + 1}
                  </div>

                  <div className="recommended-preview">
                    <TemplatePreviewCard
                      template={template}
                      selected={selected === template.id}
                      onSelect={() => setSelected(template.id)}
                    />
                  </div>

                  <div className="recommended-actions">
                    <div>
                      <small>
                        {getTemplateCategory(template)}
                      </small>
                      <strong>
                        {getTemplateName(template)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        usarTemplate(template.id)
                      }
                    >
                      Usar modelo
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="catalog-toolbar">
          <div className="category-list">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={
                  category === item ? "active" : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="catalog-controls">
            <label className="search-field">
              <span>⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar template..."
              />
            </label>

            <select
              value={sortMode}
              onChange={(event) =>
                setSortMode(
                  event.target.value as SortMode,
                )
              }
              aria-label="Ordenar templates"
            >
              <option value="relevantes">
                Mais relevantes
              </option>
              <option value="nome">Nome</option>
              <option value="categoria">Categoria</option>
            </select>
          </div>
        </section>

        <section className="catalog-heading">
          <div>
            <span>CATÁLOGO</span>
            <h2>Templates disponíveis</h2>
          </div>

          <p>
            {filteredTemplates.length}{" "}
            {filteredTemplates.length === 1
              ? "resultado"
              : "resultados"}
          </p>
        </section>

        {filteredTemplates.length > 0 ? (
          <section className="professional-grid">
            {filteredTemplates.map((template) => (
              <article
                className={`professional-template ${
                  selected === template.id
                    ? "is-selected"
                    : ""
                }`}
                key={template.id}
              >
                <div className="template-preview-shell">
                  <TemplatePreviewCard
                    template={template}
                    selected={selected === template.id}
                    onSelect={() =>
                      setSelected(template.id)
                    }
                  />

                  <div className="template-hover-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewId(template.id)
                      }
                    >
                      Visualizar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        usarTemplate(template.id)
                      }
                    >
                      Usar template
                    </button>
                  </div>
                </div>

                <div className="template-information">
                  <div>
                    <small>
                      {getTemplateCategory(template)}
                    </small>
                    <h3>{getTemplateName(template)}</h3>
                  </div>

                  <span
                    className={
                      selected === template.id
                        ? "selected-badge"
                        : "available-badge"
                    }
                  >
                    {selected === template.id
                      ? "Selecionado"
                      : "Disponível"}
                  </span>
                </div>

                <div className="template-features">
                  <span>Responsivo</span>
                  <span>SEO</span>
                  <span>Editor visual</span>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <span>⌕</span>
            <h3>Nenhum template encontrado</h3>
            <p>
              Tente pesquisar outro segmento ou remover os
              filtros.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("Todos");
              }}
            >
              Mostrar todos
            </button>
          </section>
        )}

        <section className="selection-dock">
          <div>
            <small>TEMPLATE SELECIONADO</small>
            <strong>
              {selectedTemplate
                ? getTemplateName(selectedTemplate)
                : "Nenhum modelo"}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => usarTemplate()}
          >
            Personalizar este template →
          </button>
        </section>
      </main>

      {previewTemplate && (
        <div
          className="template-modal-backdrop"
          role="presentation"
          onClick={() => setPreviewId(null)}
        >
          <section
            className="template-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Prévia de ${getTemplateName(
              previewTemplate,
            )}`}
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <small>
                  {getTemplateCategory(previewTemplate)}
                </small>
                <h2>
                  {getTemplateName(previewTemplate)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setPreviewId(null)}
                aria-label="Fechar prévia"
              >
                ×
              </button>
            </header>

            <div className="modal-preview">
              <TemplatePreviewCard
                template={previewTemplate}
                selected={selected === previewTemplate.id}
                onSelect={() =>
                  setSelected(previewTemplate.id)
                }
              />
            </div>

            <footer>
              <span>
                Responsivo • SEO • Personalizável com IA
              </span>

              <button
                type="button"
                onClick={() =>
                  usarTemplate(previewTemplate.id)
                }
              >
                Usar este template
              </button>
            </footer>
          </section>
        </div>
      )}

      <style jsx global>{`
        .templates-marketplace {
          min-height: 100vh;
          padding: 32px 34px 130px;
          background: #f4f6f8;
          color: #101828;
        }

        .marketplace-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          padding: 18px 0 32px;
          border-bottom: 1px solid #dfe3e8;
        }

        .marketplace-intro > div:first-child {
          max-width: 820px;
        }

        .eyebrow,
        .section-heading span,
        .catalog-heading span {
          color: #32b985;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.17em;
        }

        .marketplace-intro h1 {
          max-width: 900px;
          margin: 13px 0 15px;
          font-size: clamp(38px, 5vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .marketplace-intro p {
          max-width: 720px;
          margin: 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.75;
        }

        .intro-stats {
          display: flex;
          gap: 10px;
        }

        .intro-stats > div {
          min-width: 118px;
          padding: 14px;
          border: 1px solid #dfe3e8;
          border-radius: 13px;
          background: #ffffff;
        }

        .intro-stats strong,
        .intro-stats span {
          display: block;
        }

        .intro-stats strong {
          font-size: 18px;
        }

        .intro-stats span {
          margin-top: 4px;
          color: #98a2b3;
          font-size: 8px;
        }

        .ai-template-finder {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          align-items: center;
          gap: 28px;
          margin-top: 28px;
          padding: 24px 26px;
          border: 1px solid #dfe3e8;
          border-radius: 18px;
          color: #ffffff;
          background: #101418;
          box-shadow: 0 18px 45px rgba(16, 24, 40, 0.14);
        }

        .finder-copy > span {
          color: #5dd3a6;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .finder-copy h2 {
          margin: 8px 0 5px;
          font-size: 24px;
          letter-spacing: -0.035em;
        }

        .finder-copy p {
          margin: 0;
          color: #98a2b3;
          font-size: 10px;
        }

        .finder-form {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 9px;
        }

        .finder-form input {
          min-height: 48px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 11px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
          outline: none;
          font-size: 10px;
        }

        .finder-form input:focus {
          border-color: #5dd3a6;
          box-shadow: 0 0 0 3px rgba(93, 211, 166, 0.1);
        }

        .finder-form button {
          min-height: 48px;
          padding: 0 18px;
          border: 0;
          border-radius: 11px;
          color: #07130e;
          background: #5dd3a6;
          font-size: 9px;
          font-weight: 850;
          cursor: pointer;
        }

        .recommendation-block {
          margin-top: 30px;
          padding: 24px;
          border: 1px solid #dfe3e8;
          border-radius: 20px;
          background: #ffffff;
        }

        .section-heading,
        .catalog-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .section-heading h2,
        .catalog-heading h2 {
          margin: 7px 0 0;
          font-size: 26px;
          letter-spacing: -0.04em;
        }

        .section-heading > button {
          border: 0;
          color: #667085;
          background: transparent;
          font-size: 9px;
          cursor: pointer;
        }

        .recommendation-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .recommended-card {
          position: relative;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: #f8fafc;
        }

        .recommendation-rank {
          position: absolute;
          z-index: 3;
          left: 12px;
          top: 12px;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #ffffff;
          background: rgba(16, 24, 40, 0.9);
          font-size: 9px;
          font-weight: 900;
        }

        .recommended-preview {
          max-height: 280px;
          overflow: hidden;
        }

        .recommended-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px;
          background: #ffffff;
        }

        .recommended-actions small,
        .recommended-actions strong {
          display: block;
        }

        .recommended-actions small {
          color: #98a2b3;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .recommended-actions strong {
          margin-top: 3px;
          font-size: 11px;
        }

        .recommended-actions button {
          min-height: 34px;
          padding: 0 11px;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          background: #101828;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .catalog-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin: 30px 0 20px;
          padding: 14px;
          border: 1px solid #dfe3e8;
          border-radius: 16px;
          background: #ffffff;
        }

        .category-list {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .category-list button {
          min-height: 34px;
          padding: 0 12px;
          border: 0;
          border-radius: 8px;
          color: #667085;
          background: transparent;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .category-list button.active {
          color: #ffffff;
          background: #101828;
        }

        .catalog-controls {
          display: flex;
          gap: 8px;
        }

        .search-field {
          min-width: 230px;
          min-height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border: 1px solid #dfe3e8;
          border-radius: 9px;
          background: #ffffff;
        }

        .search-field span {
          color: #98a2b3;
        }

        .search-field input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 9px;
        }

        .catalog-controls select {
          min-height: 38px;
          padding: 0 28px 0 11px;
          border: 1px solid #dfe3e8;
          border-radius: 9px;
          color: #475467;
          background: #ffffff;
          font-size: 9px;
        }

        .catalog-heading {
          margin: 25px 0 15px;
        }

        .catalog-heading > p {
          margin: 0;
          color: #98a2b3;
          font-size: 9px;
        }

        .professional-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: max-content;
          align-items: start;
          gap: 18px;
        }

        .professional-template {
          align-self: start !important;
          height: fit-content !important;
          min-height: 0 !important;
          overflow: hidden;
          border: 1px solid #dfe3e8;
          border-radius: 16px;
          background: #ffffff;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .professional-template:hover,
        .professional-template.is-selected {
          transform: translateY(-5px);
          border-color: #5dd3a6;
          box-shadow: 0 20px 38px rgba(16, 24, 40, 0.1);
        }

        .template-preview-shell {
          position: relative;
          width: 100%;
          height: auto !important;
          min-height: 0 !important;
          overflow: hidden;
          background: #f3f5f7;
        }

        .professional-template > * {
          flex: none !important;
        }

        .professional-template .template-preview-card {
          height: auto !important;
          min-height: 0 !important;
        }

        .template-hover-actions {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          background: rgba(9, 13, 17, 0.76);
          backdrop-filter: blur(4px);
          transition: opacity 0.2s ease;
        }

        .template-preview-shell:hover
          .template-hover-actions {
          opacity: 1;
        }

        .template-hover-actions button {
          min-height: 39px;
          padding: 0 13px;
          border-radius: 9px;
          font-size: 8px;
          font-weight: 850;
          cursor: pointer;
        }

        .template-hover-actions button:first-child {
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .template-hover-actions button:last-child {
          border: 0;
          color: #07130e;
          background: #5dd3a6;
        }

        .template-information {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 15px 9px;
        }

        .template-information small,
        .template-information h3 {
          margin: 0;
          display: block;
        }

        .template-information small {
          color: #98a2b3;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .template-information h3 {
          margin-top: 4px;
          font-size: 13px;
          letter-spacing: -0.02em;
        }

        .selected-badge,
        .available-badge {
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 850;
        }

        .selected-badge {
          color: #067647;
          background: #ecfdf3;
        }

        .available-badge {
          color: #667085;
          background: #f2f4f7;
        }

        .template-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 15px 15px;
        }

        .template-features span {
          padding: 5px 7px;
          border-radius: 6px;
          color: #667085;
          background: #f2f4f7;
          font-size: 7px;
          font-weight: 750;
        }

        .selection-dock {
          position: fixed;
          z-index: 25;
          right: 28px;
          bottom: 20px;
          left: calc(var(--sidebar-width, 240px) + 28px);
          min-height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 12px 14px 12px 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          color: #ffffff;
          background: rgba(12, 16, 20, 0.96);
          box-shadow: 0 22px 50px rgba(16, 24, 40, 0.25);
          backdrop-filter: blur(16px);
        }

        .selection-dock small,
        .selection-dock strong {
          display: block;
        }

        .selection-dock small {
          color: #98a2b3;
          font-size: 7px;
          letter-spacing: 0.11em;
        }

        .selection-dock strong {
          margin-top: 4px;
          font-size: 13px;
        }

        .selection-dock > button {
          min-height: 44px;
          padding: 0 17px;
          border: 0;
          border-radius: 10px;
          color: #07130e;
          background: #5dd3a6;
          font-size: 9px;
          font-weight: 850;
          cursor: pointer;
        }

        .empty-state {
          min-height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed #d0d5dd;
          border-radius: 18px;
          background: #ffffff;
          text-align: center;
        }

        .empty-state > span {
          color: #32b985;
          font-size: 30px;
        }

        .empty-state h3 {
          margin: 12px 0 5px;
        }

        .empty-state p {
          margin: 0;
          color: #98a2b3;
          font-size: 9px;
        }

        .empty-state button {
          min-height: 38px;
          margin-top: 15px;
          padding: 0 13px;
          border: 0;
          border-radius: 9px;
          color: #ffffff;
          background: #101828;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .template-modal-backdrop {
          position: fixed;
          z-index: 100;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(8, 11, 15, 0.76);
          backdrop-filter: blur(8px);
        }

        .template-modal {
          width: min(100%, 980px);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.32);
        }

        .template-modal header,
        .template-modal footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 15px 18px;
        }

        .template-modal header {
          border-bottom: 1px solid #e5e7eb;
        }

        .template-modal header small {
          color: #32b985;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .template-modal header h2 {
          margin: 4px 0 0;
          font-size: 18px;
        }

        .template-modal header > button {
          width: 36px;
          height: 36px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: #ffffff;
          font-size: 21px;
          cursor: pointer;
        }

        .modal-preview {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: 18px;
          background: #f3f5f7;
        }

        .template-modal footer {
          border-top: 1px solid #e5e7eb;
        }

        .template-modal footer span {
          color: #98a2b3;
          font-size: 8px;
        }

        .template-modal footer button {
          min-height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 9px;
          color: #07130e;
          background: #5dd3a6;
          font-size: 8px;
          font-weight: 850;
          cursor: pointer;
        }

        @media (max-width: 1180px) {
          .professional-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recommendation-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .templates-marketplace {
            padding: 24px 18px 125px;
          }

          .marketplace-intro {
            align-items: flex-start;
            flex-direction: column;
          }

          .ai-template-finder {
            grid-template-columns: 1fr;
          }

          .catalog-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .catalog-controls {
            width: 100%;
          }

          .search-field {
            flex: 1;
          }

          .selection-dock {
            right: 14px;
            left: 14px;
          }
        }

        @media (max-width: 620px) {
          .intro-stats {
            width: 100%;
            overflow-x: auto;
          }

          .finder-form {
            grid-template-columns: 1fr;
          }

          .professional-grid {
            grid-template-columns: 1fr;
          }

          .catalog-controls {
            flex-direction: column;
          }

          .search-field {
            width: 100%;
            min-width: 0;
          }

          .selection-dock {
            align-items: stretch;
            flex-direction: column;
          }

          .selection-dock > button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}