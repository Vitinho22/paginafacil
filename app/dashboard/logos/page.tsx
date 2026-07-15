"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

const STYLES = ["Minimalista", "Luxo", "Moderno", "Criativo"];
const PALETTES = [
  { name: "Roxo premium", value: "roxo profundo, lilás e branco", primary: "#7657ef", dark: "#161b2e" },
  { name: "Azul confiança", value: "azul marinho, azul vivo e branco", primary: "#2563eb", dark: "#0f172a" },
  { name: "Verde elegante", value: "verde esmeralda, verde escuro e branco", primary: "#059669", dark: "#052e2b" },
  { name: "Dourado luxo", value: "dourado, preto e creme", primary: "#b78a35", dark: "#17130d" },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar o símbolo."));
    image.src = src;
  });
}

export default function Logos() {
  const [name, setName] = useState("Aurora Studio");
  const [segment, setSegment] = useState("Design e comunicação");
  const [slogan, setSlogan] = useState("Ideias que ganham forma");
  const [style, setStyle] = useState("Minimalista");
  const [palette, setPalette] = useState(PALETTES[0]);
  const [idea, setIdea] = useState("Símbolo abstrato elegante, simples e memorável.");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => () => {
    if (symbol.startsWith("blob:")) URL.revokeObjectURL(symbol);
  }, [symbol]);

  async function generateLogo() {
    setError("");
    setSuccess("");
    if (name.trim().length < 2 || segment.trim().length < 2) {
      setError("Informe o nome e o segmento da marca.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/ai/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, segment, style, colors: palette.value, idea }),
      });
      const payload = (await response.json()) as { imageUrl?: string; error?: string };
      if (!response.ok || !payload.imageUrl) throw new Error(payload.error || "Não foi possível gerar o logo.");
      if (symbol.startsWith("blob:")) URL.revokeObjectURL(symbol);
      setSymbol(payload.imageUrl);
      setSuccess("Símbolo criado. O nome e o slogan continuam nítidos e editáveis.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao gerar o logo.");
    } finally {
      setLoading(false);
    }
  }

  function uploadSymbol(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    setSuccess("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Envie um símbolo PNG, JPG ou WEBP.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 8 MB.");
      return;
    }
    if (symbol.startsWith("blob:")) URL.revokeObjectURL(symbol);
    setSymbol(URL.createObjectURL(file));
    setSuccess("Símbolo enviado. Agora personalize o nome e baixe o logo.");
    event.target.value = "";
  }

  async function downloadLogo() {
    setError("");
    setSuccess("");
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      canvas.width = 1600;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Não foi possível preparar o arquivo.");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const symbolSize = 330;
      const symbolX = 635;
      const symbolY = 130;
      if (symbol) {
        const image = await loadImage(symbol);
        const scale = Math.min(symbolSize / image.width, symbolSize / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        ctx.drawImage(image, symbolX + (symbolSize - width) / 2, symbolY + (symbolSize - height) / 2, width, height);
      } else {
        const gradient = ctx.createLinearGradient(symbolX, symbolY, symbolX + symbolSize, symbolY + symbolSize);
        gradient.addColorStop(0, palette.dark);
        gradient.addColorStop(1, palette.primary);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(symbolX, symbolY, symbolSize, symbolSize, 92);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "900 175px Arial, sans-serif";
        ctx.fillText((name.trim()[0] || "M").toUpperCase(), symbolX + symbolSize / 2, symbolY + symbolSize / 2 + 4);
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = palette.dark;
      ctx.font = "900 104px Arial, sans-serif";
      ctx.fillText(name.trim() || "Sua marca", 800, 620);
      ctx.fillStyle = palette.primary;
      ctx.font = "700 34px Arial, sans-serif";
      ctx.fillText((slogan.trim() || segment.trim()).toUpperCase(), 800, 695);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1));
      if (!blob) throw new Error("Não foi possível criar o PNG.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name.trim().toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "logo"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setSuccess("Logo baixado em PNG com fundo transparente.");
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Erro ao baixar o logo.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <header className="premium-top">
        <div><small>IDENTIDADE VISUAL COM IA</small><h1>Logo Studio</h1><p>Crie o símbolo com IA, mantenha o nome correto e baixe em PNG transparente.</p></div>
        <button className="premium-primary" onClick={() => inputRef.current?.click()}>＋ Enviar símbolo</button>
      </header>

      <div className="studio-layout logo-studio-layout">
        <section className="studio-form">
          <span className="studio-badge">01</span><h2>Conte sobre sua marca</h2>
          <label>Nome da empresa</label><input value={name} onChange={(event) => setName(event.target.value)} />
          <label>Segmento</label><input value={segment} onChange={(event) => setSegment(event.target.value)} />
          <label>Slogan</label><input value={slogan} onChange={(event) => setSlogan(event.target.value)} />
          <label>Estilo visual</label>
          <div className="choice-grid">{STYLES.map((item) => <button type="button" onClick={() => setStyle(item)} className={style === item ? "selected" : ""} key={item}>{item}</button>)}</div>
          <label>Paleta</label>
          <div className="choice-grid">{PALETTES.map((item) => <button type="button" onClick={() => setPalette(item)} className={palette.name === item.name ? "selected" : ""} key={item.name}>{item.name}</button>)}</div>
          <label>Ideia para o símbolo</label><textarea value={idea} onChange={(event) => setIdea(event.target.value)} />
          <input ref={inputRef} className="banner-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadSymbol} />
          <button className="generate-button" type="button" disabled={loading} onClick={generateLogo}>{loading ? "A IA está criando..." : "✦ Gerar símbolo com IA"}</button>
          <button className="logo-secondary-button" type="button" onClick={() => inputRef.current?.click()}>Usar meu próprio símbolo</button>
          {error && <div className="banner-message is-error">{error}</div>}
          {success && <div className="banner-message is-success">{success}</div>}
        </section>

        <section className="studio-preview">
          <div className="preview-toolbar"><span>Pré-visualização real</span><button type="button" onClick={() => setSymbol("")} disabled={!symbol}>Remover símbolo</button></div>
          <div className="logo-canvas">
            <div className="generated-logo logo-real-preview">
              {symbol ? <img src={symbol} alt="Símbolo da marca" /> : <span style={{ background: `linear-gradient(135deg,${palette.dark},${palette.primary})` }}>{(name.trim()[0] || "M").toUpperCase()}</span>}
              <div><strong style={{ color: palette.dark }}>{name || "Sua marca"}</strong><small style={{ color: palette.primary }}>{(slogan || segment).toUpperCase()}</small></div>
            </div>
          </div>
          <div className="preview-bottom"><span>PNG transparente • nome escrito corretamente</span><button type="button" disabled={exporting} onClick={downloadLogo}>{exporting ? "Preparando..." : "Baixar logo PNG"}</button></div>
        </section>
      </div>
      <canvas ref={canvasRef} hidden />
    </>
  );
}
