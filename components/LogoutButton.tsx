"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { sair } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await sair();
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn btn-secondary" onClick={handleLogout} disabled={loading} style={{ width: "100%" }}>
      {loading ? "Saindo..." : "Sair da conta"}
    </button>
  );
}
