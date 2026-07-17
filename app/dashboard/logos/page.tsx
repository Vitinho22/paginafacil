"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type LogoStyle = "Minimalista" | "Luxo" | "Moderno" | "Criativo";
type LogoLayout = "horizontal" | "vertical" | "symbol";
type PreviewBackground = "light" | "dark" | "grid";
type SymbolShape = "free" | "rounded" | "circle";

type Palette = {
  name: string;
  value: string;
  primary: string;
  secondary: string;
  dark: string;
  light: string;
};

type CreditResponse = {
  credits?: number;
  error?: string;
};

type LogoResponse = {
  imageUrl?: string;
  remainingCredits?: number;
  error?: string;
};

const STYLES: Array<{
  id: LogoStyle;
  icon: string;
  description: string;
}> = [
  {
    id: "Minimalista",
    icon: "○",
    description: "Limpo, simples e memorável",
  },
  {
    id: "Luxo",
    icon: "◇",
    description: "Refinado e sofisticado",
  },
  {
    id: "Moderno",
    icon: "▦",
    description: "Atual e tecnológico",
  },
  {
    id: "Criativo",
    icon: "✦",
    description: "Original e expressivo",
  },
];

const PALETTES: Palette[] = [
  {
    name: "Roxo premium",
    value: "roxo profundo, lilás luminoso e branco",
    primary: "#7657ef",
    secondary: "#a98bff",
    dark: "#161b2e",
    light: "#f5f2ff",
  },
  {
    name: "Azul confiança",
    value: "azul marinho, azul vivo e branco",
    primary: "#2563eb",
    secondary: "#60a5fa",
    dark: "#0f172a",
    light: "#eff6ff",
  },
  {
    name: "Verde elegante",
    value: "verde esmeralda, verde escuro e branco",
    primary: "#059669",
    secondary: "#34d399",
    dark: "#052e2b",
    light: "#ecfdf5",
  },
  {
    name: "Dourado luxo",
    value: "dourado, preto sofisticado e creme",
    primary: "#b78a35",
    secondary: "#e4c675",
    dark: "#17130d",
    light: "#fffaf0",
  },
  {
    name: "Coral criativo",
    value: "coral vibrante, vinho profundo e creme",
    primary: "#f05d5e",
    secondary: "#ff9f8f",
    dark: "#3b1118",
    light: "#fff4f2",
  },
  {
    name: "Preto editorial",
    value: "preto, grafite e branco",
    primary: "#111827",
    secondary: "#6b7280",
    dark: "#030712",
    light: "#f9fafb",
  },
];

const FONT_OPTIONS = [
  {
    id: "geometric",
    label: "Geométrica",
    family: "Inter, Arial, sans-serif",
    weight: 900,
  },
  {
    id: "editorial",
    label: "Editorial",
    family: "Georgia, 'Times New Roman', serif",
    weight: 700,
  },
  {
    id: "clean",
    label: "Clean",
    family: "Arial, Helvetica, sans-serif",
    weight: 800,
  },
] as const;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Não foi possível carregar o símbolo."));
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

function safeSlug(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "logo"
  );
}

function fitCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  initialSize: number,
  minSize: number,
  fontFamily: string,
  fontWeight: number,
) {
  let size = initialSize;

  while (size > minSize) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;

    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }

    size -= 4;
  }

  return minSize;
}

function drawRoundedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  shape: SymbolShape,
) {
  ctx.save();

  if (shape === "rounded") {
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, size * 0.22);
    ctx.clip();
  }

  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
  }

  const scale = Math.min(size / image.width, size / image.height);
  const width = image.width * scale;
  const height = image.height * scale;

  ctx.drawImage(
    image,
    x + (size - width) / 2,
    y + (size - height) / 2,
    width,
    height,
  );

  ctx.restore();
}

