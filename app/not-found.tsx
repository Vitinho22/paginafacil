import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div>
        <span className="brand-mark">P</span>
        <p className="smallcaps">Erro 404</p>
        <h1>Esta página não foi encontrada.</h1>
        <p>
          O endereço pode ter sido alterado ou a página ainda não está
          disponível.
        </p>
        <Link className="btn btn-primary" href="/">
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
