"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type AnswerKey =
  | "nome"
  | "cidade"
  | "whatsapp"
  | "instagram";

type VisualStyle =
  | "Moderno"
  | "Elegante"
  | "Minimalista"
  | "Escuro";

type Answers = {
  nome: string;
  cidade: string;
  whatsapp: string;
  instagram: string;
  estilo: VisualStyle | "";
};

const questions: ReadonlyArray<
  readonly [AnswerKey, string, string]
> = [
  [
    "nome",
    "Qual é o nome do negócio?",
    "Ex.: Pizzaria Itália",
  ],
  [
    "cidade",
    "Em qual cidade você atende?",
    "Ex.: Jundiaí - SP",
  ],
  [
    "whatsapp",
    "Qual é o WhatsApp?",
    "(11) 99999-9999",
  ],
  [
    "instagram",
    "Qual é o Instagram?",
    "@seunegocio",
  ],
];

const visualStyles: Array<{
  id: VisualStyle;
  title: string;
  description: string;
  accent: string;
  background: string;
  dark: string;
  soft: string;
}> = [
  {
    id: "Moderno",
    title: "Moderno",
    description:
      "Seções amplas, tipografia forte e visual atual.",
    accent: "#6d5dfc",
    background: "#f7f6ff",
    dark: "#151a2b",
    soft: "#ded8ff",
  },
  {
    id: "Elegante",
    title: "Elegante",
    description:
      "Composição refinada, espaçamento generoso e acabamento premium.",
    accent: "#b28a4a",
    background: "#fffaf1",
    dark: "#231d16",
    soft: "#ead8b5",
  },
  {
    id: "Minimalista",
    title: "Minimalista",
    description:
      "Poucos elementos, leitura simples e foco no conteúdo.",
    accent: "#111827",
    background: "#f8fafc",
    dark: "#111827",
    soft: "#dfe3e8",
  },
  {
    id: "Escuro",
    title: "Escuro",
    description:
      "Contraste alto, presença marcante e visual tecnológico.",
    accent: "#7c5cff",
    background: "#11131d",
    dark: "#ffffff",
    soft: "#262a39",
  },
];

