"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type FormatName = "Instagram" | "Stories" | "Pinterest" | "YouTube";

type BannerFormat = {
  width: number;
  height: number;
  label: string;
};

const FORMATS: Record<FormatName, BannerFormat> = {
  Instagram: { width: 1080, height: 1080, label: "Post 1080 × 1080" },
  Stories: { width: 1080, height: 1920, label: "Story 1080 × 1920" },
  Pinterest: { width: 1000, height: 1500, label: "Pin 1000 × 1500" },
  YouTube: { width: 1280, height: 720, label: "Capa 1280 × 720" },
};

const OBJECTIVES = [
  "Promover produto ou serviço",
  "Gerar visitas ao site",
  "Divulgar uma promoção",
  "Apresentar minha empresa",
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    image.src = src;
  });
}


async function normalizeImage(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const maxSide = 1536;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível preparar a imagem.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.96));
    if (!blob) throw new Error("Não foi possível converter a imagem.");
    return new File([blob], "imagem-banner.png", { type: "image/png" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth || !current) current = test;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export default function Banners() {
  const [format, setFormat] = useState<FormatName>("Instagram");
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [title, setTitle] = useState("Seu negócio merece mais destaque.");
  const [description, setDescription] = useState("Uma comunicação profissional para apresentar sua marca e conquistar novos clientes.");
  const [cta, setCta] = useState("CONHEÇA AGORA");
  const [idea, setIdea] = useState("Transforme esta foto em uma campanha elegante, moderna e chamativa, com iluminação profissional e espaço para o texto.");
  const [sourceImage, setSourceImage] = useState<string>("");
  const [resultImage, setResultImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedFormat = FORMATS[format];
  const activeImage = resultImage || sourceImage;
  const previewClass = useMemo(() => `banner-live-preview format-${format.toLowerCase()}`, [format]);

  useEffect(() => {
    return () => {
      if (sourceImage.startsWith("blob:")) URL.revokeObjectURL(sourceImage);
    };
  }, [sourceImage]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    setError("");
    setSuccess("");
    setResultImage("");
    if (!nextFile) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(nextFile.type)) {
      setError("Escolha uma imagem PNG, JPG ou WEBP.");
      return;
    }
    if (nextFile.size > 15 * 1024 * 1024) {
      setError("A imagem original deve ter no máximo 15 MB.");
      return;
    }
    try {
      const normalized = await normalizeImage(nextFile);
      if (sourceImage.startsWith("blob:")) URL.revokeObjectURL(sourceImage);
      setFile(normalized);
      setSourceImage(URL.createObjectURL(normalized));
      setSuccess("Imagem carregada. Agora descreva o resultado e clique em gerar com IA.");
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Não foi possível preparar a imagem.");
    } finally {
      event.target.value = "";
    }
  }

  async function generateWithAI() {
    setError("");
    setSuccess("");
    if (!file) {
      setError("Primeiro, envie a imagem que será usada no banner.");
      inputRef.current?.click();
      return;
    }
    if (idea.trim().length < 8) {
      setError("Explique um pouco melhor como você quer o banner.");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      body.append("idea", idea);
      body.append("objective", objective);
      body.append("format", format);

      const response = await fetch("/api/ai/banner", { method: "POST", body });
      const payload = (await response.json()) as { imageUrl?: string; error?: string };
      if (!response.ok || !payload.imageUrl) throw new Error(payload.error || "Não foi possível gerar o banner.");
      setResultImage(payload.imageUrl);
      setSuccess("A imagem foi ajustada pela IA. Agora revise o texto e baixe o banner.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao gerar o banner.");
    } finally {
      setLoading(false);
    }
  }

  async function drawBanner(): Promise<HTMLCanvasElement> {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas indisponível.");
    const { width, height } = selectedFormat;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível preparar o arquivo.");

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    if (activeImage) {
      const image = await loadImage(activeImage);
      const scale = Math.max(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      ctx.drawImage(image, x, y, drawWidth, drawHeight);
    }

    const horizontal = width > height;
    const gradient = horizontal
      ? ctx.createLinearGradient(0, 0, width * 0.78, 0)
      : ctx.createLinearGradient(0, height, 0, height * 0.2);
    gradient.addColorStop(0, "rgba(7,10,24,.94)");
    gradient.addColorStop(0.56, "rgba(17,24,39,.70)");
    gradient.addColorStop(1, "rgba(17,24,39,.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const padding = Math.round(width * 0.075);
    const contentWidth = horizontal ? width * 0.52 : width - padding * 2;
    const baseY = horizontal ? height * 0.23 : height * 0.53;

    ctx.textBaseline = "top";
    ctx.fillStyle = "#7ef3df";
    ctx.font = `800 ${Math.round(width * 0.024)}px Arial, sans-serif`;
    ctx.fillText(objective.toUpperCase(), padding, baseY);

    const titleSize = Math.round(width * (horizontal ? 0.061 : 0.072));
    ctx.font = `900 ${titleSize}px Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    const titleLines = wrapText(ctx, title || "Seu título", contentWidth).slice(0, 4);
    let cursorY = baseY + titleSize * 0.9;
    const titleLineHeight = titleSize * 1.02;
    for (const line of titleLines) {
      ctx.fillText(line, padding, cursorY);
      cursorY += titleLineHeight;
    }

    const descriptionSize = Math.round(width * 0.027);
    ctx.font = `500 ${descriptionSize}px Arial, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,.86)";
    cursorY += descriptionSize * 0.5;
    const descriptionLines = wrapText(ctx, description, contentWidth).slice(0, 4);
    for (const line of descriptionLines) {
      ctx.fillText(line, padding, cursorY);
      cursorY += descriptionSize * 1.35;
    }

    cursorY += descriptionSize * 0.9;
    const buttonFont = Math.round(width * 0.023);
    ctx.font = `900 ${buttonFont}px Arial, sans-serif`;
    const buttonText = (cta || "SAIBA MAIS").toUpperCase();
    const buttonWidth = ctx.measureText(buttonText).width + width * 0.065;
    const buttonHeight = buttonFont * 2.5;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(padding, cursorY, buttonWidth, buttonHeight, buttonHeight * 0.25);
    ctx.fill();
    ctx.fillStyle = "#161b2e";
    ctx.fillText(buttonText, padding + width * 0.0325, cursorY + buttonFont * 0.72);

    return canvas;
  }

  async function downloadBanner() {
    setError("");
    setSuccess("");
    if (!activeImage) {
      setError("Envie uma imagem antes de baixar o banner.");
      return;
    }
    setExporting(true);
    try {
      const canvas = await drawBanner();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1));
      if (!blob) throw new Error("Não foi possível criar o arquivo PNG.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `banner-${format.toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setSuccess(`Banner baixado em ${selectedFormat.width} × ${selectedFormat.height}px.`);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Erro ao baixar o banner.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <header className="premium-top">
        <div>
          <small>DESIGN COM IA REAL</small>
          <h1>Banner Studio</h1>
          <p>Envie sua foto, explique a ideia e receba uma arte pronta para publicar.</p>
        </div>
        <button className="premium-primary" onClick={() => inputRef.current?.click()}>＋ Enviar imagem</button>
      </header>

      <div className="studio-layout banner-studio-layout">
        <section className="studio-form">
          <span className="studio-badge">01</span>
          <h2>Crie seu banner</h2>

          <label>1. Imagem principal</label>
          <input ref={inputRef} className="banner-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} />
          <button type="button" className="banner-upload-box" onClick={() => inputRef.current?.click()}>
            {sourceImage ? <img src={sourceImage} alt="Imagem enviada" /> : <span>↑<b>Enviar foto do produto ou serviço</b><small>PNG, JPG ou WEBP • até 10 MB</small></span>}
          </button>

          <label>2. Formato</label>
          <div className="choice-grid">
            {(Object.keys(FORMATS) as FormatName[]).map((name) => (
              <button type="button" onClick={() => setFormat(name)} className={format === name ? "selected" : ""} key={name}>
                {name}<small>{FORMATS[name].label}</small>
              </button>
            ))}
          </div>

          <label>3. Objetivo</label>
          <select value={objective} onChange={(event) => setObjective(event.target.value)}>
            {OBJECTIVES.map((item) => <option key={item}>{item}</option>)}
          </select>

          <label>4. Explique o visual desejado</label>
          <textarea value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Ex.: deixe a foto sofisticada, com fundo de mármore e iluminação de estúdio..." />

          <button type="button" className="generate-button" disabled={loading} onClick={generateWithAI}>
            {loading ? "A IA está ajustando sua imagem..." : "✦ Gerar imagem do banner com IA"}
          </button>

          <div className="banner-divider"><span>TEXTOS DO BANNER</span></div>
          <label>Título principal</label>
          <textarea value={title} onChange={(event) => setTitle(event.target.value)} />
          <label>Descrição</label>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          <label>Chamada para ação</label>
          <input value={cta} onChange={(event) => setCta(event.target.value)} />

          {error && <div className="banner-message is-error">{error}</div>}
          {success && <div className="banner-message is-success">{success}</div>}
        </section>

        <section className="studio-preview">
          <div className="preview-toolbar">
            <span>{selectedFormat.label} • Prévia ao vivo</span>
            <button type="button" onClick={() => setResultImage("")} disabled={!resultImage}>Usar foto original</button>
          </div>

          <div className="banner-canvas banner-preview-area">
            <div className={previewClass} style={activeImage ? { backgroundImage: `url(${activeImage})` } : undefined}>
              {!activeImage && <div className="banner-empty-state"><b>Envie uma foto</b><span>A imagem aparecerá aqui e poderá ser melhorada pela IA.</span></div>}
              {activeImage && <div className="banner-preview-overlay">
                <small>{objective}</small>
                <h2>{title || "Seu título"}</h2>
                <p>{description}</p>
                <button>{(cta || "SAIBA MAIS").toUpperCase()} →</button>
                {resultImage && <em>IMAGEM AJUSTADA PELA IA</em>}
              </div>}
            </div>
          </div>

          <div className="preview-bottom">
            <span>PNG em alta qualidade • texto nítido e editável</span>
            <button type="button" onClick={downloadBanner} disabled={exporting || !activeImage}>
              {exporting ? "Preparando..." : "Baixar banner PNG"}
            </button>
          </div>
        </section>
      </div>
      <canvas ref={canvasRef} hidden />
    </>
  );
}
