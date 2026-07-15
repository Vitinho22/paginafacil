"use client";

interface ExportPanelProps {
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
}

export default function ExportPanel({ canvasRef }: ExportPanelProps) {
  const handleExportPNG = () => {
    if (!canvasRef?.current) return;

    const link = document.createElement("a");
    link.download = `banner-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png", 1);
    link.click();
  };

  const handleExportJPG = () => {
    if (!canvasRef?.current) return;

    const link = document.createElement("a");
    link.download = `banner-${Date.now()}.jpg`;
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const handleCopyToClipboard = async () => {
    if (!canvasRef?.current) return;

    try {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          alert("✓ Banner copiado para clipboard!");
        }
      });
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="export-panel">
      <h3>📥 Exportar Banner</h3>
      <div className="export-buttons">
        <button onClick={handleExportPNG} className="export-btn png">
          📥 PNG (Alta Qualidade)
        </button>
        <button onClick={handleExportJPG} className="export-btn jpg">
          📥 JPG (Comprimido)
        </button>
        <button onClick={handleCopyToClipboard} className="export-btn copy">
          📋 Copiar para Clipboard
        </button>
      </div>
      <p className="export-info">
        Resolução: 1080x1080px • Pronto para redes sociais
      </p>
    </div>
  );
}
