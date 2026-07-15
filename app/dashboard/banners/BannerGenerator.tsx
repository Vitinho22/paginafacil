"use client";

export type BannerState = {
  format?: string;
  objective?: string;
  title?: string;
  description?: string;
  cta?: string;
  idea?: string;
  sourceImage?: string;
  resultImage?: string;
};

interface BannerGeneratorProps {
  banner: BannerState;
  onVariantSelect: (variant: BannerState) => void;
}

export default function BannerGenerator({
  banner,
  onVariantSelect,
}: BannerGeneratorProps) {
  function generateVariant() {
    const variant: BannerState = {
      ...banner,
      title: banner.title
        ? `${banner.title} — versão alternativa`
        : "Nova versão do banner",
    };

    onVariantSelect(variant);
  }

  return (
    <div className="banner-generator">
      <button
        type="button"
        onClick={generateVariant}
        className="generate-variations-btn"
      >
        ⚡ Gerar Variação Automática
      </button>
    </div>
  );
}