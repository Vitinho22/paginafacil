import Link from "next/link";

export default function PagamentoSucesso() {
  return <main className="payment-page"><section><span className="payment-icon success">✓</span><small>PAGAMENTO RECEBIDO</small><h1>Seu plano está a caminho.</h1><p>O Mercado Pago confirmou o retorno da compra. Entre na plataforma para continuar.</p><div><Link href="/dashboard" className="premium-primary">Ir para o painel</Link><Link href="/" className="outline-button">Voltar ao site</Link></div><small className="payment-note">A liberação automática definitiva depende da confirmação enviada pelo Mercado Pago.</small></section></main>;
}
