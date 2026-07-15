"use client";

import {
  ChangeEvent,
  CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  ChevronDown,
  Download,
  ImageIcon,
  LayoutGrid,
  Monitor,
  MoreVertical,
  Pencil,
  Pin,
  RefreshCw,
  Sparkles,
  Upload,
  WandSparkles,
  Zap,
  Play,
} from "lucide-react";
type FormatName = "Instagram" | "Stories" | "Pinterest" | "YouTube";
type StyleName = "luxury" | "minimalist" | "modern" | "bold";

type FormatConfig = {
  title: string;
  label: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const FORMATS: Record<FormatName, FormatConfig> = {
  Instagram: {
    title: "Instagram Post",
    label: "1080 × 1080",
    width: 1080,
    height: 1080,
    icon: Camera,
  },
  Stories: {
    title: "Stories",
    label: "1080 × 1920",
    width: 1080,
    height: 1920,
    icon: Monitor,
  },
  Pinterest: {
    title: "Pinterest Pin",
    label: "1000 × 1500",
    width: 1000,
    height: 1500,
    icon: Pin,
  },
  YouTube: {
    title: "YouTube Capa",
    label: "1280 × 720",
    width: 1280,
    height: 720,
    icon: Play,
  },
};

const STYLES: Array<{
  id: StyleName;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}> = [
  { id: "luxury", label: "Luxo", icon: WandSparkles },
  { id: "minimalist", label: "Minimalista", icon: Pencil },
  { id: "modern", label: "Moderno", icon: LayoutGrid },
  { id: "bold", label: "Impactante", icon: Zap },
];

const OBJECTIVES = [
  "Promover produto ou serviço",
  "Gerar visitas ao site",
  "Divulgar uma promoção",
  "Apresentar minha empresa",
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Não foi possível carregar a imagem."));
    image.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function formatPreviewStyle(format: FormatConfig): CSSProperties {
  const ratio = format.width / format.height;

  if (ratio > 1.4) {
    return { width: "100%", maxWidth: 820, aspectRatio: `${ratio}` };
  }

  if (ratio < 0.72) {
    return { height: "min(680px, 72vh)", aspectRatio: `${ratio}` };
  }

  return { width: "100%", maxWidth: 760, aspectRatio: `${ratio}` };
}

export default function BannerStudio() {
  const [format, setFormat] = useState<FormatName>("Instagram");
  const [style, setStyle] = useState<StyleName>("luxury");
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [idea, setIdea] = useState(
    "Cozinha planejada sofisticada, elegante, iluminação quente, transmitir exclusividade e qualidade premium."
  );
  const [title, setTitle] = useState("Transforme sua cozinha");
  const [subtitle, setSubtitle] = useState(
    "Projetos planejados com design exclusivo, funcionalidade e acabamento premium."
  );
  const [cta, setCta] = useState("Solicite seu orçamento");
  const [sourceImage, setSourceImage] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedFormat = FORMATS[format];
  const activeImage = resultImage || sourceImage;

  useEffect(() => {
    return () => {
      if (sourceImage.startsWith("blob:")) {
        URL.revokeObjectURL(sourceImage);
      }
    };
  }, [sourceImage]);

  function resetProject() {
    setResultImage("");
    setSourceImage("");
    setFileName("");
    setFileSize("");
    setError("");
    setTitle("Transforme sua cozinha");
    setSubtitle(
      "Projetos planejados com design exclusivo, funcionalidade e acabamento premium."
    );
    setCta("Solicite seu orçamento");
    setIdea(
      "Cozinha planejada sofisticada, elegante, iluminação quente, transmitir exclusividade e qualidade premium."
    );
    setFormat("Instagram");
    setStyle("luxury");
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError("");

    if (!selected) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(selected.type)) {
      setError("Use uma imagem PNG, JPG ou WEBP.");
      return;
    }

    if (selected.size > 15 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 15 MB.");
      return;
    }

    if (sourceImage.startsWith("blob:")) {
      URL.revokeObjectURL(sourceImage);
    }

    setSourceImage(URL.createObjectURL(selected));
    setResultImage("");
    setFileName(selected.name);
    setFileSize(`${(selected.size / 1024 / 1024).toFixed(1)} MB`);
    event.target.value = "";
  }

  async function generateWithAI() {
    setError("");

    if (!sourceImage) {
      fileRef.current?.click();
      setError("Envie uma imagem principal antes de gerar.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      /*
        Integração real:
        substitua a simulação acima pelo seu fetch para /api/ai/banner.
        Ao receber a imagem gerada, use:
        setResultImage(payload.imageUrl);
      */

      setResultImage(sourceImage);
    } finally {
      setLoading(false);
    }
  }

  async function drawBanner() {
    if (!activeImage) {
      throw new Error("Envie uma imagem antes de baixar.");
    }

    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas indisponível.");

    const { width, height } = selectedFormat;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível criar o PNG.");

    const image = await loadImage(activeImage);
    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    ctx.drawImage(image, x, y, drawWidth, drawHeight);

    const dark = ctx.createLinearGradient(0, 0, width * 0.78, 0);
    dark.addColorStop(0, "rgba(4, 5, 7, .97)");
    dark.addColorStop(0.55, "rgba(4, 5, 7, .76)");
    dark.addColorStop(1, "rgba(4, 5, 7, .05)");
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, width, height);

    const pad = width * 0.075;
    const maxTextWidth = width * 0.53;
    const titleSize = width * 0.055;
    const bodySize = width * 0.021;
    let currentY = height * 0.17;

    ctx.fillStyle = "#d7af60";
    ctx.font = `700 ${width * 0.014}px Arial`;
    ctx.fillText("✦ GERADO POR IA", pad, currentY);

    currentY += titleSize * 1.15;
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${titleSize}px Arial`;
    const titleLines = wrapText(ctx, title.toUpperCase(), maxTextWidth).slice(0, 3);

    titleLines.forEach((line, index) => {
      ctx.fillText(line, pad, currentY + index * titleSize * 1.05);
    });

    currentY += titleLines.length * titleSize * 1.05 + bodySize * 1.2;
    ctx.font = `500 ${bodySize}px Arial`;
    ctx.fillStyle = "rgba(255,255,255,.92)";

    const subtitleLines = wrapText(ctx, subtitle, maxTextWidth).slice(0, 4);
    subtitleLines.forEach((line, index) => {
      ctx.fillText(line, pad, currentY + index * bodySize * 1.45);
    });

    currentY += subtitleLines.length * bodySize * 1.45 + bodySize * 1.5;

    const buttonHeight = height * 0.075;
    const buttonWidth = width * 0.31;
    const buttonGradient = ctx.createLinearGradient(
      pad,
      currentY,
      pad + buttonWidth,
      currentY + buttonHeight
    );
    buttonGradient.addColorStop(0, "#d4aa55");
    buttonGradient.addColorStop(1, "#f2d38f");

    ctx.fillStyle = buttonGradient;
    ctx.beginPath();
    ctx.roundRect(pad, currentY, buttonWidth, buttonHeight, buttonHeight / 3);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${width * 0.018}px Arial`;
    ctx.fillText(
      cta.toUpperCase(),
      pad + width * 0.035,
      currentY + buttonHeight * 0.63
    );

    return canvas;
  }

  async function downloadPng() {
    setError("");
    setDownloading(true);

    try {
      const canvas = await drawBanner();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 1)
      );

      if (!blob) throw new Error("Não foi possível gerar o PNG.");

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `banner-${format.toLowerCase()}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Erro ao baixar o PNG."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="banner-page">
      <header className="studio-header">
        <div>
          <div className="studio-heading">
            <Sparkles size={24} strokeWidth={2.4} />
            <div>
              <h1>Banner Studio</h1>
              <p>Crie banners profissionais com IA em segundos</p>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="credit-button" type="button">
            <Zap size={16} />
            Créditos: 1.250
          </button>

          <button className="primary-button compact" type="button" onClick={resetProject}>
            <span>＋</span>
            Novo projeto
          </button>
        </div>
      </header>

      <main className="studio-shell">
        <section className="settings-card">
          <div className="section-block">
            <h2><span>1.</span> Imagem principal</h2>

            <input
              ref={fileRef}
              className="hidden-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
            />

            <button
              type="button"
              className={`upload-card ${sourceImage ? "has-image" : ""}`}
              onClick={() => fileRef.current?.click()}
            >
              {sourceImage ? (
                <>
                  <img src={sourceImage} alt="Imagem selecionada" />
                  <span className="edit-image"><Pencil size={15} /></span>
                  <span className="file-details">
                    <strong>{fileName}</strong>
                    <small>{fileSize}</small>
                  </span>
                </>
              ) : (
                <span className="empty-upload">
                  <Upload size={28} />
                  <strong>Enviar imagem</strong>
                  <small>PNG, JPG ou WEBP · até 15 MB</small>
                </span>
              )}
            </button>

            {sourceImage && (
              <button
                type="button"
                className="remove-button"
                onClick={() => {
                  setSourceImage("");
                  setResultImage("");
                  setFileName("");
                  setFileSize("");
                }}
              >
                Remover
              </button>
            )}
          </div>

          <div className="section-block">
            <h2><span>2.</span> Formato</h2>
            <div className="option-grid">
              {(Object.keys(FORMATS) as FormatName[]).map((name) => {
                const item = FORMATS[name];
                const Icon = item.icon;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormat(name)}
                    className={`format-option ${format === name ? "selected" : ""}`}
                  >
                    <Icon size={20} strokeWidth={2} />
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.label}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="section-block">
            <h2><span>3.</span> Estilo</h2>
            <div className="style-grid">
              {STYLES.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStyle(item.id)}
                    className={`style-option ${style === item.id ? "selected" : ""}`}
                  >
                    <Icon size={20} strokeWidth={2} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="section-block">
            <h2><span>4.</span> Descreva sua ideia</h2>

            <div className="select-wrap">
              <select
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
              >
                {OBJECTIVES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown size={18} />
            </div>

            <textarea
              value={idea}
              maxLength={500}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="Descreva o visual desejado..."
            />
            <div className="counter">{idea.length}/500</div>
          </div>

          <div className="section-block">
            <h2><span>5.</span> Textos do banner</h2>

            <label className="field">
              <span>Título principal</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Subtítulo</span>
              <textarea
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Chamada para ação</span>
              <input
                value={cta}
                onChange={(event) => setCta(event.target.value)}
              />
            </label>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button
            type="button"
            className="generate-button"
            onClick={generateWithAI}
            disabled={loading}
          >
            {loading ? <RefreshCw size={18} className="spin" /> : <Sparkles size={18} />}
            {loading ? "Gerando banner..." : "Gerar Banner com IA"}
          </button>

          <p className="credit-note">ⓘ Gerações restantes: 1.250 créditos</p>
        </section>

        <section className="preview-card">
          <div className="preview-toolbar">
            <div className="preview-title">
              <strong>Preview</strong>
              <span>·</span>
              <span>{selectedFormat.title} {selectedFormat.label}</span>
            </div>

            <div className="toolbar-actions">
              <button type="button">
                <Pencil size={17} />
                Editar textos
              </button>

              <button type="button" onClick={downloadPng} disabled={downloading}>
                <Download size={17} />
                {downloading ? "Preparando..." : "Baixar PNG"}
              </button>

              <button className="icon-button" type="button">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="preview-stage">
            <div
              className={`banner-preview style-${style}`}
              style={formatPreviewStyle(selectedFormat)}
            >
              {activeImage ? (
                <img src={activeImage} alt="Prévia do banner" />
              ) : (
                <div className="preview-placeholder">
                  <ImageIcon size={44} />
                  <strong>Envie uma imagem</strong>
                  <span>A prévia aparecerá aqui</span>
                </div>
              )}

              {activeImage && (
                <>
                  <div className="preview-overlay" />

                  <div className="ai-badge">
                    <Sparkles size={14} />
                    GERADO POR IA
                  </div>

                  <div className="banner-content">
                    <h2>{title}</h2>
                    <div className="gold-line" />
                    <p>{subtitle}</p>

                    <div className="benefit-list">
                      <div>
                        <WandSparkles size={30} />
                        <span>
                          <strong>DESIGN EXCLUSIVO</strong>
                          <small>Sofisticação em cada detalhe</small>
                        </span>
                      </div>

                      <div>
                        <LayoutGrid size={30} />
                        <span>
                          <strong>100% PLANEJADO</strong>
                          <small>Aproveitamento inteligente de cada espaço</small>
                        </span>
                      </div>

                      <div>
                        <Sparkles size={30} />
                        <span>
                          <strong>MATERIAIS PREMIUM</strong>
                          <small>Qualidade que você vê e sente</small>
                        </span>
                      </div>
                    </div>

                    <button className="banner-cta" type="button">
                      <span>◉</span>
                      {cta}
                      <span>›</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="preview-tip">
            <Sparkles size={16} />
            Dica: Experimente diferentes estilos e descrições para obter resultados ainda melhores!
          </div>
        </section>
      </main>

      <canvas ref={canvasRef} hidden />

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          background: #f7f8fc;
          color: #111827;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .banner-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 78% 0%, rgba(126, 87, 255, 0.07), transparent 35%),
            #f7f8fc;
        }

        .studio-header {
          min-height: 100px;
          padding: 22px 30px;
          border-bottom: 1px solid #e8eaf2;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .studio-heading {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .studio-heading > svg {
          color: #7857ff;
          margin-top: 4px;
        }

        .studio-heading h1 {
          margin: 0;
          font-size: 25px;
          line-height: 1.1;
          letter-spacing: -0.04em;
          color: #151824;
        }

        .studio-heading p {
          margin: 7px 0 0;
          font-size: 13px;
          color: #6f7685;
        }

        .header-actions,
        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .credit-button,
        .primary-button,
        .toolbar-actions button {
          border: 1px solid #e3e6ef;
          background: #ffffff;
          border-radius: 12px;
          min-height: 42px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: #252938;
          font-size: 13px;
          font-weight: 750;
          box-shadow: 0 6px 18px rgba(24, 30, 44, 0.05);
        }

        .credit-button svg {
          color: #e4a22b;
          fill: rgba(228, 162, 43, 0.16);
        }

        .primary-button {
          border: none;
          color: #ffffff;
          background: linear-gradient(135deg, #7048f5, #a86bff);
          box-shadow: 0 12px 24px rgba(112, 72, 245, 0.28);
        }

        .primary-button:hover,
        .generate-button:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }

        .studio-shell {
          max-width: 1500px;
          margin: 0 auto;
          padding: 24px;
          display: grid;
          grid-template-columns: minmax(330px, 390px) minmax(0, 1fr);
          gap: 20px;
          align-items: start;
        }

        .settings-card,
        .preview-card {
          background: #ffffff;
          border: 1px solid #e7e9f1;
          border-radius: 20px;
          box-shadow: 0 18px 55px rgba(33, 39, 58, 0.07);
        }

        .settings-card {
          padding: 18px;
        }

        .section-block {
          margin-bottom: 22px;
        }

        .section-block h2 {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 12px;
          font-size: 13px;
          font-weight: 800;
          color: #202432;
        }

        .section-block h2 span {
          color: #111827;
        }

        .hidden-input {
          display: none;
        }

        .upload-card {
          width: 100%;
          min-height: 134px;
          padding: 10px;
          border: 1.5px dashed #bda9ff;
          border-radius: 13px;
          background: #fbfaff;
          position: relative;
          overflow: hidden;
          color: #686f7f;
        }

        .upload-card:hover {
          border-color: #7e57ff;
          background: #f8f5ff;
        }

        .empty-upload {
          display: flex;
          min-height: 110px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
        }

        .empty-upload svg {
          color: #7555f8;
        }

        .empty-upload strong {
          font-size: 13px;
          color: #2b3040;
        }

        .empty-upload small {
          font-size: 11px;
          color: #8a90a0;
        }

        .upload-card.has-image {
          min-height: 170px;
          padding: 10px;
          display: grid;
          grid-template-rows: 115px auto;
          gap: 10px;
          text-align: left;
        }

        .upload-card img {
          width: 100%;
          height: 115px;
          object-fit: cover;
          border-radius: 10px;
          display: block;
        }

        .edit-image {
          position: absolute;
          right: 18px;
          top: 100px;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #fff;
          background: #7048f5;
          border: 3px solid #fff;
        }

        .file-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .file-details strong {
          color: #353a49;
          font-size: 12px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .file-details small {
          margin-top: 3px;
          color: #8b91a0;
          font-size: 11px;
        }

        .remove-button {
          border: 0;
          padding: 5px 0 0;
          background: transparent;
          color: #ef4b55;
          font-size: 11px;
          font-weight: 800;
          float: right;
        }

        .option-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .format-option {
          min-height: 66px;
          border: 1px solid #e5e7ef;
          border-radius: 11px;
          background: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          color: #818796;
          text-align: left;
        }

        .format-option.selected {
          border-color: #8c70ff;
          background: #f7f4ff;
          color: #6b46e8;
          box-shadow: inset 0 0 0 1px rgba(112, 72, 245, 0.12);
        }

        .format-option strong,
        .format-option small {
          display: block;
        }

        .format-option strong {
          font-size: 11px;
          color: #303544;
        }

        .format-option.selected strong {
          color: #6541dc;
        }

        .format-option small {
          margin-top: 3px;
          font-size: 10px;
          color: #7d8493;
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .style-option {
          min-height: 64px;
          padding: 8px 4px;
          border: 1px solid #e5e7ef;
          border-radius: 11px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #5d6473;
          font-size: 10px;
          font-weight: 700;
        }

        .style-option.selected {
          border-color: #7857ff;
          background: #f7f4ff;
          color: #5f3ed9;
          box-shadow: inset 0 0 0 1px rgba(120, 87, 255, 0.12);
        }

        .select-wrap {
          position: relative;
          margin-bottom: 9px;
        }

        .select-wrap svg {
          pointer-events: none;
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #7e8595;
        }

        select,
        input,
        textarea {
          width: 100%;
          border: 1px solid #dfe3eb;
          border-radius: 9px;
          outline: none;
          background: #fff;
          color: #303544;
          transition: 0.2s ease;
        }

        select {
          appearance: none;
          min-height: 42px;
          padding: 0 38px 0 12px;
          font-size: 12px;
        }

        input {
          min-height: 41px;
          padding: 0 12px;
          font-size: 12px;
        }

        textarea {
          min-height: 74px;
          padding: 11px 12px;
          resize: vertical;
          font-size: 12px;
          line-height: 1.55;
        }

        select:focus,
        input:focus,
        textarea:focus {
          border-color: #8b70f9;
          box-shadow: 0 0 0 3px rgba(120, 87, 255, 0.1);
        }

        .counter {
          margin-top: 5px;
          font-size: 10px;
          color: #9a9faf;
        }

        .field {
          display: block;
          margin-bottom: 10px;
        }

        .field > span {
          display: block;
          margin-bottom: 6px;
          color: #353a49;
          font-size: 11px;
          font-weight: 750;
        }

        .generate-button {
          width: 100%;
          min-height: 46px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(135deg, #693cf4 0%, #b248ef 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 12px 26px rgba(108, 61, 244, 0.25);
          transition: 0.2s ease;
        }

        .generate-button:disabled {
          cursor: wait;
          opacity: 0.72;
        }

        .credit-note {
          margin: 9px 0 0;
          color: #9a9faf;
          text-align: center;
          font-size: 10px;
        }

        .error-box {
          margin: -8px 0 14px;
          border: 1px solid #ffb5bb;
          background: #fff3f4;
          color: #bd303b;
          border-radius: 9px;
          padding: 10px;
          font-size: 11px;
        }

        .preview-card {
          overflow: hidden;
        }

        .preview-toolbar {
          min-height: 70px;
          padding: 13px 17px;
          border-bottom: 1px solid #eceef4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .preview-title {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          color: #7c8392;
          font-size: 12px;
        }

        .preview-title strong {
          color: #2d3240;
        }

        .toolbar-actions button {
          min-height: 40px;
          font-size: 11px;
          box-shadow: none;
        }

        .toolbar-actions .icon-button {
          width: 40px;
          padding: 0;
        }

        .toolbar-actions button:hover {
          border-color: #cfc8f9;
          background: #faf9ff;
        }

        .preview-stage {
          min-height: 735px;
          padding: 18px;
          background:
            linear-gradient(135deg, rgba(250,250,253,.95), rgba(246,247,251,.95)),
            repeating-linear-gradient(45deg, #f5f6fa 0 10px, #f8f9fb 10px 20px);
          display: grid;
          place-items: center;
          overflow: auto;
        }

        .banner-preview {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          background: #111;
          box-shadow: 0 20px 55px rgba(11, 12, 20, 0.22);
        }

        .banner-preview > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(4, 5, 7, .97) 0%, rgba(4, 5, 7, .84) 35%, rgba(4, 5, 7, .20) 75%, rgba(4, 5, 7, .03) 100%),
            linear-gradient(0deg, rgba(0,0,0,.30), rgba(0,0,0,.02));
        }

        .style-minimalist .preview-overlay {
          background: linear-gradient(90deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.82) 43%, rgba(255,255,255,.08) 88%);
        }

        .style-modern .preview-overlay {
          background: linear-gradient(90deg, rgba(12, 17, 28, .96) 0%, rgba(26, 31, 56, .76) 50%, rgba(14, 17, 25, .05) 100%);
        }

        .style-bold .preview-overlay {
          background:
            linear-gradient(90deg, rgba(25, 4, 46, .96), rgba(64, 22, 96, .68) 56%, rgba(0,0,0,.10)),
            linear-gradient(0deg, rgba(119, 36, 255, .22), transparent);
        }

        .ai-badge {
          position: absolute;
          top: 4.4%;
          left: 4.2%;
          border: 1px solid rgba(221, 187, 117, 0.35);
          border-radius: 8px;
          background: rgba(7, 8, 10, 0.46);
          backdrop-filter: blur(8px);
          color: #e4c07a;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          font-size: clamp(8px, 0.8vw, 12px);
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .banner-content {
          position: absolute;
          left: 4.2%;
          top: 17%;
          width: 48%;
          color: #ffffff;
        }

        .banner-content h2 {
          margin: 0;
          max-width: 100%;
          font-size: clamp(25px, 4.3vw, 66px);
          line-height: 0.96;
          letter-spacing: -0.045em;
          text-transform: uppercase;
          font-weight: 900;
          white-space: pre-line;
        }

        .style-minimalist .banner-content {
          color: #111827;
        }

        .style-minimalist .banner-content p,
        .style-minimalist .benefit-list small {
          color: #313744;
        }

        .gold-line {
          margin: clamp(14px, 2vw, 28px) 0;
          width: 46%;
          height: 2px;
          background: linear-gradient(90deg, #d4aa58, transparent);
        }

        .banner-content > p {
          margin: 0;
          max-width: 94%;
          font-size: clamp(11px, 1.55vw, 24px);
          line-height: 1.45;
          color: rgba(255,255,255,.9);
        }

        .benefit-list {
          margin-top: clamp(20px, 3vw, 42px);
          display: grid;
          gap: clamp(12px, 1.7vw, 24px);
        }

        .benefit-list > div {
          display: flex;
          align-items: flex-start;
          gap: clamp(10px, 1.2vw, 16px);
        }

        .benefit-list svg {
          color: #d7ad5c;
          flex: 0 0 auto;
          width: clamp(20px, 2.4vw, 36px);
          height: clamp(20px, 2.4vw, 36px);
        }

        .benefit-list strong,
        .benefit-list small {
          display: block;
        }

        .benefit-list strong {
          color: #d8b062;
          font-size: clamp(8px, 1vw, 15px);
          letter-spacing: 0.02em;
        }

        .benefit-list small {
          margin-top: 4px;
          color: rgba(255,255,255,.92);
          font-size: clamp(7px, 0.9vw, 14px);
          line-height: 1.35;
        }

        .banner-cta {
          margin-top: clamp(20px, 3.2vw, 46px);
          min-height: clamp(38px, 5vw, 72px);
          min-width: 61%;
          border: 0;
          border-radius: clamp(10px, 1.2vw, 18px);
          padding: 0 clamp(14px, 2vw, 28px);
          background: linear-gradient(135deg, #d0a552, #efd38e);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: clamp(8px, 1.05vw, 16px);
          font-weight: 900;
          text-transform: uppercase;
          box-shadow: 0 12px 26px rgba(206, 161, 77, 0.25);
        }

        .preview-placeholder {
          position: absolute;
          inset: 0;
          color: #818797;
          background: #f6f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 9px;
        }

        .preview-placeholder svg {
          color: #866cf7;
        }

        .preview-placeholder strong {
          color: #3c4251;
          font-size: 14px;
        }

        .preview-placeholder span {
          font-size: 12px;
        }

        .preview-tip {
          margin: 16px;
          min-height: 44px;
          border: 1px solid #e5e8f1;
          border-radius: 10px;
          background: #fafbfe;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          color: #777e8d;
          font-size: 11px;
        }

        .preview-tip svg {
          color: #7655f7;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1100px) {
          .studio-shell {
            grid-template-columns: 1fr;
          }

          .settings-card {
            max-width: none;
          }

          .preview-stage {
            min-height: 620px;
          }
        }

        @media (max-width: 760px) {
          .studio-header {
            position: static;
            padding: 18px;
            align-items: flex-start;
            gap: 15px;
          }

          .header-actions {
            width: auto;
          }

          .credit-button {
            display: none;
          }

          .primary-button.compact {
            padding: 0 12px;
            font-size: 11px;
          }

          .studio-shell {
            padding: 12px;
          }

          .settings-card {
            padding: 14px;
            border-radius: 16px;
          }

          .preview-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .toolbar-actions {
            width: 100%;
            overflow-x: auto;
          }

          .toolbar-actions button {
            flex: 0 0 auto;
          }

          .preview-stage {
            min-height: 470px;
            padding: 10px;
          }

          .style-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .banner-content {
            top: 16%;
            width: 58%;
          }

          .benefit-list {
            display: none;
          }

          .banner-cta {
            min-width: 78%;
          }

          .preview-tip {
            line-height: 1.45;
            padding: 10px 12px;
          }
        }

        @media (max-width: 470px) {
          .studio-heading h1 {
            font-size: 21px;
          }

          .studio-heading p {
            display: none;
          }

          .option-grid {
            grid-template-columns: 1fr;
          }

          .preview-stage {
            min-height: 390px;
          }
        }
      `}</style>
    </div>
  );
}
