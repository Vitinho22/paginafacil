export function exportCanvasAsImage(
  canvas: HTMLCanvasElement,
  format: "png" | "jpg" | "webp" = "png",
  filename?: string
) {
  const timestamp = Date.now();
  const defaultFilename = `banner-${timestamp}.${format === "jpg" ? "jpg" : format}`;
  const finalFilename = filename || defaultFilename;

  const link = document.createElement("a");
  link.download = finalFilename;

  if (format === "png") {
    link.href = canvas.toDataURL("image/png", 1);
  } else if (format === "jpg") {
    link.href = canvas.toDataURL("image/jpeg", 0.95);
  } else if (format === "webp") {
    link.href = canvas.toDataURL("image/webp", 0.95);
  }

  link.click();
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement) {
  try {
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, "image/png");
    });

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Erro ao copiar para clipboard:", error);
    return false;
  }
}

export function getCanvasAsDataURL(
  canvas: HTMLCanvasElement,
  format: "png" | "jpg" = "png"
): string {
  if (format === "png") {
    return canvas.toDataURL("image/png", 1);
  } else {
    return canvas.toDataURL("image/jpeg", 0.95);
  }
}

export function downloadMultipleBanners(
  canvases: HTMLCanvasElement[],
  format: "png" | "jpg" = "png"
) {
  canvases.forEach((canvas, index) => {
    setTimeout(() => {
      const filename = `banner-${index + 1}-${Date.now()}.${format === "jpg" ? "jpg" : format}`;
      exportCanvasAsImage(canvas, format, filename);
    }, index * 500); // Delay entre downloads
  });
}
