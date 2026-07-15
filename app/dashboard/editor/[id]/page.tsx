"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TemplateRenderer from "@/components/TemplateRenderer";
import { db } from "@/lib/firebase";
import type { Site, SiteSection, TemplateId } from "@/types/site";

function updateSection(
  list: SiteSection[],
  index: number,
  key: keyof SiteSection,
  value: string,
) {
  return list.map((item, itemIndex) =>
    itemIndex === index ? { ...item, [key]: value } : item,
  );
}

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "sites", params.id));
      if (!snap.exists()) {
        router.replace("/dashboard/sites");
        return;
      }
      setSite({ id: snap.id, ...snap.data() } as Site);
    }
    load();
  }, [params.id, router]);

  function setValue<K extends keyof Site>(key: K, value: Site[K]) {
    setSite((current) => (current ? { ...current, [key]: value } : current));
  }

  async function save(publish = false) {
    if (!site) return;
    setSaving(true);
    setMessage("");

    try {
      const status = publish ? "publicado" : site.status;
      const updated = {
        nome: site.nome,
        segmento: site.segmento,
        cidade: site.cidade,
        whatsapp: site.whatsapp,
        instagram: site.instagram,
        templateId: site.templateId,
        titulo: site.titulo,
        subtitulo: site.subtitulo,
        etiqueta: site.etiqueta,
        ctaPrimario: site.ctaPrimario,
        ctaSecundario: site.ctaSecundario,
        cor: site.cor,
        corFundo: site.corFundo,
        servicos: site.servicos,
        beneficios: site.beneficios,
        status,
        atualizadoEm: new Date().toISOString(),
      };

      await updateDoc(doc(db, "sites", site.id), updated);
      setSite({ ...site, ...updated });
      setMessage(publish ? "Projeto publicado." : "Alterações salvas.");
    } finally {
      setSaving(false);
    }
  }

  if (!site) {
    return (
      <main className="shell loading-editor">
        <p className="muted">Carregando editor...</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <header className="editor-topbar">
        <div className="editor-project-title">
          <Link className="btn btn-secondary" href="/dashboard/sites">
            ←
          </Link>
          <div>
            <strong>{site.nome}</strong>
            <span>{site.status}</span>
          </div>
        </div>

        <div className="editor-actions">
          <Link
            className="btn btn-secondary"
            href={`/site/${site.id}`}
            target="_blank"
          >
            Visualizar
          </Link>
          <button
            className="btn btn-secondary"
            onClick={() => save(false)}
            disabled={saving}
          >
            Salvar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => save(true)}
            disabled={saving}
          >
            Publicar
          </button>
        </div>
      </header>

      <div className="professional-editor">
        <aside className="editor-navigation">
          <p className="nav-label">Estrutura</p>
          {[
            "Cabeçalho",
            "Apresentação",
            "Serviços",
            "Diferenciais",
            "Contato",
            "Rodapé",
          ].map((item, index) => (
            <div key={item} className={`nav-item ${index === 1 ? "active" : ""}`}>
              {item}
            </div>
          ))}

          <div className="editor-template-box">
            <span>Template</span>
            <strong>{site.templateId}</strong>
            <select
              className="select"
              value={site.templateId}
              onChange={(event) =>
                setValue("templateId", event.target.value as TemplateId)
              }
            >
              <option value="corporativo">Norte</option>
              <option value="restaurante">Sabor</option>
              <option value="vendas">Conversão</option>
              <option value="portfolio">Ateliê</option>
            </select>
          </div>
        </aside>

        <section className="editor-preview-area">
          <div className="editor-browser">
            <div className="editor-browser-toolbar">
              <span />
              <span />
              <span />
              <p>Prévia responsiva</p>
            </div>
            <TemplateRenderer site={site} editing />
          </div>
        </section>

        <aside className="editor-properties">
          <p className="nav-label">Conteúdo e estilo</p>

          <div className="property-group">
            <label className="label">Nome do negócio</label>
            <input
              className="input"
              value={site.nome}
              onChange={(event) => setValue("nome", event.target.value)}
            />
          </div>

          <div className="property-group">
            <label className="label">Etiqueta</label>
            <input
              className="input"
              value={site.etiqueta}
              onChange={(event) => setValue("etiqueta", event.target.value)}
            />
          </div>

          <div className="property-group">
            <label className="label">Título principal</label>
            <textarea
              className="textarea"
              value={site.titulo}
              onChange={(event) => setValue("titulo", event.target.value)}
            />
          </div>

          <div className="property-group">
            <label className="label">Descrição</label>
            <textarea
              className="textarea"
              value={site.subtitulo}
              onChange={(event) => setValue("subtitulo", event.target.value)}
            />
          </div>

          <div className="property-grid">
            <div>
              <label className="label">Botão principal</label>
              <input
                className="input"
                value={site.ctaPrimario}
                onChange={(event) =>
                  setValue("ctaPrimario", event.target.value)
                }
              />
            </div>
            <div>
              <label className="label">Cor principal</label>
              <input
                className="editor-color"
                type="color"
                value={site.cor}
                onChange={(event) => setValue("cor", event.target.value)}
              />
            </div>
          </div>

          <div className="property-group">
            <label className="label">WhatsApp</label>
            <input
              className="input"
              value={site.whatsapp}
              onChange={(event) => setValue("whatsapp", event.target.value)}
            />
          </div>

          <div className="property-group">
            <label className="label">Serviços</label>
            {site.servicos.map((item, index) => (
              <div className="repeater-item" key={`${item.titulo}-${index}`}>
                <input
                  className="input"
                  value={item.titulo}
                  onChange={(event) =>
                    setValue(
                      "servicos",
                      updateSection(
                        site.servicos,
                        index,
                        "titulo",
                        event.target.value,
                      ),
                    )
                  }
                />
                <textarea
                  className="textarea compact"
                  value={item.texto}
                  onChange={(event) =>
                    setValue(
                      "servicos",
                      updateSection(
                        site.servicos,
                        index,
                        "texto",
                        event.target.value,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>

          {message && <p className="success">{message}</p>}
        </aside>
      </div>
    </main>
  );
}
