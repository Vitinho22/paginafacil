"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#070A12", color: "white" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "min(520px, 100%)", padding: 36, borderRadius: 28, background: "#11162A", border: "1px solid #28304D" }}>
            <strong style={{ display: "inline-grid", placeItems: "center", width: 48, height: 48, borderRadius: 16, background: "linear-gradient(135deg,#7657ff,#a855f7)" }}>PF</strong>
            <h1 style={{ fontSize: 30, marginBottom: 10 }}>A plataforma encontrou uma falha.</h1>
            <p style={{ color: "#AEB6D2", lineHeight: 1.65 }}>Recarregue a aplicação. Se continuar, confira as variáveis do Firebase na hospedagem.</p>
            <button onClick={reset} style={{ border: 0, borderRadius: 14, padding: "14px 20px", fontWeight: 800, cursor: "pointer" }}>Recarregar plataforma</button>
          </section>
        </main>
      </body>
    </html>
  );
}
