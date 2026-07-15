"use client";

import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

function translate(code: string) {
  const map: Record<string, string> = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/too-many-requests":
      "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    "auth/popup-closed-by-user": "A janela do Google foi fechada.",
    "auth/popup-blocked": "O navegador bloqueou a janela do Google.",
    "auth/network-request-failed":
      "Falha de conexão. Verifique sua internet e tente novamente.",
  };

  return map[code] || "Não foi possível entrar. Tente novamente.";
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSending(true);

    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithEmailAndPassword(auth, email.trim(), senha);
      router.replace("/dashboard");
    } catch (error: unknown) {
      const code =
        typeof error === "object" && error && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";

      setErro(translate(code));
    } finally {
      setSending(false);
    }
  }

  async function google() {
    setErro("");
    setSending(true);

    try {
      await setPersistence(auth, browserLocalPersistence);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      await signInWithPopup(auth, provider);
      router.replace("/dashboard");
    } catch (error: unknown) {
      const code =
        typeof error === "object" && error && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";

      setErro(translate(code));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-noise" />
      <div className="auth-grid" />
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <header className="auth-header">
        <Link href="/" className="auth-brand">
          <span className="auth-brand-mark">PF</span>

          <span className="auth-brand-copy">
            <strong>PáginaFácil</strong>
            <small>AI Studio</small>
          </span>
        </Link>

        <Link href="/" className="auth-back">
          <ArrowLeft size={16} />
          Voltar ao site
        </Link>
      </header>

      <section className="auth-center">
        <div className="auth-intro">
          <div className="auth-kicker">
            <Sparkles size={15} />
            Sua criação continua daqui
          </div>

          <h1>Entre na sua conta.</h1>

          <p>
            Acesse seus projetos, crie novas páginas e continue construindo uma
            presença digital profissional.
          </p>

          <div className="auth-proof">
            <span>
              <Check size={14} />
              Acesso seguro
            </span>
            <span>
              <Check size={14} />
              Projetos salvos
            </span>
            <span>
              <Check size={14} />
              Sem complicação
            </span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-card-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>Bem-vindo de volta</strong>
              <span>Use seus dados para continuar</span>
            </div>
          </div>

          <form onSubmit={submit} className="auth-form">
            <label className="auth-field">
              <span>E-mail</span>

              <div className="auth-input">
                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Senha</span>

              <div className="auth-input">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />

                <span>Manter minha conta conectada</span>
              </label>

              <Link href="/recuperar-senha">Esqueci minha senha</Link>
            </div>

            {erro && <div className="auth-error">{erro}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={sending}
            >
              <span>{sending ? "Entrando..." : "Entrar na plataforma"}</span>
              {!sending && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <small>OU CONTINUE COM</small>
            <span />
          </div>

          <button
            className="auth-google"
            type="button"
            onClick={google}
            disabled={sending}
          >
            <span className="auth-google-mark">G</span>
            Google
          </button>

          <p className="auth-signup">
            Ainda não possui uma conta?{" "}
            <Link href="/cadastro">Criar gratuitamente</Link>
          </p>

          <div className="auth-secure-note">
            <ShieldCheck size={14} />
            Seus dados são protegidos durante o acesso.
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <span>© 2026 PáginaFácil AI Studio</span>

        <div>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/termos">Termos</Link>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --auth-bg: #060810;
          --auth-card: #0f1422;
          --auth-card-soft: #121827;
          --auth-line: rgba(255, 255, 255, 0.09);
          --auth-text: #f7f8fc;
          --auth-muted: #929bb0;
          --auth-purple: #7657ff;
          --auth-purple-light: #aa93ff;
          --auth-cyan: #5ad8e8;
          --auth-green: #64dcb8;
        }

        * {
          box-sizing: border-box;
        }

        html {
          color-scheme: dark;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          background: var(--auth-bg);
          color: var(--auth-text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        body {
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        .auth-page {
          min-height: 100vh;
          padding: 24px 30px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(
              circle at 18% 16%,
              rgba(91, 92, 255, 0.13),
              transparent 30%
            ),
            radial-gradient(
              circle at 82% 12%,
              rgba(123, 78, 255, 0.15),
              transparent 34%
            ),
            linear-gradient(180deg, #070911 0%, #05070d 100%);
        }

        .auth-noise {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.45'/%3E%3C/svg%3E");
        }

        .auth-grid {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          pointer-events: none;
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.028) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.028) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, #000, transparent 88%);
        }

        .auth-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .auth-glow-one {
          width: 380px;
          height: 380px;
          left: -170px;
          bottom: -130px;
          background: rgba(70, 77, 255, 0.16);
        }

        .auth-glow-two {
          width: 430px;
          height: 430px;
          right: -170px;
          top: 60px;
          background: rgba(117, 71, 255, 0.17);
        }

        .auth-header,
        .auth-center,
        .auth-footer {
          position: relative;
          z-index: 2;
        }

        .auth-header {
          width: min(1180px, 100%);
          min-height: 58px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .auth-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .auth-brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            var(--auth-purple),
            var(--auth-cyan)
          );
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          box-shadow: 0 12px 30px rgba(118, 87, 255, 0.28);
        }

        .auth-brand-copy {
          display: flex;
          flex-direction: column;
        }

        .auth-brand-copy strong {
          font-size: 16px;
          letter-spacing: -0.02em;
        }

        .auth-brand-copy small {
          margin-top: 2px;
          color: #7f889d;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .auth-back {
          min-height: 42px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          color: #d4d9e5;
          font-size: 12px;
          font-weight: 800;
          transition: 0.2s ease;
        }

        .auth-back:hover {
          border-color: rgba(170, 147, 255, 0.55);
          background: rgba(118, 87, 255, 0.08);
        }

        .auth-center {
          width: min(1040px, 100%);
          margin: auto;
          padding: 54px 0 64px;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(430px, 0.78fr);
          align-items: center;
          gap: 88px;
        }

        .auth-intro {
          max-width: 520px;
        }

        .auth-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--auth-purple-light);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .auth-intro h1 {
          margin: 22px 0 16px;
          font-size: clamp(54px, 6vw, 82px);
          line-height: 0.95;
          letter-spacing: -0.065em;
        }

        .auth-intro > p {
          margin: 0;
          color: var(--auth-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .auth-proof {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
          color: #7d879c;
          font-size: 11px;
          font-weight: 700;
        }

        .auth-proof span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .auth-proof svg {
          color: var(--auth-green);
        }

        .auth-card {
          width: 100%;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          position: relative;
          background:
            linear-gradient(
              180deg,
              rgba(17, 23, 40, 0.98),
              rgba(10, 14, 25, 0.98)
            );
          box-shadow:
            0 35px 90px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(22px);
        }

        .auth-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          z-index: -1;
          border-radius: 25px;
          background: linear-gradient(
            135deg,
            rgba(170, 147, 255, 0.32),
            transparent 35%,
            transparent 70%,
            rgba(90, 216, 232, 0.18)
          );
        }

        .auth-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 26px;
        }

        .auth-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(118, 87, 255, 0.12);
          color: var(--auth-purple-light);
          border: 1px solid rgba(170, 147, 255, 0.14);
        }

        .auth-card-top > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .auth-card-top strong {
          font-size: 15px;
        }

        .auth-card-top span {
          margin-top: 3px;
          color: #7f889d;
          font-size: 11px;
        }

        .auth-form {
          display: grid;
          gap: 17px;
        }

        .auth-field > span {
          display: block;
          margin-bottom: 8px;
          color: #dce1eb;
          font-size: 11px;
          font-weight: 800;
        }

        .auth-input {
          min-height: 54px;
          padding: 0 14px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 11px;
          overflow: hidden;
          background: #0a0f1c;
          transition: 0.2s ease;
        }

        .auth-input:focus-within {
          border-color: rgba(145, 116, 255, 0.82);
          background: #0d1323;
          box-shadow: 0 0 0 4px rgba(118, 87, 255, 0.09);
        }

        .auth-input > svg {
          color: #6f7990;
          flex: 0 0 auto;
        }

        .auth-input input {
          min-width: 0;
          height: 52px;
          flex: 1;
          border: 0 !important;
          outline: 0 !important;
          background: transparent !important;
          color: #f7f8fc !important;
          caret-color: var(--auth-purple-light);
          box-shadow: none !important;
          font-size: 14px;
        }

        .auth-input input::placeholder {
          color: #596378;
        }

        .auth-input input:-webkit-autofill,
        .auth-input input:-webkit-autofill:hover,
        .auth-input input:-webkit-autofill:focus,
        .auth-input input:-webkit-autofill:active {
          -webkit-text-fill-color: #f7f8fc !important;
          caret-color: #f7f8fc !important;
          box-shadow: 0 0 0 1000px #0a0f1c inset !important;
          -webkit-box-shadow: 0 0 0 1000px #0a0f1c inset !important;
          transition: background-color 9999s ease-out 0s;
        }

        .auth-password-toggle {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: transparent;
          color: #778198;
          cursor: pointer;
        }

        .auth-password-toggle:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .auth-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .auth-remember {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #858fa4;
          font-size: 11px;
        }

        .auth-remember input {
          width: 16px;
          height: 16px;
          accent-color: var(--auth-purple);
        }

        .auth-options > a {
          color: var(--auth-purple-light);
          font-size: 11px;
          font-weight: 800;
        }

        .auth-error {
          padding: 12px 14px;
          border: 1px solid rgba(255, 102, 117, 0.25);
          border-radius: 11px;
          background: rgba(255, 67, 85, 0.08);
          color: #ff9ca8;
          font-size: 12px;
          line-height: 1.5;
        }

        .auth-submit,
        .auth-google {
          width: 100%;
          min-height: 54px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .auth-submit {
          border: 0;
          background: linear-gradient(135deg, #7452ff, #a173ff);
          color: #fff;
          box-shadow: 0 16px 34px rgba(112, 77, 255, 0.28);
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .auth-submit:disabled,
        .auth-google:disabled {
          cursor: wait;
          opacity: 0.65;
        }

        .auth-divider {
          margin: 22px 0;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
        }

        .auth-divider span {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .auth-divider small {
          color: #5f687d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .auth-google {
          border: 1px solid rgba(255, 255, 255, 0.11);
          background: #0a0f1c;
          color: #f1f3f8;
        }

        .auth-google:hover:not(:disabled) {
          border-color: rgba(170, 147, 255, 0.5);
          background: #0d1323;
        }

        .auth-google-mark {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: #fff;
          color: #4285f4;
          font-size: 13px;
          font-weight: 900;
        }

        .auth-signup {
          margin: 22px 0 0;
          text-align: center;
          color: #7a8499;
          font-size: 11px;
        }

        .auth-signup a {
          color: var(--auth-purple-light);
          font-weight: 900;
        }

        .auth-secure-note {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #677186;
          font-size: 10px;
        }

        .auth-secure-note svg {
          color: var(--auth-green);
        }

        .auth-footer {
          width: min(1180px, 100%);
          min-height: 42px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: #576176;
          font-size: 9px;
        }

        .auth-footer > div {
          display: flex;
          gap: 18px;
        }

        .auth-footer a:hover {
          color: #aeb5c5;
        }

        @media (max-width: 900px) {
          .auth-center {
            grid-template-columns: 1fr;
            gap: 42px;
            padding-top: 54px;
          }

          .auth-intro {
            max-width: 620px;
            margin: 0 auto;
            text-align: center;
          }

          .auth-intro h1 {
            font-size: 58px;
          }

          .auth-proof {
            justify-content: center;
          }

          .auth-card {
            width: min(520px, 100%);
            margin: 0 auto;
          }
        }

        @media (max-width: 560px) {
          .auth-page {
            padding: 18px;
          }

          .auth-header {
            align-items: flex-start;
          }

          .auth-back {
            padding: 0 11px;
            font-size: 10px;
          }

          .auth-center {
            padding: 44px 0 50px;
          }

          .auth-intro h1 {
            font-size: 44px;
          }

          .auth-intro > p {
            font-size: 14px;
          }

          .auth-card {
            padding: 24px 20px;
            border-radius: 20px;
          }

          .auth-options {
            align-items: flex-start;
            flex-direction: column;
          }

          .auth-footer {
            flex-direction: column;
            justify-content: center;
            padding-bottom: 4px;
          }
        }

        @media (max-width: 410px) {
          .auth-brand-copy strong {
            font-size: 14px;
          }

          .auth-brand-copy small {
            display: none;
          }

          .auth-brand-mark {
            width: 38px;
            height: 38px;
          }

          .auth-back svg {
            display: none;
          }

          .auth-intro h1 {
            font-size: 39px;
          }
        }
      `}</style>
    </main>
  );
}