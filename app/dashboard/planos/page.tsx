import CheckoutButton from "@/components/CheckoutButton";

const plans = [
  {
    name: "Essencial",
    price: "R$ 0",
    suffix: "para sempre",
    description: "Para começar e testar a plataforma.",
    features: ["1 site publicado", "5 créditos de IA", "Subdomínio PáginaFácil", "Templates essenciais"],
  },
  {
    name: "Profissional",
    price: "R$ 59",
    suffix: "/30 dias",
    description: "Para negócios que querem crescer.",
    features: ["10 sites publicados", "100 créditos de IA", "Domínio próprio", "Logo e Banner Studio", "SEO avançado", "Sem marca PáginaFácil"],
    plan: "profissional" as const,
  },
  {
    name: "Agência",
    price: "R$ 149",
    suffix: "/30 dias",
    description: "Para freelancers, agências e equipes.",
    features: ["Sites ilimitados", "500 créditos de IA", "Área de clientes", "Exportação completa", "White label", "Suporte prioritário"],
    plan: "agencia" as const,
  },
];

export default function Planos() {
  return <><header className="premium-top"><div><small>ASSINATURA</small><h1>Escolha o plano ideal</h1><p>Pague com PIX, cartão ou boleto no ambiente seguro do Mercado Pago.</p></div></header><div className="pricing-wrap"><div className="pricing-heading"><span>PLANOS TRANSPARENTES</span><h2>Tudo para criar, publicar e crescer.</h2><p>Escolha um plano e conclua o pagamento com segurança.</p></div><div className="premium-pricing">{plans.map((p,i)=><article className={i===1?"featured":""} key={p.name}>{i===1&&<em>MAIS ESCOLHIDO</em>}<h3>{p.name}</h3><p>{p.description}</p><div className="price"><strong>{p.price}</strong><span>{p.suffix}</span></div>{p.plan ? <CheckoutButton plan={p.plan} className={i===1?"premium-primary":"outline-button"}>Assinar {p.name}</CheckoutButton> : <button className="outline-button" disabled>Plano atual</button>}<ul>{p.features.map(x=><li key={x}>✓ {x}</li>)}</ul></article>)}</div><div className="trust-line"><span>🔒 Checkout Mercado Pago</span><span>PIX, cartão e boleto</span><span>Suporte em português</span></div></div></>;
}
