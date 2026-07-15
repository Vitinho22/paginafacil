"use client";

import { useState } from "react";

type PlanId = "profissional" | "agencia";

export default function CheckoutButton({
  plan,
  className,
  children,
}: {
  plan: PlanId;
  className?: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/mercadopago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Não foi possível abrir o pagamento.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao iniciar o pagamento.");
      setLoading(false);
    }
  }

  return (
    <div className="checkout-action">
      <button type="button" className={className} onClick={checkout} disabled={loading}>
        {loading ? "Abrindo pagamento..." : children}
      </button>
      {error && <small className="checkout-error">{error}</small>}
    </div>
  );
}