export default function AssistentePage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [value, setValue] = useState("");
  const [answers, setAnswers] = useState<Answers>({
    nome: "",
    cidade: "",
    whatsapp: "",
    instagram: "",
    estilo: "",
  });
  const [selectedTemplateName, setSelectedTemplateName] =
    useState("");

  const styleStep = step === questions.length;
  const question = questions[step];

  const progress = useMemo(
    () =>
      Math.round(
        ((step + 1) / (questions.length + 1)) * 100,
      ),
    [step],
  );

  useEffect(() => {
    if (question) {
      setValue(answers[question[0]]);
    }
  }, [step, question, answers]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("paginafacil_novo") ||
          "{}",
      ) as {
        nome?: string;
        cidade?: string;
        whatsapp?: string;
        instagram?: string;
        estilo?: VisualStyle;
        templateName?: string;
      };

      setAnswers((current) => ({
        nome: saved.nome || current.nome,
        cidade: saved.cidade || current.cidade,
        whatsapp: saved.whatsapp || current.whatsapp,
        instagram: saved.instagram || current.instagram,
        estilo: saved.estilo || current.estilo,
      }));

      setSelectedTemplateName(
        saved.templateName || "Template selecionado",
      );
    } catch {
      setSelectedTemplateName("Template selecionado");
    }
  }, []);

  function goBack() {
    if (step === 0) {
      router.push("/dashboard/novo-site");
      return;
    }

    setStep((current) => current - 1);
  }

  function next(event?: FormEvent) {
    event?.preventDefault();

    if (!styleStep && question) {
      if (
        question[0] !== "instagram" &&
        !value.trim()
      ) {
        return;
      }

      setAnswers((current) => ({
        ...current,
        [question[0]]: value.trim(),
      }));

      setStep((current) => current + 1);
      return;
    }

    if (!answers.estilo) {
      return;
    }

    const base = JSON.parse(
      localStorage.getItem("paginafacil_novo") ||
        "{}",
    );

    localStorage.setItem(
      "paginafacil_novo",
      JSON.stringify({
        ...base,
        ...answers,
      }),
    );

    router.push("/dashboard/gerando");
  }

  return (
    <>
      <DashboardHeader title="Assistente de criação" />

      <main className="assistant-page">
        <div className="assistant-shell">
          <header className="assistant-top">
            <div>
              <span className="assistant-kicker">
                CONFIGURAÇÃO DO PROJETO
              </span>

              <h1>
                Vamos preparar o seu site com as
                informações certas.
              </h1>

              <p>
                Responda algumas perguntas rápidas. A IA
                usará esses dados para adaptar conteúdo,
                estrutura e identidade visual.
              </p>
            </div>

            <div className="assistant-progress-card">
              <div>
                <small>PROGRESSO</small>
                <strong>{progress}%</strong>
              </div>

              <div className="progress-track">
                <span
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p>
                Etapa {Math.min(step + 1, 5)} de 5
              </p>
            </div>
          </header>

          <section className="assistant-workspace">
            <aside className="assistant-summary">
              <span className="summary-label">
                RESUMO DO PROJETO
              </span>

              <h2>
                {answers.nome ||
                  "Seu novo projeto começa aqui"}
              </h2>

              <div className="summary-list">
                <div>
                  <small>Template</small>
                  <strong>
                    {selectedTemplateName}
                  </strong>
                </div>

                <div>
                  <small>Cidade</small>
                  <strong>
                    {answers.cidade || "Ainda não informado"}
                  </strong>
                </div>

                <div>
                  <small>WhatsApp</small>
                  <strong>
                    {answers.whatsapp ||
                      "Ainda não informado"}
                  </strong>
                </div>

                <div>
                  <small>Estilo</small>
                  <strong>
                    {answers.estilo ||
                      "Escolha na última etapa"}
                  </strong>
                </div>
              </div>

              <div className="summary-note">
                <span>✦</span>

                <p>
                  Você poderá trocar textos, cores, imagens
                  e logo depois que o site for criado.
                </p>
              </div>
            </aside>

            <section className="assistant-card">
              {!styleStep && question ? (
                <form onSubmit={next}>
                  <div className="question-index">
                    0{step + 1}
                  </div>

                  <span className="step-label">
                    INFORMAÇÕES DO NEGÓCIO
                  </span>

                  <h2>{question[1]}</h2>

                  <p>
                    Essa informação será usada para
                    personalizar o conteúdo do site.
                  </p>

                  <input
                    autoFocus
                    value={value}
                    onChange={(event) =>
                      setValue(event.target.value)
                    }
                    placeholder={question[2]}
                  />

                  <div className="assistant-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={goBack}
                    >
                      Voltar
                    </button>

                    <button
                      type="submit"
                      className="primary-button"
                    >
                      Continuar →
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="question-index">05</div>

                  <span className="step-label">
                    DIREÇÃO VISUAL
                  </span>

                  <h2>
                    Como você quer que o site seja
                    percebido?
                  </h2>

                  <p>
                    Escolha uma direção visual. Essa opção
                    será salva e usada na geração do
                    projeto.
                  </p>

                  <div className="visual-style-grid">
                    {visualStyles.map((item) => {
                      const isSelected =
                        answers.estilo === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`visual-style-card ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setAnswers((current) => ({
                              ...current,
                              estilo: item.id,
                            }))
                          }
                          aria-pressed={isSelected}
                        >
                          <div
                            className="style-preview"
                            style={{
                              background:
                                item.background,
                              borderColor: item.soft,
                            }}
                          >
                            <span
                              style={{
                                background:
                                  item.dark,
                              }}
                            />

                            <i
                              style={{
                                background:
                                  item.accent,
                              }}
                            />

                            <div>
                              <b
                                style={{
                                  background:
                                    item.dark,
                                }}
                              />

                              <small
                                style={{
                                  background:
                                    item.soft,
                                }}
                              />

                              <small
                                style={{
                                  background:
                                    item.soft,
                                }}
                              />
                            </div>

                            <em
                              style={{
                                background:
                                  item.accent,
                              }}
                            />
                          </div>

                          <div className="style-content">
                            <div>
                              <strong>
                                {item.title}
                              </strong>

                              <p>
                                {item.description}
                              </p>
                            </div>

                            <span
                              className="selection-indicator"
                              style={{
                                borderColor: isSelected
                                  ? item.accent
                                  : "#d0d5dd",
                                background: isSelected
                                  ? item.accent
                                  : "#ffffff",
                              }}
                            >
                              {isSelected ? "✓" : ""}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="assistant-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={goBack}
                    >
                      Voltar
                    </button>

                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => next()}
                      disabled={!answers.estilo}
                    >
                      Gerar projeto →
                    </button>
                  </div>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>

      <style jsx global>{`
        .assistant-page {
          min-height: 100vh;
          padding: 30px;
          background:
            radial-gradient(
              circle at 92% 4%,
              rgba(118, 87, 255, 0.09),
              transparent 25%
            ),
            #f5f7fb;
          color: #101828;
        }

        .assistant-shell {
          width: min(100%, 1180px);
          margin: 0 auto;
        }

        .assistant-top {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(240px, 300px);
          gap: 36px;
          align-items: end;
          margin-bottom: 24px;
        }

        .assistant-kicker,
        .step-label,
        .summary-label {
          color: #7657ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .assistant-top h1 {
          max-width: 760px;
          margin: 12px 0 12px;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .assistant-top > div > p {
          max-width: 680px;
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.7;
        }

        .assistant-progress-card {
          padding: 18px;
          border: 1px solid #e3e7ed;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 16px 40px
            rgba(16, 24, 40, 0.06);
        }

        .assistant-progress-card > div:first-child {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .assistant-progress-card small {
          color: #98a2b3;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .assistant-progress-card strong {
          color: #7657ff;
          font-size: 18px;
        }

        .progress-track {
          height: 7px;
          margin-top: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: #eceef3;
        }

        .progress-track span {
          height: 100%;
          display: block;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #6e4cff,
            #ab6cff
          );
          transition: width 0.3s ease;
        }

        .assistant-progress-card p {
          margin: 9px 0 0;
          color: #98a2b3;
          font-size: 8px;
        }

        .assistant-workspace {
          display: grid;
          grid-template-columns:
            minmax(250px, 310px)
            minmax(0, 1fr);
          gap: 20px;
          align-items: start;
        }

        .assistant-summary,
        .assistant-card {
          border: 1px solid #e3e7ed;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 20px 55px
            rgba(16, 24, 40, 0.07);
        }

        .assistant-summary {
          padding: 22px;
        }

        .assistant-summary h2 {
          margin: 12px 0 20px;
          font-size: 22px;
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .summary-list {
          display: grid;
          gap: 10px;
        }

        .summary-list > div {
          padding: 12px;
          border: 1px solid #eceef3;
          border-radius: 12px;
          background: #fafbfc;
        }

        .summary-list small,
        .summary-list strong {
          display: block;
        }

        .summary-list small {
          color: #98a2b3;
          font-size: 8px;
        }

        .summary-list strong {
          margin-top: 4px;
          color: #344054;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .summary-note {
          display: flex;
          gap: 9px;
          margin-top: 16px;
          padding: 13px;
          border-radius: 12px;
          color: #5c43d5;
          background: #f4f1ff;
        }

        .summary-note > span {
          font-size: 18px;
        }

        .summary-note p {
          margin: 0;
          color: #667085;
          font-size: 9px;
          line-height: 1.5;
        }

        .assistant-card {
          min-height: 520px;
          padding: 34px;
        }

        .question-index {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-bottom: 18px;
          border-radius: 13px;
          color: #ffffff;
          background: #101828;
          font-size: 10px;
          font-weight: 900;
        }

        .assistant-card h2 {
          max-width: 760px;
          margin: 12px 0 8px;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.02;
          letter-spacing: -0.045em;
        }

        .assistant-card > form > p,
        .assistant-card > div > p {
          max-width: 660px;
          margin: 0;
          color: #667085;
          font-size: 11px;
          line-height: 1.65;
        }

        .assistant-card input {
          width: 100%;
          height: 56px;
          margin-top: 30px;
          padding: 0 16px;
          border: 1px solid #dfe3ea;
          border-radius: 13px;
          color: #344054;
          background: #ffffff;
          outline: none;
          font-size: 13px;
          transition: 0.18s ease;
        }

        .assistant-card input:focus {
          border-color: #7657ff;
          box-shadow: 0 0 0 4px
            rgba(118, 87, 255, 0.1);
        }

        .visual-style-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 26px;
        }

        .visual-style-card {
          padding: 0;
          overflow: hidden;
          border: 1px solid #e3e7ed;
          border-radius: 16px;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .visual-style-card:hover,
        .visual-style-card.selected {
          transform: translateY(-4px);
          border-color: #7657ff;
          box-shadow: 0 18px 35px
            rgba(16, 24, 40, 0.09);
        }

        .style-preview {
          position: relative;
          min-height: 150px;
          padding: 18px;
          border-bottom: 1px solid;
        }

        .style-preview > span {
          width: 42%;
          height: 10px;
          display: block;
          border-radius: 999px;
        }

        .style-preview > i {
          position: absolute;
          right: 18px;
          top: 18px;
          width: 70px;
          height: 70px;
          display: block;
          border-radius: 18px;
          opacity: 0.88;
        }

        .style-preview > div {
          width: 52%;
          display: grid;
          gap: 7px;
          margin-top: 22px;
        }

        .style-preview b,
        .style-preview small {
          display: block;
          border-radius: 999px;
        }

        .style-preview b {
          width: 82%;
          height: 14px;
        }

        .style-preview small {
          width: 100%;
          height: 7px;
        }

        .style-preview small:last-child {
          width: 68%;
        }

        .style-preview em {
          width: 92px;
          height: 28px;
          display: block;
          margin-top: 20px;
          border-radius: 8px;
        }

        .style-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 14px;
        }

        .style-content strong {
          display: block;
          color: #101828;
          font-size: 12px;
        }

        .style-content p {
          margin: 5px 0 0;
          color: #98a2b3;
          font-size: 9px;
          line-height: 1.45;
        }

        .selection-indicator {
          flex: 0 0 auto;
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border: 2px solid;
          border-radius: 999px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
        }

        .assistant-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 30px;
        }

        .assistant-actions button {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 11px;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
        }

        .secondary-button {
          border: 1px solid #dfe3ea;
          color: #475467;
          background: #ffffff;
        }

        .primary-button {
          border: 0;
          color: #ffffff;
          background: linear-gradient(
            135deg,
            #6946ff,
            #9d61ff
          );
          box-shadow: 0 12px 26px
            rgba(105, 70, 255, 0.22);
        }

        .primary-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 900px) {
          .assistant-page {
            padding: 20px;
          }

          .assistant-top,
          .assistant-workspace {
            grid-template-columns: 1fr;
          }

          .assistant-summary {
            order: 2;
          }

          .assistant-card {
            order: 1;
          }
        }

        @media (max-width: 620px) {
          .assistant-page {
            padding: 13px;
          }

          .assistant-card {
            padding: 22px;
            border-radius: 17px;
          }

          .visual-style-grid {
            grid-template-columns: 1fr;
          }

          .assistant-actions button {
            flex: 1;
          }
        }
      `}</style>
    </>
  );
}