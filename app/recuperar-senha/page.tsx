"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { auth } from "@/lib/firebase";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErro(""); setSucesso(""); setSending(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSucesso("Enviamos as instruções para redefinir sua senha.");
    } catch {
      setErro("Não foi possível enviar o e-mail. Confira o endereço.");
    } finally { setSending(false); }
  }

  return (
    <main className="shell" style={{ display:"grid", placeItems:"center", padding:20 }}>
      <section className="card" style={{ width:"min(480px,100%)", padding:30 }}>
        <Link className="brand" href="/"><span className="brand-mark">P</span><span>PáginaFácil</span></Link>
        <h1 className="section-title" style={{ marginTop:28 }}>Recuperar senha</h1>
        <p className="muted" style={{ lineHeight:1.7 }}>Digite seu e-mail para receber o link de redefinição.</p>
        <form onSubmit={submit} style={{ marginTop:24, display:"grid", gap:16 }}>
          <div><label className="label">E-mail</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          {erro && <p className="error">{erro}</p>}
          {sucesso && <p className="success">{sucesso}</p>}
          <button className="btn btn-primary" disabled={sending}>{sending ? "Enviando..." : "Enviar link"}</button>
        </form>
        <p className="muted" style={{ textAlign:"center", marginTop:20 }}><Link href="/login" style={{ color:"#9ae6c2" }}>Voltar ao login</Link></p>
      </section>
    </main>
  );
}
