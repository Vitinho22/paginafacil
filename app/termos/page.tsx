import Link from "next/link";

export default function LegalPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link className="brand" href="/">
          <span className="brand-mark">P</span>
          <span>PáginaFácil</span>
        </Link>
        <article>
          <p className="smallcaps">Documento institucional</p>
          <h1>Termos de Uso</h1>
          <p>Ao utilizar o PáginaFácil, o usuário é responsável pelo conteúdo publicado em seus projetos. Esta página é uma base inicial e deve receber revisão jurídica antes do lançamento comercial.</p>
          <p>
            Em caso de dúvidas, entre em contato pelos canais oficiais da
            plataforma.
          </p>
          <Link className="btn btn-secondary" href="/">
            Voltar
          </Link>
        </article>
      </div>
    </main>
  );
}
