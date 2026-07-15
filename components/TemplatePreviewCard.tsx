import type { TemplateDefinition } from "@/lib/templates";

export default function TemplatePreviewCard({
  template,
  selected,
  onSelect,
}: {
  template: TemplateDefinition;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`template-preview-card ${selected ? "selected" : ""}`}
    >
      <div
        className="template-preview-canvas"
        style={{ background: template.corFundo }}
      >
        <div className="preview-mini-header">
          <span style={{ background: template.cor }} />
          <i />
          <i />
        </div>
        <div className="preview-mini-body">
          <div>
            <small style={{ color: template.cor }}>APRESENTAÇÃO</small>
            <strong />
            <strong className="short" />
            <p />
            <span style={{ background: template.cor }} />
          </div>
          <aside>
            <b style={{ background: template.cor }} />
          </aside>
        </div>
      </div>

      <div className="template-preview-info">
        <div>
          <strong>{template.nome}</strong>
          <span>{template.indicadoPara}</span>
        </div>
        <span className="preview-select">{selected ? "Selecionado" : "Usar"}</span>
      </div>
    </button>
  );
}
