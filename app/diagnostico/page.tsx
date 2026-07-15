"use client";

import { useEffect, useState } from "react";

type Status = {
  online: boolean;
  firebaseConfigured: boolean;
  paymentConfigured: boolean;
  environment: string;
};

export default function DiagnosticoPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível verificar o servidor.");
        return response.json();
      })
      .then(setStatus)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: "48px 20px", background: "#07111f", color: "white" }}>
      <section style={{ maxWidth: 760, margin: "0 auto", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 24, padding: 32 }}>
        <p style={{ color: "#8ab4ff", fontWeight: 700, marginBottom: 8 }}>PÁGINAFÁCIL</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Diagnóstico da publicação</h1>
        <p style={{ color: "#b9c5d6", lineHeight: 1.7 }}>Esta página verifica se o domínio, o Firebase e o Mercado Pago estão configurados no servidor.</p>

        {error && <p style={{ marginTop: 24, padding: 16, background: "#5b1720", borderRadius: 12 }}>{error}</p>}
        {!status && !error && <p style={{ marginTop: 24 }}>Verificando...</p>}

        {status && (
          <div style={{ display: "grid", gap: 12, marginTop: 28 }}>
            <Item label="Site e servidor" ok={status.online} />
            <Item label="Firebase (login e projetos)" ok={status.firebaseConfigured} />
            <Item label="Mercado Pago" ok={status.paymentConfigured} />
            <p style={{ marginTop: 10, color: "#93a4bb" }}>Ambiente: {status.environment}</p>
          </div>
        )}

        <a href="/" style={{ display: "inline-flex", marginTop: 28, padding: "12px 18px", borderRadius: 12, background: "white", color: "#07111f", textDecoration: "none", fontWeight: 800 }}>Voltar ao site</a>
      </section>
    </main>
  );
}

function Item({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 18, padding: 16, borderRadius: 14, background: "rgba(255,255,255,.06)" }}>
      <strong>{label}</strong>
      <span style={{ fontWeight: 800, color: ok ? "#67e8a5" : "#ff9a9a" }}>{ok ? "Configurado" : "Falta configurar"}</span>
    </div>
  );
}
