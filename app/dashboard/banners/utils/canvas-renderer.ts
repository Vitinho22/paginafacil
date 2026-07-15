interface BannerState {
  image?: string;
  layoutId: number;
  accentColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  cta: string;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/).filter((w) => w);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });

  if (line) lines.push(line);

  lines.slice(0, 4).forEach((item, index) => {
    ctx.fillText(item, x, y + index * lineHeight);
  });

  return lines.slice(0, 4).length;
}

export function renderBannerToCanvas(
  canvas: HTMLCanvasElement,
  banner: BannerState
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Limpar canvas
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, width, height);

  // Carregar e desenhar imagem
  if (banner.image) {
    const img = new Image();
    img.onload = () => {
      // Layout 0: Imagem + Texto Centralizado
      if (banner.layoutId === 0) {
        ctx.drawImage(img, 0, 0, width, height);

        // Overlay escuro
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, width, height);

        // Texto centralizado
        drawCentralizedText(ctx, banner, width, height);
      }
      // Layout 1: Texto em Cima
      else if (banner.layoutId === 1) {
        ctx.drawImage(img, 0, 200, width, height - 200);

        // Header com fundo
        ctx.fillStyle = banner.accentColor;
        ctx.fillRect(0, 0, width, 200);

        drawTopText(ctx, banner, width);
      }
      // Layout 2: Texto Embaixo
      else if (banner.layoutId === 2) {
        ctx.drawImage(img, 0, 0, width, height - 200);

        // Footer com fundo
        ctx.fillStyle = banner.accentColor;
        ctx.fillRect(0, height - 200, width, 200);

        drawBottomText(ctx, banner, width, height);
      }
      // Layout 3: Lado Esquerdo
      else if (banner.layoutId === 3) {
        ctx.drawImage(img, width / 2, 0, width / 2, height);

        // Fundo esquerdo
        ctx.fillStyle = banner.accentColor;
        ctx.fillRect(0, 0, width / 2, height);

        drawLeftText(ctx, banner, width, height);
      }
      // Layout 4: Lado Direito
      else if (banner.layoutId === 4) {
        ctx.drawImage(img, 0, 0, width / 2, height);

        // Fundo direito
        ctx.fillStyle = banner.accentColor;
        ctx.fillRect(width / 2, 0, width / 2, height);

        drawRightText(ctx, banner, width, height);
      }
      // Layout 5: Overlay Gradient
      else if (banner.layoutId === 5) {
        ctx.drawImage(img, 0, 0, width, height);

        // Gradiente overlay
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, banner.accentColor + "80");
        gradient.addColorStop(1, banner.accentColor + "40");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        drawCentralizedText(ctx, banner, width, height);
      }
    };
    img.src = banner.image;
  }
}

function drawCentralizedText(
  ctx: CanvasRenderingContext2D,
  banner: BannerState,
  width: number,
  height: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxWidth = width * 0.8;

  // Título
  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 72px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const titleY = centerY - 100;
  wrapText(ctx, banner.title, centerX, titleY, maxWidth, 90);

  // Subtítulo
  ctx.font = "28px Arial, sans-serif";
  ctx.fillStyle = banner.textColor + "CC";
  const subtitleY = centerY + 50;
  wrapText(ctx, banner.subtitle, centerX, subtitleY, maxWidth, 40);

  // CTA Button
  ctx.fillStyle = banner.accentColor;
  const buttonY = centerY + 180;
  const buttonWidth = 200;
  const buttonHeight = 60;
  ctx.fillRect(centerX - buttonWidth / 2, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 20px Arial, sans-serif";
  ctx.fillText(banner.cta, centerX, buttonY + 30);
}

function drawTopText(
  ctx: CanvasRenderingContext2D,
  banner: BannerState,
  width: number
) {
  const centerX = width / 2;
  const padding = width * 0.1;

  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 60px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillText(banner.title, centerX, 40);

  ctx.font = "20px Arial, sans-serif";
  ctx.fillText(banner.subtitle, centerX, 120);
}

function drawBottomText(
  ctx: CanvasRenderingContext2D,
  banner: BannerState,
  width: number,
  height: number
) {
  const centerX = width / 2;
  const bottomStart = height - 200;

  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 48px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillText(banner.title, centerX, bottomStart + 30);

  ctx.font = "bold 24px Arial, sans-serif";
  ctx.fillStyle = banner.accentColor;
  ctx.fillText(banner.cta + " →", centerX, bottomStart + 100);
}

function drawLeftText(
  ctx: CanvasRenderingContext2D,
  banner: BannerState,
  width: number,
  height: number
) {
  const padding = width * 0.1;
  const maxWidth = width / 2 - padding * 2;

  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 56px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const titleY = height / 2 - 150;
  wrapText(ctx, banner.title, padding, titleY, maxWidth, 70);

  ctx.font = "20px Arial, sans-serif";
  ctx.fillStyle = banner.textColor + "CC";
  const subtitleY = height / 2 + 50;
  wrapText(ctx, banner.subtitle, padding, subtitleY, maxWidth, 30);

  // CTA
  ctx.fillStyle = "rgba(255,255,255, 0.3)";
  const buttonY = height / 2 + 180;
  ctx.fillRect(padding, buttonY, maxWidth - padding, 50);

  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 18px Arial, sans-serif";
  ctx.fillText(banner.cta + " →", padding + 20, buttonY + 15);
}

function drawRightText(
  ctx: CanvasRenderingContext2D,
  banner: BannerState,
  width: number,
  height: number
) {
  const startX = width / 2;
  const padding = width * 0.1;
  const maxWidth = width / 2 - padding * 2;

  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 56px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const titleY = height / 2 - 150;
  wrapText(ctx, banner.title, startX + padding, titleY, maxWidth, 70);

  ctx.font = "20px Arial, sans-serif";
  ctx.fillStyle = banner.textColor + "CC";
  const subtitleY = height / 2 + 50;
  wrapText(ctx, banner.subtitle, startX + padding, subtitleY, maxWidth, 30);

  // CTA
  ctx.fillStyle = "rgba(255,255,255, 0.3)";
  const buttonY = height / 2 + 180;
  ctx.fillRect(startX + padding, buttonY, maxWidth - padding, 50);

  ctx.fillStyle = banner.textColor;
  ctx.font = "bold 18px Arial, sans-serif";
  ctx.fillText(banner.cta + " →", startX + padding + 20, buttonY + 15);
}
