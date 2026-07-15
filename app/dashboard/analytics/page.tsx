import DashboardHeader from "@/components/DashboardHeader";

export default function Page() {
  return (
    <>
      <DashboardHeader title="Analytics" />
      <div className="dashboard-content">
        <section className="card" style={{ padding: 28 }}>
          <span className="smallcaps">PáginaFácil</span>
          <h1 className="section-title" style={{ marginTop: 10 }}>Analytics</h1>
          <p className="muted" style={{ lineHeight: 1.7 }}>Os dados aparecerão quando seus sites começarem a receber visitas.</p>
          <div className="empty" style={{ marginTop: 22 }}><div><h3>Em desenvolvimento</h3><p className="muted">A estrutura já está pronta para receber esta funcionalidade.</p></div></div>
        </section>
      </div>
    </>
  );
}
