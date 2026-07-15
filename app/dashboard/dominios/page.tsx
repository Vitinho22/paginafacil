import DashboardHeader from "@/components/DashboardHeader";

export default function Page() {
  return (
    <>
      <DashboardHeader title="Domínios" />
      <div className="dashboard-content">
        <section className="card" style={{ padding: 28 }}>
          <span className="smallcaps">PáginaFácil</span>
          <h1 className="section-title" style={{ marginTop: 10 }}>Domínios</h1>
          <p className="muted" style={{ lineHeight: 1.7 }}>A conexão de domínio próprio será adicionada na próxima versão.</p>
          <div className="empty" style={{ marginTop: 22 }}><div><h3>Em desenvolvimento</h3><p className="muted">A estrutura já está pronta para receber esta funcionalidade.</p></div></div>
        </section>
      </div>
    </>
  );
}
