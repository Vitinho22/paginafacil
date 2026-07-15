"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const segmentos = ["Empresa", "Restaurante", "Loja virtual", "Barbearia", "Clínica", "Portfólio", "Landing page", "Curso online"];

export default function NovoSitePage() {
  const router = useRouter();
  const [descricao, setDescricao] = useState("");
  const [segmento, setSegmento] = useState("");
  const canContinue = useMemo(() => descricao.trim().length >= 12 || Boolean(segmento), [descricao, segmento]);

  function next() {
    if (!canContinue) return;
    localStorage.setItem("paginafacil_novo", JSON.stringify({ descricaoInicial: descricao.trim(), segmento }));
    router.push("/dashboard/assistente");
  }

  return (
    <>
      <DashboardHeader title="Criar site com IA" />
      <div className="dashboard-content light-workspace">
        <div className="creation-shell">
          <div className="creation-heading">
            <span className="smallcaps">NOVO PROJETO COM IA</span>
            <h1>Descreva o site que você quer criar.</h1>
            <p>A inteligência artificial criará textos personalizados. Você poderá revisar tudo no editor antes de publicar.</p>
          </div>

          <section className="creation-card">
            <label className="label">Conte sua ideia</label>
            <textarea
              className="textarea creation-textarea"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Ex.: Quero um site moderno para uma pizzaria artesanal em Jundiaí, com cardápio, entrega e botão do WhatsApp."
            />
            <div className="creation-counter">{descricao.length} caracteres</div>
          </section>

          <div className="creation-section-title">
            <div><span>OU ESCOLHA UMA BASE</span><h2>Qual é o segmento do negócio?</h2></div>
          </div>
          <div className="segment-grid">
            {segmentos.map((item) => (
              <button key={item} onClick={() => setSegmento(item)} className={segmento === item ? "segment-card selected" : "segment-card"}>
                <span className="segment-icon">✦</span>
                <strong>{item}</strong>
                <p>A IA adapta a estrutura e o texto para esse mercado.</p>
                <i>{segmento === item ? "Selecionado" : "Selecionar"}</i>
              </button>
            ))}
          </div>

          <div className="creation-actions">
            <button className="btn btn-primary creation-continue" onClick={next} disabled={!canContinue}>Continuar com a IA →</button>
          </div>
        </div>
      </div>
    </>
  );
}
