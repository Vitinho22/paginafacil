"use client";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";
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
  UserRound,
} from "lucide-react";
import { auth } from "@/lib/firebase";

function translate(code: string) {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/popup-closed-by-user": "A janela do Google foi fechada.",
    "auth/popup-blocked": "O navegador bloqueou a janela do Google.",
    "auth/network-request-failed":
      "Falha de conexão. Verifique sua internet e tente novamente.",
  };

  return map[code] || "Não foi possível criar a conta. Tente novamente.";
}

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [erro, setErro] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (senha !== confirmacao) {
      setErro("As senhas não são iguais.");
      return;
    }

    setSending(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      await updateProfile(credential.user, {
        displayName: nome.trim(),
      });

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
    <main className="signup-page">
      <div className="signup-grid-bg" />
      <div className="signup-orb signup-orb-a" />
      <div className="signup-orb signup-orb-b" />

      <header className="signup-header">
        <Link href="/" className="signup-brand">
          <span className="signup-brand-mark">PF</span>
          <span>
            <strong>PáginaFácil</strong>
            <small>AI Studio</small>
          </span>
        </Link>

        <Link href="/login" className="signup-back">
          <ArrowLeft size={16} />
          Já tenho conta
        </Link>
      </header>

      <section className="signup-layout">
        <div className="signup-copy">
          <div className="signup-kicker">
            <Sparkles size={15} />
            Comece gratuitamente
          </div>

          <h1>
            Sua presença digital começa <span>aqui.</span>
          </h1>

          <p>
            Crie sua conta e comece a desenvolver sites, logos e banners
            profissionais em uma única plataforma.
          </p>

          <div className="signup-benefits">
            <span>
              <Check size={15} />
              Sem cartão para começar
            </span>
            <span>
              <Check size={15} />
              Projetos salvos automaticamente
            </span>
            <span>
              <Check size={15} />
              Acesso seguro com Firebase
            </span>
          </div>
        </div>

        <div className="signup-card">
          <div className="signup-card-head">
            <span className="signup-card-icon">
              <ShieldCheck size={20} />
            </span>

            <div>
              <strong>Crie sua conta</strong>
              <small>Leva menos de dois minutos</small>
            </div>
          </div>

          <form onSubmit={submit} className="signup-form">
            <label className="signup-field">
              <span>Seu nome</span>
              <div className="signup-input">
                <UserRound size={18} />
                <input
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite seu nome"
                  autoComplete="name"
                  required
                />
              </div>
            </label>

            <label className="signup-field">
              <span>E-mail</span>
              <div className="signup-input">
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

            <div className="signup-passwords">
              <label className="signup-field">
                <span>Senha</span>
                <div className="signup-input">
                  <LockKeyhole size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="signup-eye"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <label className="signup-field">
                <span>Confirmar senha</span>
                <div className="signup-input">
                  <LockKeyhole size={18} />
                  <input
                    type={showConfirmation ? "text" : "password"}
                    minLength={6}
                    value={confirmacao}
                    onChange={(event) => setConfirmacao(event.target.value)}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="signup-eye"
                    onClick={() => setShowConfirmation((value) => !value)}
                    aria-label={
                      showConfirmation
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                  >
                    {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
            </div>

            {erro && <div className="signup-error">{erro}</div>}

            <button
              className="signup-submit"
              type="submit"
              disabled={sending}
            >
              {sending ? "Criando conta..." : "Criar minha conta"}
              {!sending && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="signup-divider">
            <span />
            <small>OU CONTINUE COM</small>
            <span />
          </div>

          <button
            className="signup-google"
            type="button"
            onClick={google}
            disabled={sending}
          >
            <span className="signup-google-mark">G</span>
            Criar conta com Google
          </button>

          <p className="signup-login">
            Já possui uma conta? <Link href="/login">Entrar agora</Link>
          </p>

          <p className="signup-legal">
            Ao continuar, você concorda com os{" "}
            <Link href="/termos">Termos de Uso</Link> e a{" "}
            <Link href="/privacidade">Política de Privacidade</Link>.
          </p>
        </div>
      </section>

      <footer className="signup-footer">
        <span>© 2026 PáginaFácil AI Studio</span>
        <div>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/termos">Termos</Link>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --bg: #070a13;
          --panel: #101625;
          --line: rgba(255, 255, 255, 0.1);
          --text: #f7f8fc;
          --muted: #919bb0;
          --purple: #7657ff;
          --purple-light: #aa93ff;
          --cyan: #5ad8e8;
          --green: #64dcb8;
        }

        * {
          box-sizing: border-box;
        }

        html {
          color-scheme: dark;
          overflow-x: hidden;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        .signup-page {
          min-height: 100vh;
          width: 100%;
          padding: 22px 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(
              circle at 18% 15%,
              rgba(88, 88, 255, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 82% 12%,
              rgba(121, 70, 255, 0.14),
              transparent 32%
            ),
            linear-gradient(180deg, #080a12 0%, #060810 100%);
        }

        .signup-grid-bg {
          position: absolute;
          inset: 0;
          opacity: 0.09;
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
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
        }

        .signup-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .signup-orb-a {
          width: 360px;
          height: 360px;
          left: -160px;
          bottom: -120px;
          background: rgba(70, 77, 255, 0.14);
        }

        .signup-orb-b {
          width: 400px;
          height: 400px;
          right: -150px;
          top: 70px;
          background: rgba(117, 71, 255, 0.15);
        }

        .signup-header,
        .signup-layout,
        .signup-footer {
          position: relative;
          z-index: 2;
        }

        .signup-header {
          width: min(1180px, 100%);
          min-height: 56px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .signup-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .signup-brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--purple), var(--cyan));
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          box-shadow: 0 12px 30px rgba(118, 87, 255, 0.26);
        }

        .signup-brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .signup-brand strong {
          font-size: 16px;
        }

        .signup-brand small {
          margin-top: 2px;
          color: #7f889d;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .signup-back {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          color: #d4d9e5;
          font-size: 12px;
          font-weight: 800;
        }

        .signup-layout {
          width: min(1120px, 100%);
          margin: auto;
          padding: 54px 0 60px;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
          align-items: center;
          gap: clamp(36px, 6vw, 76px);
        }

        .signup-copy {
          min-width: 0;
          max-width: 520px;
        }

        .signup-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--purple-light);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .signup-copy h1 {
          margin: 22px 0 16px;
          max-width: 100%;
          font-size: clamp(44px, 5vw, 70px);
          line-height: 0.97;
          letter-spacing: -0.06em;
          overflow-wrap: anywhere;
        }

        .signup-copy h1 span {
          background: linear-gradient(90deg, var(--purple-light), var(--cyan));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .signup-copy > p {
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
        }

        .signup-benefits {
          margin-top: 28px;
          display: grid;
          gap: 11px;
          color: #7f899f;
          font-size: 11px;
          font-weight: 700;
        }

        .signup-benefits span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .signup-benefits svg {
          color: var(--green);
        }

        .signup-card {
          width: 100%;
          max-width: 560px;
          min-width: 0;
          justify-self: end;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          position: relative;
          background:
            linear-gradient(
              180deg,
              rgba(17, 23, 40, 0.98),
              rgba(10, 14, 25, 0.98)
            );
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
          backdrop-filter: blur(20px);
        }

        .signup-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          z-index: -1;
          border-radius: 23px;
          background: linear-gradient(
            135deg,
            rgba(170, 147, 255, 0.28),
            transparent 35%,
            transparent 70%,
            rgba(90, 216, 232, 0.16)
          );
        }

        .signup-card-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .signup-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(118, 87, 255, 0.12);
          color: var(--purple-light);
          border: 1px solid rgba(170, 147, 255, 0.14);
        }

        .signup-card-head > div {
          display: flex;
          flex-direction: column;
        }

        .signup-card-head strong {
          font-size: 15px;
        }

        .signup-card-head small {
          margin-top: 3px;
          color: #7f889d;
          font-size: 11px;
        }

        .signup-form {
          display: grid;
          gap: 16px;
        }

        .signup-passwords {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 12px;
        }

        .signup-field {
          min-width: 0;
        }

        .signup-field > span {
          display: block;
          margin-bottom: 8px;
          color: #dce1eb;
          font-size: 11px;
          font-weight: 800;
        }

        .signup-input {
          width: 100%;
          min-width: 0;
          min-height: 52px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          background: #0a0f1c;
          transition: 0.2s ease;
        }

        .signup-input:focus-within {
          border-color: rgba(145, 116, 255, 0.8);
          background: #0d1323;
          box-shadow: 0 0 0 4px rgba(118, 87, 255, 0.09);
        }

        .signup-input > svg {
          color: #6f7990;
          flex: 0 0 auto;
        }

        .signup-input input {
          width: 100%;
          min-width: 0;
          height: 50px;
          flex: 1;
          border: 0 !important;
          outline: 0 !important;
          background: transparent !important;
          color: #f7f8fc !important;
          caret-color: var(--purple-light);
          box-shadow: none !important;
          font-size: 13px;
        }

        .signup-input input::placeholder {
          color: #596378;
        }

        .signup-input input:-webkit-autofill,
        .signup-input input:-webkit-autofill:hover,
        .signup-input input:-webkit-autofill:focus,
        .signup-input input:-webkit-autofill:active {
          -webkit-text-fill-color: #f7f8fc !important;
          caret-color: #f7f8fc !important;
          box-shadow: 0 0 0 1000px #0a0f1c inset !important;
          -webkit-box-shadow: 0 0 0 1000px #0a0f1c inset !important;
          transition: background-color 9999s ease-out 0s;
        }

        .signup-eye {
          width: 34px;
          height: 34px;
          flex: 0 0 auto;
          border: 0;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: transparent;
          color: #778198;
          cursor: pointer;
        }

        .signup-eye:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .signup-error {
          padding: 11px 13px;
          border: 1px solid rgba(255, 102, 117, 0.25);
          border-radius: 10px;
          background: rgba(255, 67, 85, 0.08);
          color: #ff9ca8;
          font-size: 12px;
          line-height: 1.5;
        }

        .signup-submit,
        .signup-google {
          width: 100%;
          min-height: 52px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .signup-submit {
          border: 0;
          background: linear-gradient(135deg, #7452ff, #a173ff);
          color: #fff;
          box-shadow: 0 15px 32px rgba(112, 77, 255, 0.26);
        }

        .signup-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .signup-submit:disabled,
        .signup-google:disabled {
          cursor: wait;
          opacity: 0.65;
        }

        .signup-divider {
          margin: 21px 0;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
        }

        .signup-divider span {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .signup-divider small {
          color: #5f687d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .signup-google {
          border: 1px solid rgba(255, 255, 255, 0.11);
          background: #0a0f1c;
          color: #f1f3f8;
        }

        .signup-google:hover:not(:disabled) {
          border-color: rgba(170, 147, 255, 0.5);
          background: #0d1323;
        }

        .signup-google-mark {
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

        .signup-login {
          margin: 20px 0 0;
          text-align: center;
          color: #7a8499;
          font-size: 11px;
        }

        .signup-login a {
          color: var(--purple-light);
          font-weight: 900;
        }

        .signup-legal {
          margin: 16px 0 0;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          color: #5f687b;
          text-align: center;
          font-size: 9px;
          line-height: 1.6;
        }

        .signup-legal a {
          color: #8d96aa;
          font-weight: 700;
        }

        .signup-footer {
          width: min(1180px, 100%);
          min-height: 36px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: #576176;
          font-size: 9px;
        }

        .signup-footer > div {
          display: flex;
          gap: 18px;
        }

        @media (max-width: 980px) {
          .signup-layout {
            grid-template-columns: 1fr;
            gap: 38px;
            padding-top: 46px;
          }

          .signup-copy {
            max-width: 650px;
            margin: 0 auto;
            text-align: center;
          }

          .signup-copy h1 {
            font-size: clamp(44px, 8vw, 64px);
          }

          .signup-benefits {
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }

          .signup-card {
            justify-self: center;
          }
        }

        @media (max-width: 640px) {
          .signup-page {
            padding: 18px;
          }

          .signup-header {
            align-items: flex-start;
          }

          .signup-back {
            padding: 0 11px;
            font-size: 10px;
          }

          .signup-layout {
            padding: 40px 0 48px;
          }

          .signup-copy h1 {
            font-size: 42px;
          }

          .signup-copy > p {
            font-size: 14px;
          }

          .signup-card {
            padding: 22px 18px;
            border-radius: 19px;
          }

          .signup-passwords {
            grid-template-columns: 1fr;
          }

          .signup-footer {
            flex-direction: column;
            justify-content: center;
            padding-bottom: 4px;
          }
        }

        @media (max-width: 410px) {
          .signup-brand strong {
            font-size: 14px;
          }

          .signup-brand small {
            display: none;
          }

          .signup-brand-mark {
            width: 38px;
            height: 38px;
          }

          .signup-back svg {
            display: none;
          }

          .signup-copy h1 {
            font-size: 38px;
          }
        }
      `}</style>
    </main>
  );
}