export default function Logos() {
  const { user } = useAuth();

  const [name, setName] = useState("Aurora Studio");
  const [segment, setSegment] = useState("Design e comunicação");
  const [slogan, setSlogan] = useState("Ideias que ganham forma");
  const [style, setStyle] = useState<LogoStyle>("Minimalista");
  const [palette, setPalette] = useState<Palette>(PALETTES[0]);
  const [idea, setIdea] = useState(
    "Crie um símbolo abstrato, autoral e vetorial, com geometria limpa, sem clipart, sem mascote, sem texto e sem ilustração literal do segmento. Deve parecer criado por um estúdio profissional de branding e funcionar em tamanhos pequenos.",
  );

  const [layout, setLayout] = useState<LogoLayout>("horizontal");
  const [previewBackground, setPreviewBackground] =
    useState<PreviewBackground>("light");
  const [symbolShape, setSymbolShape] = useState<SymbolShape>("free");
  const [fontId, setFontId] =
    useState<(typeof FONT_OPTIONS)[number]["id"]>("geometric");

  const [symbol, setSymbol] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsError, setCreditsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedFont = useMemo(
    () => FONT_OPTIONS.find((item) => item.id === fontId) || FONT_OPTIONS[0],
    [fontId],
  );

  const previewNameSize = useMemo(() => {
    const length = (name.trim() || "Sua marca").length;

    if (length <= 10) return "clamp(42px, 5.2vw, 78px)";
    if (length <= 18) return "clamp(36px, 4.4vw, 66px)";
    if (length <= 28) return "clamp(30px, 3.7vw, 56px)";
    return "clamp(26px, 3vw, 46px)";
  }, [name]);

  useEffect(() => {
    return () => {
      if (symbol.startsWith("blob:")) {
        URL.revokeObjectURL(symbol);
      }
    };
  }, [symbol]);

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
            `A API de créditos respondeu vazia. Status ${response.status}.`,
          );
        }

        let data: CreditResponse;

        try {
          data = JSON.parse(responseText) as CreditResponse;
        } catch {
          throw new Error(
            `A API de créditos respondeu em formato inválido. Status ${response.status}.`,
          );
        }

        if (!response.ok) {
          throw new Error(
            data.error || "Não foi possível carregar os créditos.",
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
              : "Erro ao carregar créditos.",
          );
        }
      }
    }

    loadCredits();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function generateLogo() {
    setError("");
    setSuccess("");

    if (!user) {
      setError("Entre na sua conta para gerar logos.");
      return;
    }

    if (name.trim().length < 2 || segment.trim().length < 2) {
      setError("Informe o nome e o segmento da marca.");
      return;
    }

    if (idea.trim().length < 8) {
      setError("Descreva melhor o símbolo que deseja criar.");
      return;
    }

    if (credits !== null && credits < 2) {
      setError("Você precisa de pelo menos 2 créditos para gerar um logo.");
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/ai/logo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          segment,
          style,
          colors: palette.value,
          idea,
        }),
      });

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error(
          `A API de logos respondeu vazia. Status ${response.status}.`,
        );
      }

      let payload: LogoResponse;

      try {
        payload = JSON.parse(responseText) as LogoResponse;
      } catch {
        throw new Error(
          `A API de logos respondeu em formato inválido. Status ${response.status}.`,
        );
      }

      if (!response.ok || !payload.imageUrl) {
        throw new Error(
          payload.error || "Não foi possível gerar o logo.",
        );
      }

      if (symbol.startsWith("blob:")) {
        URL.revokeObjectURL(symbol);
      }

      setSymbol(payload.imageUrl);

      if (typeof payload.remainingCredits === "number") {
        setCredits(payload.remainingCredits);
      }

      setSuccess(
        "Símbolo criado com IA. O nome, slogan, fonte e composição continuam editáveis.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao gerar o logo.",
      );
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

    if (symbol.startsWith("blob:")) {
      URL.revokeObjectURL(symbol);
    }

    setSymbol(URL.createObjectURL(file));
    setSuccess(
      "Símbolo enviado. Agora personalize a composição e baixe o logo.",
    );

    event.target.value = "";
  }

  async function drawLogoCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) {
      throw new Error("Canvas indisponível.");
    }

    const isVertical = layout === "vertical";
    const isSymbolOnly = layout === "symbol";

    canvas.width = isVertical ? 1600 : 2200;
    canvas.height = isVertical ? 1600 : 1200;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Não foi possível preparar o arquivo.");
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const image = symbol ? await loadImage(symbol) : null;

    if (isSymbolOnly) {
      const symbolSize = 650;
      const x = (canvas.width - symbolSize) / 2;
      const y = (canvas.height - symbolSize) / 2;

      if (image) {
        drawRoundedImage(ctx, image, x, y, symbolSize, symbolShape);
      } else {
        const gradient = ctx.createLinearGradient(
          x,
          y,
          x + symbolSize,
          y + symbolSize,
        );
        gradient.addColorStop(0, palette.dark);
        gradient.addColorStop(1, palette.primary);

        ctx.fillStyle = gradient;
        ctx.beginPath();

        if (symbolShape === "circle") {
          ctx.arc(
            x + symbolSize / 2,
            y + symbolSize / 2,
            symbolSize / 2,
            0,
            Math.PI * 2,
          );
        } else {
          ctx.roundRect(
            x,
            y,
            symbolSize,
            symbolSize,
            symbolShape === "rounded" ? 150 : 90,
          );
        }

        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `900 ${Math.round(symbolSize * 0.48)}px Arial, sans-serif`;
        ctx.fillText(
          (name.trim()[0] || "M").toUpperCase(),
          x + symbolSize / 2,
          y + symbolSize / 2 + 10,
        );
      }

      return canvas;
    }

    if (isVertical) {
      const symbolSize = 430;
      const symbolX = (canvas.width - symbolSize) / 2;
      const symbolY = 180;

      if (image) {
        drawRoundedImage(
          ctx,
          image,
          symbolX,
          symbolY,
          symbolSize,
          symbolShape,
        );
      } else {
        const gradient = ctx.createLinearGradient(
          symbolX,
          symbolY,
          symbolX + symbolSize,
          symbolY + symbolSize,
        );
        gradient.addColorStop(0, palette.dark);
        gradient.addColorStop(1, palette.primary);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(
          symbolX,
          symbolY,
          symbolSize,
          symbolSize,
          symbolShape === "circle" ? symbolSize / 2 : 100,
        );
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "900 220px Arial, sans-serif";
        ctx.fillText(
          (name.trim()[0] || "M").toUpperCase(),
          canvas.width / 2,
          symbolY + symbolSize / 2 + 8,
        );
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = palette.dark;

      const verticalName = name.trim() || "Sua marca";
      const verticalFontSize = fitCanvasText(
        ctx,
        verticalName,
        canvas.width - 220,
        116,
        58,
        selectedFont.family,
        selectedFont.weight,
      );

      ctx.font = `${selectedFont.weight} ${verticalFontSize}px ${selectedFont.family}`;
      ctx.fillText(verticalName, canvas.width / 2, 860);

      ctx.fillStyle = palette.primary;
      ctx.font = `700 34px Inter, Arial, sans-serif`;
      ctx.fillText(
        (slogan.trim() || segment.trim()).toUpperCase(),
        canvas.width / 2,
        945,
      );

      return canvas;
    }

    const symbolSize = 430;
    const symbolX = 180;
    const symbolY = (canvas.height - symbolSize) / 2;

    if (image) {
      drawRoundedImage(
        ctx,
        image,
        symbolX,
        symbolY,
        symbolSize,
        symbolShape,
      );
    } else {
      const gradient = ctx.createLinearGradient(
        symbolX,
        symbolY,
        symbolX + symbolSize,
        symbolY + symbolSize,
      );
      gradient.addColorStop(0, palette.dark);
      gradient.addColorStop(1, palette.primary);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        symbolX,
        symbolY,
        symbolSize,
        symbolSize,
        symbolShape === "circle" ? symbolSize / 2 : 100,
      );
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 220px Arial, sans-serif";
      ctx.fillText(
        (name.trim()[0] || "M").toUpperCase(),
        symbolX + symbolSize / 2,
        symbolY + symbolSize / 2 + 8,
      );
    }

    const textX = 720;

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = palette.dark;

    const horizontalName = name.trim() || "Sua marca";
    const horizontalFontSize = fitCanvasText(
      ctx,
      horizontalName,
      canvas.width - textX - 150,
      128,
      58,
      selectedFont.family,
      selectedFont.weight,
    );

    ctx.font = `${selectedFont.weight} ${horizontalFontSize}px ${selectedFont.family}`;
    ctx.fillText(horizontalName, textX, 575);

    ctx.fillStyle = palette.primary;
    ctx.font = "700 36px Inter, Arial, sans-serif";
    ctx.fillText(
      (slogan.trim() || segment.trim()).toUpperCase(),
      textX,
      660,
    );

    return canvas;
  }

  async function downloadLogo() {
    setError("");
    setSuccess("");
    setExporting(true);

    try {
      const canvas = await drawLogoCanvas();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 1),
      );

      if (!blob) {
        throw new Error("Não foi possível criar o PNG.");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${safeSlug(name)}-${layout}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setSuccess("Logo baixado em PNG de alta resolução e fundo transparente.");
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Erro ao baixar o logo.",
      );
    } finally {
      setExporting(false);
    }
  }

  const previewClass = [
    "logo-canvas",
    `background-${previewBackground}`,
    `layout-${layout}`,
  ].join(" ");

  return (
    <main className="logo-page">
      <header className="logo-header">
        <div>
          <span className="header-kicker">✦ IDENTIDADE VISUAL COM IA</span>
          <h1>Logo Studio</h1>
          <p>
            Crie um símbolo exclusivo, organize a identidade da marca e exporte
            versões profissionais.
          </p>
        </div>

        <div className="header-actions">
          <div className="credit-pill">
            <span>ϟ</span>
            <div>
              <small>Créditos IA</small>
              <b>{credits === null ? "..." : credits}</b>
            </div>
          </div>

          <button
            className="upload-header-button"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            ＋ Enviar símbolo
          </button>
        </div>
      </header>

      <div className="logo-workspace">
        <aside className="logo-controls">
          <section className="control-card">
            <div className="section-heading">
              <span>01</span>
              <div>
                <h2>Dados da marca</h2>
                <p>Defina a base da identidade visual.</p>
              </div>
            </div>

            <label>Nome da empresa</label>
            <input
              value={name}
              maxLength={42}
              onChange={(event) => setName(event.target.value)}
            />

            <div className="two-columns">
              <div>
                <label>Segmento</label>
                <input
                  value={segment}
                  maxLength={55}
                  onChange={(event) => setSegment(event.target.value)}
                />
              </div>

              <div>
                <label>Slogan</label>
                <input
                  value={slogan}
                  maxLength={55}
                  onChange={(event) => setSlogan(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="control-card">
            <div className="section-heading">
              <span>02</span>
              <div>
                <h2>Direção criativa</h2>
                <p>Escolha a personalidade da marca.</p>
              </div>
            </div>

            <label>Estilo visual</label>
            <div className="style-grid">
              {STYLES.map((item) => (
                <button
                  type="button"
                  className={style === item.id ? "selected" : ""}
                  onClick={() => setStyle(item.id)}
                  key={item.id}
                >
                  <span>{item.icon}</span>
                  <div>
                    <b>{item.id}</b>
                    <small>{item.description}</small>
                  </div>
                </button>
              ))}
            </div>

            <label>Paleta de cores</label>
            <div className="palette-grid">
              {PALETTES.map((item) => (
                <button
                  type="button"
                  className={palette.name === item.name ? "selected" : ""}
                  onClick={() => setPalette(item)}
                  key={item.name}
                >
                  <span>
                    <i style={{ background: item.dark }} />
                    <i style={{ background: item.primary }} />
                    <i style={{ background: item.secondary }} />
                  </span>
                  <b>{item.name}</b>
                </button>
              ))}
            </div>

            <label>Ideia para o símbolo</label>
            <textarea
              value={idea}
              maxLength={500}
              onChange={(event) => setIdea(event.target.value)}
            />

            <div className="counter">{idea.length}/500</div>
          </section>

          <section className="control-card">
            <div className="section-heading">
              <span>03</span>
              <div>
                <h2>Composição</h2>
                <p>Monte a versão ideal do logo.</p>
              </div>
            </div>

            <label>Formato do logo</label>
            <div className="choice-row">
              {[
                ["horizontal", "Horizontal"],
                ["vertical", "Vertical"],
                ["symbol", "Símbolo"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  className={layout === value ? "selected" : ""}
                  onClick={() => setLayout(value as LogoLayout)}
                  key={value}
                >
                  {label}
                </button>
              ))}
            </div>

            <label>Forma do símbolo</label>
            <div className="choice-row">
              {[
                ["free", "Livre"],
                ["rounded", "Arredondado"],
                ["circle", "Circular"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  className={symbolShape === value ? "selected" : ""}
                  onClick={() => setSymbolShape(value as SymbolShape)}
                  key={value}
                >
                  {label}
                </button>
              ))}
            </div>

            <label>Tipografia</label>
            <div className="font-grid">
              {FONT_OPTIONS.map((font) => (
                <button
                  type="button"
                  className={fontId === font.id ? "selected" : ""}
                  onClick={() => setFontId(font.id)}
                  key={font.id}
                  style={{ fontFamily: font.family }}
                >
                  <b>Aa</b>
                  <small>{font.label}</small>
                </button>
              ))}
            </div>
          </section>

          <input
            ref={inputRef}
            className="hidden-input"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={uploadSymbol}
          />

          <button
            className="generate-logo-button"
            type="button"
            disabled={loading}
            onClick={generateLogo}
          >
            <span>✦</span>
            {loading ? "A IA está criando..." : "Gerar símbolo com IA"}
          </button>

          <p className="credits-note">
            {creditsError
              ? "Não foi possível carregar os créditos."
              : `◉ Esta geração utiliza 2 créditos • saldo: ${
                  credits === null ? "..." : credits
                }`}
          </p>

          <button
            className="secondary-logo-button"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            Usar meu próprio símbolo
          </button>

          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}
        </aside>

        <section className="logo-preview-panel">
          <div className="preview-toolbar">
            <div>
              <span>Pré-visualização</span>
              <small>Logo editável e exportação em alta resolução</small>
            </div>

            <div className="preview-actions">
              <div className="background-switcher">
                {[
                  ["light", "Claro"],
                  ["dark", "Escuro"],
                  ["grid", "Transparente"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    className={
                      previewBackground === value ? "selected" : ""
                    }
                    onClick={() =>
                      setPreviewBackground(value as PreviewBackground)
                    }
                    key={value}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="remove-symbol"
                onClick={() => setSymbol("")}
                disabled={!symbol}
              >
                Remover símbolo
              </button>
            </div>
          </div>

          <div className={previewClass}>
            <article
              className={`logo-lockup shape-${symbolShape}`}
              style={
                {
                  "--brand-primary": palette.primary,
                  "--brand-secondary": palette.secondary,
                  "--brand-dark":
                    previewBackground === "dark" ? "#ffffff" : palette.dark,
                  "--brand-font": selectedFont.family,
                  "--brand-weight": selectedFont.weight,
                } as React.CSSProperties
              }
            >
              <div className="symbol-frame">
                {symbol ? (
                  <img src={symbol} alt="Símbolo da marca" />
                ) : (
                  <span
                    style={{
                      background: `linear-gradient(135deg,${palette.dark},${palette.primary})`,
                    }}
                  >
                    {(name.trim()[0] || "M").toUpperCase()}
                  </span>
                )}
              </div>

              {layout !== "symbol" && (
                <div className="brand-copy">
                  <strong style={{ fontSize: previewNameSize }}>
                    {name || "Sua marca"}
                  </strong>
                  <small>{(slogan || segment).toUpperCase()}</small>
                </div>
              )}
            </article>
          </div>

          <div className="brand-kit">
            <div>
              <small>CORES DA MARCA</small>
              <div className="brand-colors">
                {[palette.dark, palette.primary, palette.secondary].map(
                  (color) => (
                    <span key={color}>
                      <i style={{ background: color }} />
                      {color.toUpperCase()}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div>
              <small>TIPOGRAFIA</small>
              <strong style={{ fontFamily: selectedFont.family }}>
                {selectedFont.label}
              </strong>
            </div>
          </div>

          <div className="preview-bottom">
            <span>
              PNG transparente • alta resolução • nome escrito corretamente
            </span>

            <button
              type="button"
              disabled={exporting}
              onClick={downloadLogo}
            >
              {exporting ? "Preparando..." : "Baixar logo PNG"}
            </button>
          </div>
        </section>
      </div>

      <canvas ref={canvasRef} hidden />

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .logo-page {
          min-height: 100vh;
          padding: 24px 28px 32px;
          background:
            radial-gradient(
              circle at 92% 4%,
              rgba(118, 87, 239, 0.09),
              transparent 27%
            ),
            #f5f7fb;
          color: #111827;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .logo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 24px;
        }

        .header-kicker {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #7657ef;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .logo-header h1 {
          margin: 8px 0 4px;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .logo-header p {
          max-width: 680px;
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.6;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .credit-pill {
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 30px rgba(16, 24, 40, 0.06);
        }

        .credit-pill > span {
          color: #f59e0b;
          font-size: 20px;
        }

        .credit-pill small,
        .credit-pill b {
          display: block;
        }

        .credit-pill small {
          color: #98a2b3;
          font-size: 9px;
          font-weight: 700;
        }

        .credit-pill b {
          margin-top: 2px;
          color: #111827;
          font-size: 16px;
        }

        .upload-header-button {
          min-height: 54px;
          padding: 0 20px;
          border: 0;
          border-radius: 14px;
          color: #ffffff;
          background: linear-gradient(135deg, #6d45ff, #9b63ff);
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(109, 69, 255, 0.22);
        }

        .logo-workspace {
          display: grid;
          grid-template-columns: minmax(330px, 410px) minmax(0, 1fr);
          gap: 20px;
          align-items: start;
        }

        .logo-controls,
        .logo-preview-panel {
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 18px 50px rgba(16, 24, 40, 0.07);
        }

        .logo-controls {
          padding: 18px;
        }

        .control-card {
          padding: 18px;
          margin-bottom: 13px;
          border: 1px solid #eceef3;
          border-radius: 16px;
          background: #ffffff;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 16px;
        }

        .section-heading > span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #7657ef;
          background: #f2efff;
          font-size: 10px;
          font-weight: 900;
        }

        .section-heading h2,
        .section-heading p {
          margin: 0;
        }

        .section-heading h2 {
          color: #101828;
          font-size: 14px;
          letter-spacing: -0.02em;
        }

        .section-heading p {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 10px;
        }

        .logo-controls label {
          display: block;
          margin: 13px 0 6px;
          color: #344054;
          font-size: 10px;
          font-weight: 800;
        }

        .logo-controls input,
        .logo-controls textarea {
          width: 100%;
          border: 1px solid #dfe3ea;
          border-radius: 10px;
          background: #ffffff;
          color: #344054;
          outline: none;
          transition: 0.18s ease;
        }

        .logo-controls input {
          height: 42px;
          padding: 0 12px;
          font-size: 11px;
        }

        .logo-controls textarea {
          min-height: 84px;
          padding: 11px 12px;
          resize: vertical;
          font-size: 11px;
          line-height: 1.55;
        }

        .logo-controls input:focus,
        .logo-controls textarea:focus {
          border-color: #8b70ff;
          box-shadow: 0 0 0 3px rgba(139, 112, 255, 0.1);
        }

        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .style-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .style-grid button {
          min-height: 66px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 11px;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
        }

        .style-grid button > span {
          min-width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #7657ef;
          background: #f5f2ff;
          font-size: 17px;
        }

        .style-grid button b,
        .style-grid button small {
          display: block;
        }

        .style-grid button b {
          color: #344054;
          font-size: 10px;
        }

        .style-grid button small {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 8px;
        }

        .style-grid button.selected,
        .palette-grid button.selected,
        .choice-row button.selected,
        .font-grid button.selected {
          border-color: #7657ef;
          background: #faf8ff;
          box-shadow: 0 0 0 2px rgba(118, 87, 239, 0.08);
        }

        .palette-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .palette-grid button {
          min-height: 54px;
          padding: 9px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
        }

        .palette-grid button > span {
          display: flex;
          gap: 3px;
          margin-bottom: 7px;
        }

        .palette-grid button i {
          width: 22px;
          height: 8px;
          display: block;
          border-radius: 99px;
        }

        .palette-grid button b {
          color: #475467;
          font-size: 9px;
        }

        .choice-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }

        .choice-row button {
          min-height: 39px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: #ffffff;
          color: #475467;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .font-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }

        .font-grid button {
          min-height: 62px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #ffffff;
          cursor: pointer;
        }

        .font-grid b {
          color: #344054;
          font-size: 18px;
        }

        .font-grid small {
          color: #98a2b3;
          font-family: Inter, Arial, sans-serif;
          font-size: 8px;
        }

        .counter {
          margin-top: 5px;
          color: #98a2b3;
          font-size: 9px;
          text-align: right;
        }

        .hidden-input {
          display: none;
        }

        .generate-logo-button,
        .secondary-logo-button {
          width: 100%;
          min-height: 50px;
          border-radius: 12px;
          font-weight: 850;
          cursor: pointer;
        }

        .generate-logo-button {
          border: 0;
          color: #ffffff;
          background: linear-gradient(90deg, #6538ff, #d648df);
          box-shadow: 0 13px 28px rgba(126, 67, 233, 0.24);
        }

        .generate-logo-button:disabled {
          opacity: 0.58;
          cursor: wait;
        }

        .generate-logo-button span {
          margin-right: 8px;
        }

        .secondary-logo-button {
          margin-top: 9px;
          border: 1px solid #e4e7ec;
          color: #475467;
          background: #ffffff;
        }

        .credits-note {
          margin: 9px 0 0;
          color: #98a2b3;
          font-size: 9px;
          text-align: center;
        }

        .message {
          margin-top: 11px;
          padding: 11px 12px;
          border-radius: 10px;
          font-size: 10px;
          line-height: 1.45;
        }

        .message.error {
          color: #b42318;
          background: #fff1f0;
          border: 1px solid #fecdca;
        }

        .message.success {
          color: #067647;
          background: #ecfdf3;
          border: 1px solid #abefc6;
        }

        .logo-preview-panel {
          min-width: 0;
          padding: 18px;
        }

        .preview-toolbar,
        .preview-bottom,
        .brand-kit {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .preview-toolbar {
          min-height: 50px;
          padding: 0 2px 16px;
        }

        .preview-toolbar span,
        .preview-toolbar small {
          display: block;
        }

        .preview-toolbar span {
          color: #344054;
          font-size: 12px;
          font-weight: 850;
        }

        .preview-toolbar small {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 9px;
        }

        .preview-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .background-switcher {
          display: flex;
          gap: 4px;
          padding: 4px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #f8fafc;
        }

        .background-switcher button,
        .remove-symbol {
          min-height: 32px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: #667085;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .background-switcher button {
          padding: 0 10px;
        }

        .background-switcher button.selected {
          color: #5b42d6;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(16, 24, 40, 0.08);
        }

        .remove-symbol {
          padding: 0 11px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
        }

        .remove-symbol:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .logo-canvas {
          min-height: 620px;
          display: grid;
          place-items: center;
          padding: 34px;
          border: 1px solid #e7e9ef;
          border-radius: 18px;
          overflow: hidden;
          transition: 0.2s ease;
        }

        .background-light {
          background:
            radial-gradient(
              circle at 70% 20%,
              rgba(118, 87, 239, 0.07),
              transparent 30%
            ),
            #ffffff;
        }

        .background-dark {
          background:
            radial-gradient(
              circle at 70% 20%,
              rgba(118, 87, 239, 0.18),
              transparent 30%
            ),
            #101322;
        }

        .background-grid {
          background-color: #ffffff;
          background-image:
            linear-gradient(45deg, #eef0f4 25%, transparent 25%),
            linear-gradient(-45deg, #eef0f4 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #eef0f4 75%),
            linear-gradient(-45deg, transparent 75%, #eef0f4 75%);
          background-size: 30px 30px;
          background-position:
            0 0,
            0 15px,
            15px -15px,
            -15px 0;
        }

        .logo-lockup {
          --brand-primary: #7657ef;
          --brand-dark: #161b2e;
          --brand-font: Inter, Arial, sans-serif;
          --brand-weight: 900;
          display: grid;
          grid-template-columns: minmax(150px, 240px) minmax(0, 1fr);
          align-items: center;
          gap: clamp(28px, 4vw, 60px);
          width: min(100%, 980px);
          min-height: 300px;
          padding: clamp(30px, 5vw, 70px);
        }

        .layout-vertical .logo-lockup {
          display: flex;
          flex-direction: column;
          gap: 28px;
          text-align: center;
        }

        .layout-symbol .logo-lockup {
          display: flex;
          width: auto;
        }

        .symbol-frame {
          flex: 0 0 auto;
          width: clamp(150px, 17vw, 230px);
          height: clamp(150px, 17vw, 230px);
          display: grid;
          place-items: center;
          overflow: hidden;
          justify-self: center;
        }

        .symbol-frame img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .symbol-frame > span {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          border-radius: 23%;
          color: #ffffff;
          font-size: clamp(62px, 8vw, 112px);
          font-weight: 950;
          box-shadow: 0 24px 60px rgba(30, 41, 59, 0.22);
        }

        .shape-rounded .symbol-frame,
        .shape-rounded .symbol-frame img,
        .shape-rounded .symbol-frame > span {
          border-radius: 23%;
        }

        .shape-circle .symbol-frame,
        .shape-circle .symbol-frame img,
        .shape-circle .symbol-frame > span {
          border-radius: 999px;
        }

        .brand-copy {
          width: 100%;
          min-width: 0;
          max-width: 700px;
          overflow: visible;
        }

        .brand-copy strong,
        .brand-copy small {
          display: block;
        }

        .brand-copy strong {
          width: 100%;
          color: var(--brand-dark);
          font-family: var(--brand-font);
          font-weight: var(--brand-weight);
          line-height: 1;
          letter-spacing: -0.045em;
          white-space: nowrap;
          overflow: visible;
          word-break: normal;
          overflow-wrap: normal;
        }

        .brand-copy small {
          margin-top: 20px;
          color: var(--brand-primary);
          font-size: clamp(10px, 1.3vw, 17px);
          font-weight: 850;
          letter-spacing: 0.17em;
        }

        .brand-kit {
          margin-top: 14px;
          padding: 15px 17px;
          border: 1px solid #e5e7eb;
          border-radius: 13px;
          background: #fafbff;
        }

        .brand-kit small {
          display: block;
          margin-bottom: 8px;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .brand-colors {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .brand-colors span {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #667085;
          font-size: 8px;
          font-weight: 750;
        }

        .brand-colors i {
          width: 20px;
          height: 20px;
          display: block;
          border-radius: 6px;
          border: 1px solid rgba(16, 24, 40, 0.08);
        }

        .brand-kit strong {
          color: #344054;
          font-size: 13px;
        }

        .preview-bottom {
          margin-top: 14px;
          min-height: 58px;
          padding: 0 4px;
        }

        .preview-bottom span {
          color: #98a2b3;
          font-size: 9px;
        }

        .preview-bottom button {
          min-height: 45px;
          padding: 0 18px;
          border: 0;
          border-radius: 11px;
          color: #ffffff;
          background: #111827;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
        }

        .preview-bottom button:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        @media (max-width: 1080px) {
          .logo-workspace {
            grid-template-columns: 350px minmax(0, 1fr);
          }

          .logo-canvas {
            min-height: 520px;
          }
        }

        @media (max-width: 900px) {
          .logo-page {
            padding: 18px;
          }

          .logo-header {
            align-items: flex-start;
          }

          .logo-workspace {
            grid-template-columns: 1fr;
          }

          .logo-preview-panel {
            order: 1;
          }

          .logo-controls {
            order: 2;
          }
        }

        @media (max-width: 620px) {
          .logo-page {
            padding: 12px;
          }

          .logo-header {
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }

          .credit-pill {
            flex: 1;
          }

          .upload-header-button {
            flex: 1;
          }

          .two-columns,
          .style-grid,
          .palette-grid {
            grid-template-columns: 1fr;
          }

          .logo-preview-panel,
          .logo-controls {
            border-radius: 16px;
          }

          .preview-toolbar,
          .brand-kit,
          .preview-bottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .preview-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .background-switcher {
            flex: 1;
          }

          .background-switcher button {
            flex: 1;
          }

          .logo-canvas {
            min-height: 420px;
            padding: 15px;
          }

          .logo-lockup {
            display: flex;
            flex-direction: column;
            text-align: center;
          }

          .brand-copy {
            max-width: 100%;
          }

          .brand-copy strong {
            white-space: normal;
            overflow-wrap: break-word;
          }

          .brand-copy small {
            letter-spacing: 0.08em;
          }

          .preview-bottom button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}