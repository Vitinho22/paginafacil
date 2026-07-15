"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Protected({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="shell" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span className="brand-mark" style={{ margin: "0 auto" }}>P</span>
          <p className="muted" style={{ marginTop: 14 }}>Verificando sua conta...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
