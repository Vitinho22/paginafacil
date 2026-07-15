"use client";

import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

function traduzirErroFirebase(codigo: string) {
  const mensagens: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/popup-closed-by-user": "A janela do Google foi fechada.",
    "auth/popup-blocked": "O navegador bloqueou a janela do Google.",
    "auth/network-request-failed":
      "Falha de conexão. Verifique sua internet e tente novamente.",
    "auth/operation-not-allowed":
      "Este método de cadastro ainda não está ativado no Firebase.",
    "auth/invalid-api-key":
      "A chave do Firebase é inválida ou não foi carregada corretamente.",
    "auth/unauthorized-domain":
      "Este domínio não está autorizado no Firebase.",
    "auth/internal-error":
      "O Firebase encontrou um erro interno. Tente novamente.",
  };

  return mensagens[codigo] ?? "Não foi possível criar a conta. Tente novamente.";
}

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function criarConta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (!nome.trim()) return setErro("Digite seu nome.");
    if (senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirmarSenha) return setErro("As senhas não são iguais.");
    if (!aceitouTermos) {
      return setErro("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
    }

    setCarregando(true);

    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        senha,
      );

      await updateProfile(credencial.user, { displayName: nome.trim() });
      setSucesso("Conta criada com sucesso. Redirecionando...");
      router.replace("/dashboard");
    } catch (error: unknown) {
      console.error("Erro ao criar conta:", error);

      if (error instanceof FirebaseError) {
        setErro(traduzirErroFirebase(error.code));
      } else {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível criar a conta. Tente novamente.",
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  async function criarContaComGoogle() {
    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.replace("/dashboard");
    } catch (error: unknown) {
      console.error("Erro ao criar conta com Google:", error);

      if (error instanceof FirebaseError) {
        setErro(traduzirErroFirebase(error.code));
      } else {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível entrar com o Google.",
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050807] px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#73ff3c] text-base font-black text-black shadow-[0_0_32px_rgba(115,255,60,.24)]">P</span>
            <div>
              <strong className="block text-base font-extrabold tracking-tight">PáginaFácil</strong>
              <span className="block text-[11px] font-semibold text-white/35">Sites profissionais sem código</span>
            </div>
          </Link>
          <Link href="/login" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white/60 transition hover:bg-white/[0.06] hover:text-white">Já tenho conta</Link>
        </header>

        <div className="grid items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
          <section className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#73ff3c]/20 bg-[#73ff3c]/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a4ff83]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#73ff3c]" />
              Comece gratuitamente
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-6xl">Crie sua conta e publique seu primeiro site.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/45">Cadastre-se para criar páginas profissionais, personalizar templates e acompanhar seus resultados em um único painel.</p>
          </section>

          <section className="order-1 overflow-hidden rounded-[30px] border border-white/10 bg-[#090d0b] shadow-[0_35px_100px_rgba(0,0,0,.45)] lg:order-2">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9aff76]">Cadastro</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">Criar uma conta</h2>
              <p className="mt-2 text-sm leading-6 text-white/38">Preencha seus dados para começar.</p>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={criarConta} className="space-y-5">
                <div>
                  <label htmlFor="nome" className="mb-2 block text-sm font-bold text-white/70">Seu nome</label>
                  <input id="nome" type="text" value={nome} onChange={(e) => { setNome(e.target.value); if (erro) setErro(""); }} autoComplete="name" placeholder="Ex.: Victor Rodrigues" required className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#73ff3c]/55 focus:ring-4 focus:ring-[#73ff3c]/10" />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-bold text-white/70">E-mail</label>
                  <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (erro) setErro(""); }} autoComplete="email" placeholder="voce@exemplo.com" required className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#73ff3c]/55 focus:ring-4 focus:ring-[#73ff3c]/10" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="senha" className="mb-2 block text-sm font-bold text-white/70">Senha</label>
                    <input id="senha" type={mostrarSenha ? "text" : "password"} value={senha} onChange={(e) => { setSenha(e.target.value); if (erro) setErro(""); }} autoComplete="new-password" placeholder="Mínimo 6 caracteres" minLength={6} required className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#73ff3c]/55 focus:ring-4 focus:ring-[#73ff3c]/10" />
                  </div>
                  <div>
                    <label htmlFor="confirmarSenha" className="mb-2 block text-sm font-bold text-white/70">Confirmar senha</label>
                    <input id="confirmarSenha" type={mostrarSenha ? "text" : "password"} value={confirmarSenha} onChange={(e) => { setConfirmarSenha(e.target.value); if (erro) setErro(""); }} autoComplete="new-password" placeholder="Repita a senha" minLength={6} required className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#73ff3c]/55 focus:ring-4 focus:ring-[#73ff3c]/10" />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-white/45">
                  <input type="checkbox" checked={mostrarSenha} onChange={(e) => setMostrarSenha(e.target.checked)} className="h-4 w-4 accent-[#73ff3c]" />
                  Mostrar senha
                </label>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-white/45">
                  <input type="checkbox" checked={aceitouTermos} onChange={(e) => { setAceitouTermos(e.target.checked); if (erro) setErro(""); }} className="mt-1 h-4 w-4 flex-none accent-[#73ff3c]" />
                  <span>Concordo com os <Link href="/termos" target="_blank" rel="noreferrer" className="font-bold text-[#9aff76]">Termos de Uso</Link> e a <Link href="/privacidade" target="_blank" rel="noreferrer" className="font-bold text-[#9aff76]">Política de Privacidade</Link>.</span>
                </label>

                {erro && <p role="alert" className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">{erro}</p>}
                {sucesso && <p role="status" className="rounded-2xl border border-[#73ff3c]/20 bg-[#73ff3c]/10 px-4 py-3 text-sm font-semibold text-[#b8ffa0]">{sucesso}</p>}

                <button type="submit" disabled={carregando} className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#73ff3c] px-5 text-sm font-black text-black shadow-[0_16px_42px_rgba(115,255,60,.2)] transition hover:-translate-y-0.5 hover:bg-[#8dff63] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">{carregando ? "Criando conta..." : "Criar minha conta"}</button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/25">ou</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button type="button" onClick={criarContaComGoogle} disabled={carregando} className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-sm font-extrabold text-white transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm font-black text-black">G</span>
                Criar conta com Google
              </button>

              <p className="mt-7 text-center text-sm text-white/40">Já possui uma conta? <Link href="/login" className="font-extrabold text-[#9aff76]">Entrar agora</Link></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}