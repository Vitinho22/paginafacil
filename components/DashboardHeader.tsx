import Link from "next/link";

export default function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="topbar">
      <div>
        <span className="muted" style={{ fontSize: 12 }}>Área de trabalho</span>
        <strong style={{ display: "block", marginTop: 3 }}>{title}</strong>
      </div>

      <Link className="btn btn-primary" href="/dashboard/novo-site">
        + Criar site
      </Link>
    </header>
  );
}
