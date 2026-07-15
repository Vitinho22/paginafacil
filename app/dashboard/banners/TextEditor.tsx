"use client";

type BannerState = {
  title?: string;
  description?: string;
  cta?: string;
  objective?: string;
  idea?: string;
  format?: string;
  layout?: number;
  image?: string;
  sourceImage?: string;
  resultImage?: string;
  width?: number;
  height?: number;
};

interface TextEditorProps {
  banner: BannerState;
  onChange: (banner: BannerState) => void;
}

export default function TextEditor({
  banner,
  onChange,
}: TextEditorProps) {
  function updateField(
    field: keyof BannerState,
    value: string
  ) {
    onChange({
      ...banner,
      [field]: value,
    });
  }

  return (
    <div className="text-editor">
      <div className="text-editor-header">
        <h3>Textos do banner</h3>
        <p>Edite o conteúdo que aparecerá na arte.</p>
      </div>

      <label className="text-editor-field">
        <span>Título principal</span>
        <textarea
          value={banner.title || ""}
          onChange={(event) =>
            updateField("title", event.target.value)
          }
          placeholder="Digite o título principal"
          rows={3}
        />
      </label>

      <label className="text-editor-field">
        <span>Descrição</span>
        <textarea
          value={banner.description || ""}
          onChange={(event) =>
            updateField("description", event.target.value)
          }
          placeholder="Digite uma descrição curta"
          rows={4}
        />
      </label>

      <label className="text-editor-field">
        <span>Chamada para ação</span>
        <input
          type="text"
          value={banner.cta || ""}
          onChange={(event) =>
            updateField("cta", event.target.value)
          }
          placeholder="Ex.: Saiba mais"
        />
      </label>

      <label className="text-editor-field">
        <span>Objetivo</span>
        <input
          type="text"
          value={banner.objective || ""}
          onChange={(event) =>
            updateField("objective", event.target.value)
          }
          placeholder="Ex.: Promover produto"
        />
      </label>
    </div>
  );
}