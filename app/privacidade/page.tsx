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
          <h1>Política de Privacidade</h1>
          <p>O PáginaFácil utiliza dados de conta para autenticação, criação de projetos e funcionamento da plataforma. As informações não são vendidas. Este texto é uma base inicial e deve ser revisado antes do lançamento comercial.</p>
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
