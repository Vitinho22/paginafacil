"use client";

import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { criarConteudoInicial, escolherTemplate } from "@/lib/templates";
import type { TemplateId } from "@/types/site";

const stages = [
  "Conectando à inteligência artificial",
  "Criando textos personalizados",
  "Montando a estrutura do site",
  "Salvando o projeto",
];

export default function GerandoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;
    let cancelled = false;

    async function run() {
      try {
        setError("");
        const data = JSON.parse(localStorage.getItem("paginafacil_novo") || "{}");
        const templateId = (data.templateId || escolherTemplate(data.segmento || "")) as TemplateId;
        const base = criarConteudoInicial({
          nome: data.nome,
          segmento: data.segmento,
          cidade: data.cidade,
          estilo: data.estilo,
          templateId,
        });

        setIndex(0);
        const response = await fetch("/api/ai/site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: data.nome,
            segmento: data.segmento,
            cidade: data.cidade,
            estilo: data.estilo,
            descricaoInicial: data.descricaoInicial,
          }),
        });
        const payload = await response.json() as { content?: Partial<typeof base>; error?: string };
        if (!response.ok || !payload.content) throw new Error(payload.error || "A IA não conseguiu criar o site.");
        if (cancelled) return;

        setIndex(1);
        await new Promise((resolve) => setTimeout(resolve, 350));
        const content = { ...base, ...payload.content };

        setIndex(2);
        await new Promise((resolve) => setTimeout(resolve, 350));
        const now = new Date().toISOString();
        const sitePayload = {
          userId: currentUser.uid,
          ...content,
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          descricaoInicial: data.descricaoInicial || "",
          status: "rascunho",
          criadoEm: now,
          atualizadoEm: now,
        };

        setIndex(3);
        const ref = await addDoc(collection(db, "sites"), sitePayload);
        localStorage.removeItem("paginafacil_novo");
        router.replace(`/dashboard/editor/${ref.id}`);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Não foi possível criar o projeto com IA.");
      }
    }

    run();
    return () => { cancelled = true; };
  }, [user, router, retry]);

  return (
    <main className="shell generating-page light-workspace">
      <section className="card generating-card ai-generating-card">
        <span className="ai-orb">✦</span>
        <span className="smallcaps generating-label">IA REAL EM EXECUÇÃO</span>
        <h1 className="section-title">Criando seu site com inteligência artificial.</h1>
        <p className="muted">Os textos são enviados para a API e gerados especialmente para o seu negócio.</p>

        <div className="generating-list">
          {stages.map((stage, stageIndex) => (
            <div key={stage} className={stageIndex <= index ? "complete" : ""}>
              <strong>{stageIndex < index ? "✓" : stageIndex + 1}</strong>
              <span>{stage}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="ai-error-panel">
            <strong>A criação parou</strong>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => setRetry((value) => value + 1)}>Tentar novamente</button>
          </div>
        )}
      </section>
    </main>
  );
}
