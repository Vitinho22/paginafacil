"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("PáginaFácil runtime error:", error);
  }, [error]);

  return (
    <main className="recovery-screen">
      <section className="recovery-card">
        <span className="recovery-logo">PF</span>
        <small>RECUPERAÇÃO AUTOMÁTICA</small>
        <h1>Não conseguimos abrir esta área.</h1>
        <p>
          A página principal continua disponível. Tente novamente ou abra o diagnóstico para conferir a configuração.
        </p>
        <div className="recovery-actions">
          <button onClick={reset} className="btn btn-primary">Tentar novamente</button>
          <Link href="/" className="btn btn-secondary">Ir para o início</Link>
          <Link href="/diagnostico" className="recovery-link">Abrir diagnóstico</Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <pre className="recovery-detail">{error.message}</pre>
        )}
      </section>
    </main>
  );
}
