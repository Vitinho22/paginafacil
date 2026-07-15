"use client";

import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TemplateRenderer from "@/components/TemplateRenderer";
import { db } from "@/lib/firebase";
import type { Site } from "@/types/site";

export default function PublicSitePage() {
  const params = useParams<{ id: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "sites", params.id))
      .then((snapshot) => {
        if (!snapshot.exists()) {
          setMissing(true);
          return;
        }
        setSite({ id: snapshot.id, ...snapshot.data() } as Site);
      })
      .catch(() => setMissing(true));
  }, [params.id]);

  if (missing) {
    return (
      <main className="public-loading">
        <h1>Site não encontrado</h1>
      </main>
    );
  }

  if (!site) {
    return (
      <main className="public-loading">
        <p>Carregando...</p>
      </main>
    );
  }

  return <TemplateRenderer site={site} />;
}
