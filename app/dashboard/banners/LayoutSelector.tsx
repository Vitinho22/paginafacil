"use client";

type BannerState = {
  layout?: number;
  format?: string;
  objective?: string;
  title?: string;
  description?: string;
  cta?: string;
  idea?: string;
  image?: string;
  sourceImage?: string;
  resultImage?: string;
  width?: number;
  height?: number;
};

interface LayoutSelectorProps {
  currentLayout: number;
  onLayoutChange: (layout: number) => void;
  banner?: BannerState;
}

const layouts = [
  {
    id: 1,
    name: "Texto à esquerda",
    description: "Imagem em destaque com conteúdo no lado esquerdo.",
  },
  {
    id: 2,
    name: "Texto central",
    description: "Conteúdo centralizado para campanhas de impacto.",
  },
  {
    id: 3,
    name: "Texto inferior",
    description: "Imagem livre com informações na parte inferior.",
  },
  {
    id: 4,
    name: "Minimalista",
    description: "Poucos elementos e mais espaço visual.",
  },
];

export default function LayoutSelector({
  currentLayout,
  onLayoutChange,
}: LayoutSelectorProps) {
  return (
    <div className="layout-selector">
      <div className="layout-selector-header">
        <h3>Escolha o layout</h3>
        <p>Selecione a disposição dos elementos do banner.</p>
      </div>

      <div className="layout-selector-grid">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            type="button"
            onClick={() => onLayoutChange(layout.id)}
            className={
              currentLayout === layout.id
                ? "layout-option selected"
                : "layout-option"
            }
          >
            <span className={`layout-preview layout-preview-${layout.id}`}>
              <i />
              <b />
              <small />
            </span>

            <span className="layout-option-copy">
              <strong>{layout.name}</strong>
              <small>{layout.description}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}