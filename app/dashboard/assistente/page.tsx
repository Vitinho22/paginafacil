"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

const questions = [
  ["nome","Qual é o nome do negócio?","Ex.: Pizzaria Itália"],
  ["cidade","Em qual cidade você atende?","Ex.: Jundiaí - SP"],
  ["whatsapp","Qual é o WhatsApp?","(11) 99999-9999"],
  ["instagram","Qual é o Instagram?","@seunegocio"],
] as const;

export default function AssistentePage() {
  const router = useRouter();
  const [step,setStep] = useState(0);
  const [value,setValue] = useState("");
  const [answers,setAnswers] = useState({nome:"",cidade:"",whatsapp:"",instagram:"",estilo:""});
  const styleStep = step===questions.length;
  const q = questions[step];
  const progress = useMemo(()=>Math.round(((step+1)/(questions.length+1))*100),[step]);

  useEffect(()=>{ if(q) setValue(answers[q[0]]); },[step,q,answers]);

  function next(e?: FormEvent) {
    e?.preventDefault();
    if (!styleStep && q) {
      if (q[0] !== "instagram" && !value.trim()) return;
      setAnswers(a=>({...a,[q[0]]:value.trim()}));
      setStep(s=>s+1);
      return;
    }
    if (!answers.estilo) return;
    const base = JSON.parse(localStorage.getItem("paginafacil_novo")||"{}");
    localStorage.setItem("paginafacil_novo", JSON.stringify({...base,...answers}));
    router.push("/dashboard/gerando");
  }

  return (
    <>
      <DashboardHeader title="Assistente de criação" />
      <div className="dashboard-content light-workspace">
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div style={{ height:7, background:"#dfe5ee", borderRadius:999, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#7256ff,#9f5cff)", transition:".3s" }} />
          </div>

          <section className="card assistant-light-card" style={{ padding:30, marginTop:26 }}>
            {!styleStep && q ? (
              <form onSubmit={next}>
                <span className="smallcaps">Configuração do projeto</span>
                <h1 className="section-title" style={{ marginTop:14 }}>{q[1]}</h1>
                <input className="input" autoFocus value={value} onChange={e=>setValue(e.target.value)} placeholder={q[2]} style={{ marginTop:26 }} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
                  <button type="button" className="btn btn-secondary" onClick={()=>step===0?router.push("/dashboard/novo-site"):setStep(s=>s-1)}>Voltar</button>
                  <button className="btn btn-primary">Continuar</button>
                </div>
              </form>
            ) : (
              <div>
                <span className="smallcaps">Estilo visual</span>
                <h1 className="section-title" style={{ marginTop:14 }}>Escolha a direção visual.</h1>
                <div className="grid" style={{ gridTemplateColumns:"1fr 1fr", marginTop:22 }}>
                  {["Moderno","Elegante","Minimalista","Escuro"].map(s=>(
                    <button key={s} className="card" onClick={()=>setAnswers(a=>({...a,estilo:s}))} style={{
                      padding:20, color:"#172033", textAlign:"left",
                      borderColor:answers.estilo===s?"#7657ff":"#dfe5ee",
                      background:answers.estilo===s?"#f1edff":"#f8f9fc"
                    }}><strong>{s}</strong><p className="muted" style={{ fontSize:13 }}>Base profissional pronta para editar.</p></button>
                  ))}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
                  <button className="btn btn-secondary" onClick={()=>setStep(s=>s-1)}>Voltar</button>
                  <button className="btn btn-primary" onClick={()=>next()} disabled={!answers.estilo}>Gerar projeto</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
