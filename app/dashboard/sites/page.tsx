"use client";

import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { Site } from "@/types/site";

export default function SitesPage() {
  const { user } = useAuth();
  const [sites,setSites] = useState<Site[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    if (!user) return;
    const q = query(collection(db,"sites"),where("userId","==",user.uid),orderBy("atualizadoEm","desc"));
    return onSnapshot(q,snap=>{
      setSites(snap.docs.map(d=>({id:d.id,...d.data()} as Site)));
      setLoading(false);
    },err=>{
      console.error(err);
      setLoading(false);
    });
  },[user]);

  async function remove(id:string) {
    if (!confirm("Excluir este projeto?")) return;
    await deleteDoc(doc(db,"sites",id));
  }

  return (
    <>
      <DashboardHeader title="Meus sites" />
      <div className="dashboard-content">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"end", gap:16, flexWrap:"wrap" }}>
          <div><span className="smallcaps">Projetos</span><h1 className="section-title" style={{ marginTop:8 }}>Seus sites</h1></div>
          <Link className="btn btn-primary" href="/dashboard/novo-site">+ Criar site</Link>
        </div>

        {loading ? <p className="muted" style={{ marginTop:24 }}>Carregando...</p> :
        sites.length===0 ? (
          <div className="empty card" style={{ marginTop:24 }}>
            <div><h3>Nenhum site criado</h3><p className="muted">Seu primeiro projeto aparecerá aqui.</p><Link className="btn btn-primary" href="/dashboard/novo-site">Criar agora</Link></div>
          </div>
        ) : (
          <div className="site-grid" style={{ marginTop:24 }}>
            {sites.map(site=>(
              <article className="card site-card" key={site.id}>
                <div className="site-thumb"><div className="card" style={{ height:"100%", background:"rgba(255,255,255,.04)", padding:16 }}><strong>{site.nome}</strong><p className="muted" style={{ fontSize:12 }}>{site.segmento}</p></div></div>
                <div className="site-card-body">
                  <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
                    <div><h3 style={{ margin:0 }}>{site.nome}</h3><p className="muted" style={{ margin:"5px 0 0", fontSize:13 }}>{site.cidade || "Local não informado"}</p></div>
                    <span className={`status ${site.status==="publicado"?"status-published":"status-draft"}`}>{site.status}</span>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:18 }}>
                    <Link className="btn btn-primary" href={`/dashboard/editor/${site.id}`}>Editar</Link>
                    <Link className="btn btn-secondary" href={`/site/${site.id}`}>Visualizar</Link>
                    <button className="btn btn-danger" onClick={()=>remove(site.id)}>Excluir</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
