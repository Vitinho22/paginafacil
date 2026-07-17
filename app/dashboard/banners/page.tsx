"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type FormatName = "Instagram" | "Stories" | "Pinterest" | "YouTube";
type StyleName = "Luxo" | "Minimalista" | "Moderno" | "Impactante";
type GenerationMode = "ai" | "upload";

type BannerFormat = {
  width: number;
  height: number;
  label: string;
  icon: string;
};

const FORMATS: Record<FormatName, BannerFormat> = {
  Instagram: { width: 1080, height: 1080, label: "Post 1080 × 1080", icon: "◎" },
  Stories: { width: 1080, height: 1920, label: "Story 1080 × 1920", icon: "▯" },
  Pinterest: { width: 1000, height: 1500, label: "Pin 1000 × 1500", icon: "P" },
  YouTube: { width: 1280, height: 720, label: "Capa 1280 × 720", icon: "▶" },
};

const STYLES: Record<StyleName, { icon: string; accent: string }> = {
  Luxo: { icon: "◇", accent: "#d9aa55" },
  Minimalista: { icon: "◌", accent: "#f8fafc" },
  Moderno: { icon: "▦", accent: "#8b5cf6" },
  Impactante: { icon: "ϟ", accent: "#f97316" },
};

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
    const maxSide = 2048;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível preparar a imagem.");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png", 0.96),
    );
    if (!blob) throw new Error("Não foi possível converter a imagem.");
    return new File([blob], "imagem-banner.png", { type: "image/png" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
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

export default function BannersPage() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsError, setCreditsError] = useState("");
  const [generationMode, setGenerationMode] = useState<GenerationMode>("ai");
  const [showText, setShowText] = useState(false);
  const [format, setFormat] = useState<FormatName>("Instagram");
  const [style, setStyle] = useState<StyleName>("Luxo");
  const [title, setTitle] = useState("Transforme sua cozinha");
  const [description, setDescription] = useState(
    "Projetos planejados com design exclusivo, funcionalidade e acabamento premium.",
  );
  const [cta, setCta] = useState("Solicite seu orçamento");
  const [idea, setIdea] = useState(
    "Cozinha planejada sofisticada, elegante, iluminação quente, transmitir exclusividade e qualidade premium.",
  );
  const [sourceImage, setSourceImage] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedFormat = FORMATS[format];
  const activeImage = resultImage || sourceImage;
  const accent = STYLES[style].accent;
  const previewRatio = useMemo(
    () => `${selectedFormat.width} / ${selectedFormat.height}`,
    [selectedFormat],
  );

  useEffect(() => {
    return () => {
      if (sourceImage.startsWith("blob:")) URL.revokeObjectURL(sourceImage);
    };
  }, [sourceImage]);

  useEffect(() => {
    let cancelled = false;

    async function loadCredits() {
      if (!user) {
        if (!cancelled) {
          setCredits(null);
          setCreditsError("");
        }
        return;
      }

      try {
        const token = await user.getIdToken();

        const response = await fetch("/api/credits", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const responseText = await response.text();

        if (!responseText.trim()) {
          throw new Error(
            `A API de créditos respondeu vazia. Status ${response.status}.`
          );
        }

        let data: {
          credits?: number;
          error?: string;
        };

        try {
          data = JSON.parse(responseText) as {
            credits?: number;
            error?: string;
          };
        } catch {
          throw new Error(
            `A API de créditos respondeu em formato inválido. Status ${response.status}.`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.error || "Não foi possível carregar os créditos."
          );
        }

        if (!cancelled) {
          setCredits(Number(data.credits ?? 0));
          setCreditsError("");
        }
      } catch (loadError) {
        if (!cancelled) {
          setCredits(null);
          setCreditsError(
            loadError instanceof Error
              ? loadError.message
              : "Erro ao carregar créditos."
          );
        }
      }
    }

    loadCredits();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    event.target.value = "";
    setError("");
    setSuccess("");
    setResultImage("");
    if (!nextFile) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(nextFile.type)) {
      setError("Escolha uma imagem PNG, JPG ou WEBP.");
      return;
    }
    if (nextFile.size > 15 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 15 MB.");
      return;
    }

    try {
      const normalized = await normalizeImage(nextFile);
      if (sourceImage.startsWith("blob:")) URL.revokeObjectURL(sourceImage);
      setFile(normalized);
      setSourceImage(URL.createObjectURL(normalized));
      setSuccess("Imagem carregada. Agora você já pode gerar o banner.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Erro ao carregar a imagem.");
    }
  }

  async function generateWithAI() {
    setError("");
    setSuccess("");

    if (!user) {
      setError("Entre na sua conta para gerar imagens.");
      return;
    }

    if (idea.trim().length < 8) {
      setError("Descreva melhor o visual que deseja criar.");
      return;
    }

    if (generationMode === "upload" && !file) {
      setError("Envie uma imagem para usar o modo de melhoria.");
      inputRef.current?.click();
      return;
    }

    if (credits !== null && credits < 1) {
      setError("Você não possui créditos suficientes para gerar esta imagem.");
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken();
      const body = new FormData();

      body.append("mode", generationMode);
      body.append("idea", idea);
      body.append("style", style);
      body.append("format", format);
      body.append("width", String(selectedFormat.width));
      body.append("height", String(selectedFormat.height));

      if (generationMode === "upload" && file) {
        body.append("image", file);
      }

      const response = await fetch("/api/ai/banner", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error(
          `A API de banners respondeu vazia. Status ${response.status}.`
        );
      }

      let payload: {
        imageUrl?: string;
        remainingCredits?: number;
        error?: string;
      };

      try {
        payload = JSON.parse(responseText) as {
          imageUrl?: string;
          remainingCredits?: number;
          error?: string;
        };
      } catch {
        throw new Error(
          `A API de banners respondeu em formato inválido. Status ${response.status}.`
        );
      }

      if (!response.ok || !payload.imageUrl) {
        throw new Error(
          payload.error || "Não foi possível gerar a imagem."
        );
      }

      setResultImage(payload.imageUrl);

      if (typeof payload.remainingCredits === "number") {
        setCredits(payload.remainingCredits);
      }

      setSuccess(
        generationMode === "ai"
          ? "Imagem criada com IA. 1 crédito foi utilizado."
          : "Imagem melhorada com sucesso. 1 crédito foi utilizado."
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao gerar a imagem."
      );
    } finally {
      setLoading(false);
    }
  }

  async function drawBanner() {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas indisponível.");
    const { width, height } = selectedFormat;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível preparar o PNG.");

    ctx.fillStyle = "#090b10";
    ctx.fillRect(0, 0, width, height);

    if (activeImage) {
      const image = await loadImage(activeImage);
      const scale = Math.max(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    }

    if (!showText) return canvas;

    const horizontal = width > height;
    const gradient = horizontal
      ? ctx.createLinearGradient(0, 0, width * 0.78, 0)
      : ctx.createLinearGradient(0, height, 0, height * 0.18);
    gradient.addColorStop(0, "rgba(2,5,10,.97)");
    gradient.addColorStop(0.6, "rgba(2,5,10,.68)");
    gradient.addColorStop(1, "rgba(2,5,10,.04)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const padding = Math.round(width * 0.07);
    const contentWidth = horizontal ? width * 0.53 : width - padding * 2;
    let y = horizontal ? height * 0.21 : height * 0.49;

    ctx.textBaseline = "top";
    ctx.fillStyle = accent;
    ctx.font = `800 ${Math.round(width * 0.018)}px Arial, sans-serif`;
    ctx.fillText("✦ GERADO POR IA", padding, y);

    const titleSize = Math.round(width * (horizontal ? 0.062 : 0.074));
    ctx.font = `900 ${titleSize}px Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    y += titleSize * 0.86;
    for (const line of wrapText(ctx, title || "Seu título", contentWidth).slice(0, 4)) {
      ctx.fillText(line.toUpperCase(), padding, y);
      y += titleSize * 1.02;
    }

    ctx.fillStyle = accent;
    ctx.fillRect(padding, y + titleSize * 0.1, Math.min(contentWidth * 0.52, width * 0.35), 4);
    y += titleSize * 0.42;

    const descriptionSize = Math.round(width * 0.026);
    ctx.font = `500 ${descriptionSize}px Arial, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,.88)";
    for (const line of wrapText(ctx, description, contentWidth).slice(0, 4)) {
      ctx.fillText(line, padding, y);
      y += descriptionSize * 1.35;
    }

    y += descriptionSize;
    const buttonFont = Math.round(width * 0.021);
    ctx.font = `800 ${buttonFont}px Arial, sans-serif`;
    const buttonText = (cta || "SAIBA MAIS").toUpperCase();
    const buttonWidth = ctx.measureText(buttonText).width + width * 0.095;
    const buttonHeight = buttonFont * 2.8;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.roundRect(padding, y, buttonWidth, buttonHeight, buttonHeight * 0.28);
    ctx.fill();
    ctx.fillStyle = style === "Minimalista" ? "#111827" : "#ffffff";
    ctx.fillText(buttonText, padding + width * 0.045, y + buttonFont * 0.82);

    return canvas;
  }

  async function downloadBanner() {
    if (!activeImage) {
      setError("Envie uma imagem antes de baixar.");
      return;
    }
    setError("");
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
    <main className="banner-page">
      <header className="studio-header">
        <div className="studio-title">
          <span className="title-icon">✦</span>
          <div>
            <h1>Banner Studio</h1>
            <p>Crie banners profissionais com IA em segundos</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="credit-pill">
            <span>ϟ</span>
            Créditos: {credits === null ? "..." : credits}
          </div>
          <button className="icon-button" aria-label="Notificações">♧<i /></button>
          <button className="new-project" onClick={() => inputRef.current?.click()}>＋ Novo projeto</button>
        </div>
      </header>

      <div className="workspace">
        <aside className="controls-panel">
          <section className="control-section">
            <h2>1. Como deseja criar?</h2>

            <div className="creation-mode">
              <button
                type="button"
                className={generationMode === "ai" ? "active" : ""}
                onClick={() => {
                  setGenerationMode("ai");
                  setResultImage("");
                  setError("");
                  setSuccess("");
                }}
              >
                <span>✦</span>
                <div>
                  <b>Criar do zero com IA</b>
                  <small>Não exige imagem</small>
                </div>
              </button>

              <button
                type="button"
                className={generationMode === "upload" ? "active" : ""}
                onClick={() => {
                  setGenerationMode("upload");
                  setResultImage("");
                  setError("");
                  setSuccess("");
                }}
              >
                <span>＋</span>
                <div>
                  <b>Melhorar minha imagem</b>
                  <small>Use sua própria foto</small>
                </div>
              </button>
            </div>

            {generationMode === "upload" && (
              <>
                <input
                  ref={inputRef}
                  className="hidden-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFile}
                />

                <button
                  className={`upload-card ${sourceImage ? "has-image" : ""}`}
                  onClick={() => inputRef.current?.click()}
                  type="button"
                >
                  {sourceImage ? (
                    <>
                      <img src={sourceImage} alt="Imagem principal" />
                      <span className="edit-image">✎</span>
                      <div className="file-meta">
                        <span>{file?.name || "imagem-banner.png"}</span>
                        <small>
                          {file
                            ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                            : "Imagem carregada"}
                        </small>
                      </div>
                    </>
                  ) : (
                    <span className="upload-empty">
                      <b>＋</b>
                      Enviar foto
                      <small>PNG, JPG ou WEBP · até 15 MB</small>
                    </span>
                  )}
                </button>

                {sourceImage && (
                  <button
                    className="remove-image"
                    onClick={() => {
                      setFile(null);
                      setSourceImage("");
                      setResultImage("");
                    }}
                  >
                    Remover
                  </button>
                )}
              </>
            )}
          </section>

          <section className="control-section">
            <h2>2. Formato</h2>
            <div className="format-grid">
              {(Object.keys(FORMATS) as FormatName[]).map((name) => (
                <button key={name} type="button" className={format === name ? "active" : ""} onClick={() => setFormat(name)}>
                  <span>{FORMATS[name].icon}</span>
                  <div><b>{name === "Instagram" ? "Instagram Post" : name}</b><small>{FORMATS[name].label.replace(/^[^0-9]+/, "")}</small></div>
                </button>
              ))}
            </div>
          </section>

          <section className="control-section">
            <h2>3. Estilo</h2>
            <div className="style-grid">
              {(Object.keys(STYLES) as StyleName[]).map((name) => (
                <button key={name} type="button" className={style === name ? "active" : ""} onClick={() => setStyle(name)}>
                  <span>{STYLES[name].icon}</span><small>{name}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="control-section">
            <h2>4. Descreva sua ideia</h2>
            <textarea maxLength={500} value={idea} onChange={(event) => setIdea(event.target.value)} />
            <div className="counter">{idea.length}/500</div>
          </section>

          <section className="control-section">
            <h2>5. Textos opcionais</h2>

            <label className="text-switch">
              <input
                type="checkbox"
                checked={showText}
                onChange={(event) => setShowText(event.target.checked)}
              />
              <span>
                <b>Adicionar textos sobre a imagem</b>
                <small>Desmarcado: o PNG será baixado apenas com a imagem.</small>
              </span>
            </label>

            {showText && (
              <>
                <label>Título principal</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />

                <label>Subtítulo</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />

                <label>Chamada para ação</label>
                <input
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                />
              </>
            )}
          </section>

          <button className="generate-button" type="button" onClick={generateWithAI} disabled={loading}>
            <span>✦</span>{loading ? "Gerando imagem..." : generationMode === "ai" ? "Criar imagem com IA" : "Melhorar imagem com IA"}
          </button>
          <p className="credits-note">
            {creditsError
              ? "Não foi possível carregar os créditos."
              : `◉ Créditos disponíveis: ${credits === null ? "..." : credits}`}
          </p>
          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <span>Preview <i>•</i> {format === "Instagram" ? "Instagram Post" : format} {selectedFormat.width} × {selectedFormat.height}</span>
            <div>
              <button type="button">Tt&nbsp; Editar textos</button>
              <button type="button" onClick={downloadBanner} disabled={exporting || !activeImage}>⇩&nbsp; {exporting ? "Preparando" : "Baixar PNG"}</button>
              <button className="more-button" type="button">⋮</button>
            </div>
          </div>

          <div className="preview-stage">
            <article className={`live-banner style-${style.toLowerCase()}`} style={{ aspectRatio: previewRatio, backgroundImage: activeImage ? `url(${activeImage})` : undefined, "--accent": accent } as React.CSSProperties}>
              {!activeImage ? (
                <div className="empty-preview">
                  <span>✦</span>
                  <b>
                    {generationMode === "ai"
                      ? "Descreva sua ideia e gere a imagem"
                      : "Envie uma imagem para começar"}
                  </b>
                  <small>
                    {generationMode === "ai"
                      ? "A IA criará a imagem do zero."
                      : "A IA poderá melhorar sua foto."}
                  </small>
                </div>
              ) : (
                showText && (
                  <>
                    <div className="dark-overlay" />
                    <div className="banner-copy">
                      <h2>{title || "Seu título"}</h2>
                      <div className="gold-line" />
                      <p>{description}</p>
                      {cta.trim() && (
                        <button type="button">
                          {(cta || "SAIBA MAIS").toUpperCase()} <span>›</span>
                        </button>
                      )}
                    </div>
                  </>
                )
              )}
            </article>
          </div>

          <div className="tip-box">▱ <span>A imagem é gerada sem letras. Os textos são opcionais.</span></div>
        </section>
      </div>
      <canvas ref={canvasRef} hidden />

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; background: #f6f7fb; }
        button, input, textarea { font: inherit; }
        .banner-page { min-height: 100vh; padding: 24px 28px 28px; color: #111827; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .studio-header { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 26px; }
        .studio-title { display: flex; align-items: center; gap: 14px; }
        .title-icon { color: #7657ff; font-size: 29px; }
        .studio-title h1 { margin: 0; font-size: clamp(25px, 2vw, 34px); letter-spacing: -.04em; font-weight: 850; }
        .studio-title p { margin: 4px 0 0; color: #667085; font-size: 13px; }
        .header-actions { display: flex; align-items: center; gap: 12px; }
        .credit-pill, .icon-button, .new-project { height: 48px; border: 1px solid #e5e7eb; border-radius: 13px; background: #fff; box-shadow: 0 8px 20px rgba(31,41,55,.04); }
        .credit-pill { display: flex; align-items: center; gap: 10px; padding: 0 18px; font-weight: 750; font-size: 13px; }
        .credit-pill span { color: #f5a524; font-size: 20px; }
        .icon-button { width: 48px; position: relative; font-size: 19px; }
        .icon-button i { position: absolute; right: 9px; top: 7px; width: 8px; height: 8px; border-radius: 999px; background: #ef4444; border: 2px solid white; }
        .new-project { border: 0; padding: 0 20px; color: white; font-weight: 800; background: linear-gradient(135deg,#7147ff,#a777ff); box-shadow: 0 12px 28px rgba(116,71,255,.24); cursor: pointer; }
        .workspace { display: grid; grid-template-columns: minmax(310px, 380px) minmax(0, 1fr); gap: 20px; align-items: stretch; }
        .controls-panel, .preview-panel { background: rgba(255,255,255,.96); border: 1px solid #e6e8ef; border-radius: 20px; box-shadow: 0 14px 42px rgba(31,41,55,.07); }
        .controls-panel { padding: 22px; }
        .control-section { position: relative; margin-bottom: 21px; }
        .control-section h2 { margin: 0 0 12px; font-size: 13px; font-weight: 850; }
        .control-section label { display: block; margin: 12px 0 6px; font-size: 11px; font-weight: 750; color: #344054; }
        .creation-mode { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 12px; }
        .creation-mode button { min-height: 78px; display: flex; align-items: flex-start; gap: 10px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 11px; background: white; text-align: left; cursor: pointer; }
        .creation-mode button.active { border-color: #7657ff; background: #f8f6ff; box-shadow: 0 0 0 2px rgba(118,87,255,.08); }
        .creation-mode button > span { color: #7657ff; font-size: 20px; font-weight: 900; }
        .creation-mode b, .creation-mode small { display: block; }
        .creation-mode b { color: #344054; font-size: 11px; }
        .creation-mode small { margin-top: 4px; color: #98a2b3; font-size: 10px; }
        .text-switch { display: flex !important; align-items: flex-start; gap: 10px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fafbff; }
        .text-switch input { width: 17px !important; height: 17px !important; margin: 1px 0 0; accent-color: #7657ff; }
        .text-switch b, .text-switch small { display: block; }
        .text-switch b { color: #344054; font-size: 11px; }
        .text-switch small { margin-top: 4px; color: #98a2b3; font-size: 10px; line-height: 1.4; }
        .hidden-input { display: none; }
        .upload-card { width: 100%; min-height: 118px; padding: 10px; border: 1.5px dashed #cfc4ff; border-radius: 13px; background: #fbfaff; cursor: pointer; overflow: hidden; position: relative; text-align: left; }
        .upload-card.has-image { min-height: 170px; padding: 0; border-style: solid; }
        .upload-card img { display: block; width: 100%; height: 130px; object-fit: cover; }
        .upload-empty { min-height: 96px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; color: #4f46e5; font-weight: 800; }
        .upload-empty b { font-size: 26px; }
        .upload-empty small { color: #98a2b3; font-weight: 500; }
        .edit-image { position: absolute; right: 11px; top: 104px; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 999px; color: white; background: linear-gradient(135deg,#6d4aff,#9b63ff); box-shadow: 0 7px 16px rgba(109,74,255,.3); }
        .file-meta { display: flex; justify-content: space-between; padding: 10px 12px; gap: 8px; background: white; }
        .file-meta span { max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: #344054; }
        .file-meta small { color: #98a2b3; }
        .remove-image { position: absolute; right: 4px; bottom: -18px; border: 0; background: transparent; color: #ef4444; font-size: 11px; cursor: pointer; }
        .format-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; }
        .format-grid button { min-height: 64px; display: flex; align-items: center; gap: 10px; padding: 10px 11px; border: 1px solid #e5e7eb; border-radius: 10px; background: white; text-align: left; cursor: pointer; transition: .18s ease; }
        .format-grid button:hover, .format-grid button.active { border-color: #8b70ff; background: #f8f6ff; box-shadow: 0 0 0 2px rgba(139,112,255,.08); }
        .format-grid button > span { color: #7463ff; font-weight: 900; font-size: 18px; }
        .format-grid b { display: block; font-size: 11px; color: #4738c7; }
        .format-grid small { display: block; margin-top: 2px; color: #667085; font-size: 10px; }
        .style-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 8px; }
        .style-grid button { min-height: 66px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; border: 1px solid #e5e7eb; border-radius: 10px; background: white; cursor: pointer; }
        .style-grid button.active { border-color: #7657ff; background: #faf8ff; box-shadow: 0 0 0 2px rgba(118,87,255,.08); }
        .style-grid span { font-size: 20px; }
        .style-grid small { font-size: 9px; color: #344054; }
        .control-section input, .control-section textarea { width: 100%; border: 1px solid #dfe3ea; border-radius: 9px; background: #fff; color: #344054; outline: none; transition: .18s ease; }
        .control-section input { height: 39px; padding: 0 11px; font-size: 11px; }
        .control-section textarea { min-height: 66px; resize: vertical; padding: 10px 11px; line-height: 1.5; font-size: 11px; }
        .control-section input:focus, .control-section textarea:focus { border-color: #8b70ff; box-shadow: 0 0 0 3px rgba(139,112,255,.09); }
        .counter { margin-top: 5px; color: #98a2b3; font-size: 10px; }
        .generate-button { width: 100%; min-height: 49px; border: 0; border-radius: 11px; background: linear-gradient(90deg,#6538ff,#d648df); color: white; font-weight: 850; cursor: pointer; box-shadow: 0 12px 26px rgba(126,67,233,.23); }
        .generate-button:disabled { opacity: .58; cursor: wait; }
        .generate-button span { margin-right: 10px; }
        .credits-note { margin: 10px 0 0; color: #98a2b3; font-size: 10px; text-align: center; }
        .message { margin-top: 11px; padding: 10px 12px; border-radius: 9px; font-size: 11px; line-height: 1.45; }
        .message.error { color: #b42318; background: #fff1f0; border: 1px solid #fecdca; }
        .message.success { color: #067647; background: #ecfdf3; border: 1px solid #abefc6; }
        .preview-panel { min-width: 0; padding: 18px; display: flex; flex-direction: column; }
        .preview-toolbar { min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 0 2px 15px; color: #475467; font-size: 12px; }
        .preview-toolbar i { margin: 0 5px; font-style: normal; color: #98a2b3; }
        .preview-toolbar > div { display: flex; gap: 9px; }
        .preview-toolbar button { height: 39px; padding: 0 14px; border: 1px solid #e3e6ec; border-radius: 10px; background: white; color: #344054; font-weight: 750; font-size: 11px; cursor: pointer; box-shadow: 0 4px 12px rgba(31,41,55,.035); }
        .preview-toolbar button:disabled { opacity: .5; cursor: not-allowed; }
        .preview-toolbar .more-button { width: 40px; padding: 0; font-size: 20px; }
        .preview-stage { flex: 1; min-height: 620px; display: grid; place-items: center; border-radius: 14px; background: #f8f9fc; overflow: auto; padding: 18px; }
        .live-banner { --accent: #d9aa55; width: min(100%, 860px); max-height: 790px; position: relative; overflow: hidden; border-radius: 5px; background-color: #111827; background-size: cover; background-position: center; box-shadow: 0 18px 48px rgba(17,24,39,.18); }
        .dark-overlay { position: absolute; inset: 0; background: linear-gradient(90deg,rgba(1,4,8,.96) 0%,rgba(1,4,8,.78) 43%,rgba(1,4,8,.13) 74%,rgba(1,4,8,.02) 100%); }
        .ai-label { position: absolute; left: 4.2%; top: 4.2%; z-index: 2; padding: 8px 12px; border: 1px solid rgba(255,255,255,.22); border-radius: 8px; color: #fff; background: rgba(0,0,0,.28); font-size: clamp(7px, .75vw, 12px); font-weight: 800; }
        .banner-copy { position: absolute; z-index: 2; left: 4.4%; top: 17%; width: 48%; color: white; }
        .banner-copy h2 { margin: 0; max-width: 100%; font-size: clamp(25px, 4.1vw, 67px); line-height: .96; letter-spacing: -.045em; text-transform: uppercase; font-weight: 950; }
        .gold-line { width: 58%; height: 2px; margin: 22px 0 20px; background: var(--accent); }
        .banner-copy > p { margin: 0; font-size: clamp(10px, 1.35vw, 22px); line-height: 1.45; color: rgba(255,255,255,.9); }
        .banner-copy ul { display: grid; gap: clamp(11px,1.5vw,23px); list-style: none; padding: 0; margin: clamp(18px,2.3vw,35px) 0; }
        .banner-copy li { display: flex; gap: 13px; align-items: flex-start; }
        .banner-copy li > span { min-width: 28px; color: var(--accent); font-size: clamp(18px,2vw,31px); line-height: 1; }
        .banner-copy li b { display: block; margin-bottom: 3px; color: var(--accent); font-size: clamp(8px,1vw,15px); }
        .banner-copy li small { display: block; color: rgba(255,255,255,.88); font-size: clamp(7px,.9vw,14px); line-height: 1.3; }
        .banner-copy > button { min-height: clamp(38px,5vw,64px); padding: 0 clamp(16px,2.8vw,42px); border: 0; border-radius: 12px; color: white; background: var(--accent); font-size: clamp(8px,1.05vw,16px); font-weight: 900; box-shadow: 0 9px 23px rgba(0,0,0,.22); }
        .banner-copy > button span { margin-left: 12px; font-size: 1.5em; vertical-align: -.08em; }
        .style-minimalista .dark-overlay { background: linear-gradient(90deg,rgba(255,255,255,.95),rgba(255,255,255,.76) 48%,rgba(255,255,255,.05)); }
        .style-minimalista .banner-copy, .style-minimalista .ai-label { color: #111827; }
        .style-minimalista .banner-copy > p, .style-minimalista .banner-copy li small { color: #344054; }
        .style-minimalista .ai-label { background: rgba(255,255,255,.55); border-color: rgba(17,24,39,.18); }
        .style-minimalista .banner-copy > button { color: #111827; border: 1px solid #d0d5dd; }
        .style-moderno .dark-overlay { background: linear-gradient(110deg,rgba(17,11,42,.95),rgba(75,33,160,.69) 45%,rgba(3,7,18,.12) 75%); }
        .style-impactante .dark-overlay { background: linear-gradient(105deg,rgba(0,0,0,.95),rgba(91,24,4,.8) 52%,rgba(0,0,0,.04)); }
        .empty-preview { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; color: #98a2b3; background: linear-gradient(145deg,#111827,#1f2937); }
        .empty-preview span { font-size: 44px; color: #8b70ff; }
        .empty-preview b { color: white; }
        .empty-preview small { font-size: 12px; }
        .tip-box { margin-top: 16px; min-height: 47px; display: flex; align-items: center; gap: 10px; padding: 0 15px; border: 1px solid #e5e7eb; border-radius: 11px; background: #fafbff; color: #7557ff; font-size: 12px; }
        .tip-box span { color: #667085; }
        @media (max-width: 1100px) {
          .workspace { grid-template-columns: 340px minmax(0,1fr); }
          .preview-stage { min-height: 540px; }
          .banner-copy { width: 55%; }
        }
        @media (max-width: 900px) {
          .banner-page { padding: 18px; }
          .studio-header { align-items: flex-start; }
          .header-actions { flex-wrap: wrap; justify-content: flex-end; }
          .credit-pill { display: none; }
          .workspace { grid-template-columns: 1fr; }
          .controls-panel { order: 2; }
          .preview-panel { order: 1; }
          .preview-stage { min-height: 0; }
        }
        @media (max-width: 620px) {
          .banner-page { padding: 13px; }
          .studio-header { flex-direction: column; }
          .header-actions { width: 100%; justify-content: space-between; }
          .new-project { flex: 1; }
          .controls-panel, .preview-panel { border-radius: 15px; }
          .preview-toolbar { align-items: flex-start; flex-direction: column; }
          .preview-toolbar > div { width: 100%; }
          .preview-toolbar button { flex: 1; padding: 0 8px; }
          .preview-toolbar .more-button { flex: 0 0 40px; }
          .preview-stage { padding: 8px; }
          .banner-copy { width: 61%; top: 15%; }
          .banner-copy ul { display: none; }
          .gold-line { margin: 12px 0; }
          .banner-copy > button { margin-top: 17px; border-radius: 8px; }
          .creation-mode { grid-template-columns: 1fr; }
          .style-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>
    </main>
  );
}