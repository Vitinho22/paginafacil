"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import TemplatePreviewCard from "@/components/TemplatePreviewCard";
import { templates } from "@/lib/templates";
import type { TemplateId } from "@/types/site";

export default function TemplatesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<TemplateId>("corporativo");

  function usarTemplate() {
    const existing = JSON.parse(
      localStorage.getItem("paginafacil_novo") || "{}",
    );

    localStorage.setItem(
      "paginafacil_novo",
      JSON.stringify({ ...existing, templateId: selected }),
    );

    router.push("/dashboard/assistente");
  }

  return (
    <>
      <DashboardHeader title="Templates" />
      <div className="dashboard-content">
        <span className="smallcaps">Biblioteca profissional</span>
        <h1 className="section-title" style={{ marginTop: 10 }}>
          Escolha uma direção visual.
        </h1>
        <p className="muted" style={{ maxWidth: 720, lineHeight: 1.7 }}>
          Cada modelo possui estrutura, hierarquia e conteúdo inicial próprios.
          Você poderá personalizar tudo no editor.
        </p>

        <div className="template-library">
          {templates.map((template) => (
            <TemplatePreviewCard
              key={template.id}
              template={template}
              selected={selected === template.id}
              onSelect={() => setSelected(template.id)}
            />
          ))}
        </div>

        <div className="template-library-action">
          <button className="btn btn-primary" onClick={usarTemplate}>
            Usar template selecionado
          </button>
        </div>
      </div>
    </>
  );
}
