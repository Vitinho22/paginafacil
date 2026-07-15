"use client";

import { RefObject, useEffect, useRef } from "react";

type BannerState = {
  image?: string;
  sourceImage?: string;
  resultImage?: string;
  title?: string;
  description?: string;
  cta?: string;
  objective?: string;
  width?: number;
  height?: number;
};

interface CanvasProps {
  banner: BannerState;
  canvasRef?: RefObject<HTMLCanvasElement | null> | null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Não foi possível carregar a imagem do banner."));

    image.src = src;
  });
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (
      context.measureText(testLine).width <= maxWidth ||
      currentLine.length === 0
    ) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function renderBannerToCanvas(
  canvas: HTMLCanvasElement,
  banner: BannerState
): Promise<void> {
  const width = banner.width || 1080;
  const height = banner.height || 1080;

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Não foi possível preparar o canvas.");
  }

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#070a13";
  context.fillRect(0, 0, width, height);

  const imageSource =
    banner.resultImage || banner.sourceImage || banner.image || "";

  if (imageSource) {
    const image = await loadImage(imageSource);

    const scale = Math.max(width / image.width, height / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    context.drawImage(image, x, y, drawWidth, drawHeight);
  }

  const overlay = context.createLinearGradient(0, 0, width * 0.8, 0);
  overlay.addColorStop(0, "rgba(7, 10, 19, 0.96)");
  overlay.addColorStop(0.55, "rgba(7, 10, 19, 0.72)");
  overlay.addColorStop(1, "rgba(7, 10, 19, 0.05)");

  context.fillStyle = overlay;
  context.fillRect(0, 0, width, height);

  const padding = Math.round(width * 0.075);
  const contentWidth = width * 0.55;
  let currentY = height * 0.2;

  context.textBaseline = "top";

  context.fillStyle = "#a991ff";
  context.font = `800 ${Math.round(width * 0.022)}px Arial, sans-serif`;
  context.fillText(
    (banner.objective || "DESIGN PROFISSIONAL").toUpperCase(),
    padding,
    currentY
  );

  currentY += width * 0.065;

  const titleSize = Math.round(width * 0.065);
  context.fillStyle = "#ffffff";
  context.font = `900 ${titleSize}px Arial, sans-serif`;

  const titleLines = wrapText(
    context,
    banner.title || "Seu título principal",
    contentWidth
  ).slice(0, 4);

  for (const line of titleLines) {
    context.fillText(line, padding, currentY);
    currentY += titleSize * 1.06;
  }

  currentY += width * 0.018;

  const descriptionSize = Math.round(width * 0.027);
  context.fillStyle = "rgba(255, 255, 255, 0.86)";
  context.font = `500 ${descriptionSize}px Arial, sans-serif`;

  const descriptionLines = wrapText(
    context,
    banner.description || "Descrição do seu banner.",
    contentWidth
  ).slice(0, 4);

  for (const line of descriptionLines) {
    context.fillText(line, padding, currentY);
    currentY += descriptionSize * 1.4;
  }

  currentY += width * 0.03;

  const buttonText = (banner.cta || "SAIBA MAIS").toUpperCase();
  const buttonFontSize = Math.round(width * 0.024);

  context.font = `900 ${buttonFontSize}px Arial, sans-serif`;

  const buttonWidth =
    context.measureText(buttonText).width + Math.round(width * 0.075);
  const buttonHeight = Math.round(buttonFontSize * 2.5);

  const buttonGradient = context.createLinearGradient(
    padding,
    currentY,
    padding + buttonWidth,
    currentY
  );

  buttonGradient.addColorStop(0, "#7452ff");
  buttonGradient.addColorStop(1, "#a173ff");

  context.fillStyle = buttonGradient;
  context.beginPath();
  context.roundRect(
    padding,
    currentY,
    buttonWidth,
    buttonHeight,
    buttonHeight * 0.25
  );
  context.fill();

  context.fillStyle = "#ffffff";
  context.fillText(
    buttonText,
    padding + Math.round(width * 0.037),
    currentY + buttonFontSize * 0.72
  );
}

export default function Canvas({ banner, canvasRef }: CanvasProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasToUse = canvasRef || internalCanvasRef;

  useEffect(() => {
    const canvas = canvasToUse.current;

    if (!canvas) {
      return;
    }

    renderBannerToCanvas(canvas, banner).catch((error) => {
      console.error("Erro ao renderizar banner:", error);
    });
  }, [banner, canvasToUse]);

  const width = banner.width || 1080;
  const height = banner.height || 1080;

  return (
    <div className="canvas-wrapper">
      <div className="canvas-info">
        <span>
          {width} × {height}px
        </span>
      </div>

      <canvas
        ref={canvasToUse}
        width={width}
        height={height}
        className="banner-canvas"
      />
    </div>
  );
}
