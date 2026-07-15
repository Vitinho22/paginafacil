"use client";

import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import {
  ArrowRight, BarChart3, Check, Globe2, LayoutTemplate,
  LineChart, Palette, Play, ShieldCheck, Sparkles,
  WandSparkles, Zap
} from "lucide-react";

const features = [
  [WandSparkles, "Sites criados com IA", "Estrutura, textos e seções profissionais adaptadas ao seu segmento."],
  [Palette, "Identidade visual completa", "Logo, paleta, tipografia e linguagem visual consistentes."],
  [LayoutTemplate, "Banners de alto nível", "Artes para anúncios, redes sociais e campanhas."],
  [Globe2, "Domínio e publicação", "Publique com endereço próprio e transmita mais confiança."],
  [LineChart, "SEO e conversão", "Páginas rápidas e preparadas para busca e vendas."],
  [BarChart3, "Analytics e leads", "Acompanhe visitas, cliques e contatos em um só painel."]
];

const steps = [
  ["01", "Conte sobre seu negócio", "Responda perguntas rápidas sobre sua empresa e objetivo."],
  ["02", "A IA cria a direção visual", "A plataforma monta a primeira versão da sua marca."],
  ["03", "Personalize visualmente", "Edite textos, cores e imagens sem programação."],
  ["04", "Publique e acompanhe", "Coloque no ar e acompanhe visitas e oportunidades."]
];

export default function Home() {
  return (
    <main className="home-premium">
      <header className="nav">
        <Link href="/" className="brand">
          <span className="brand-mark">PF</span>
          <span><strong>PáginaFácil</strong><small>AI Studio</small></span>
        </Link>

        <nav>
          <a href="#recursos">Recursos</a>
          <a href="#como">Como funciona</a>
          <a href="#planos">Planos</a>
        </nav>

        <div className="nav-actions">
          <Link href="/login" className="login">Entrar</Link>
          <Link href="/cadastro" className="button small">
            Criar gratuitamente <ArrowRight size={15}/>
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-grid"/>
        <div className="orb orb-a"/>
        <div className="orb orb-b"/>

        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> Plataforma de criação com IA</div>
          <h1>Sua empresa com presença digital de <span>alto nível.</span></h1>
          <p>
            Crie site, logo, banners e materiais profissionais em uma única plataforma —
            sem depender de agência, designer ou programação.
          </p>

          <div className="hero-actions">
            <Link href="/cadastro" className="button large">
              Criar minha marca agora <ArrowRight size={18}/>
            </Link>
            <a href="#demo" className="button secondary large">
              <Play size={16} fill="currentColor"/> Ver demonstração
            </a>
          </div>

          <div className="trust">
            <span><Check size={14}/> Comece grátis</span>
            <span><Check size={14}/> Sem cartão</span>
            <span><Check size={14}/> Pronto em minutos</span>
          </div>
        </div>

        <div className="hero-visual" id="demo">
          <div className="visual-glow"/>
          <div className="browser">
            <div className="browser-top">
              <div><i/><i/><i/></div>
              <span>app.paginafacil.ai/banner-studio</span>
              <b><em/> Online</b>
            </div>

            <div className="app-shell">
              <aside>
                <div className="mini-logo">PF</div>
                <i className="active"/><i/><i/><i/><i/>
              </aside>

              <section className="workspace">
                <div className="workspace-head">
                  <div><small>BANNER STUDIO</small><strong>Crie anúncios profissionais</strong></div>
                  <button><Sparkles size={12}/> Gerar com IA</button>
                </div>

                <div className="workspace-grid">
                  <div className="controls">
                    <small>IMAGEM PRINCIPAL</small>
                    <div className="upload">
                      <div className="upload-photo"/>
                      <span>cozinha-premium.jpg</span>
                    </div>

                    <small>FORMATO</small>
                    <div className="formats">
                      <span className="selected">Instagram</span><span>Stories</span>
                      <span>Pinterest</span><span>YouTube</span>
                    </div>

                    <small>ESTILO</small>
                    <div className="styles">
                      <span className="selected">Luxo</span>
                      <span>Moderno</span>
                      <span>Minimalista</span>
                    </div>
                  </div>

                  <div className="creative">
                    <div className="creative-image">
                      <div className="creative-overlay"/>
                      <div className="creative-copy">
                        <small>DESIGN QUE IMPRESSIONA</small>
                        <h3>Transforme sua presença digital.</h3>
                        <p>Uma comunicação profissional muda a forma como o cliente enxerga sua marca.</p>
                        <button>Conhecer agora</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="float-card left">
            <span className="float-icon"><Zap size={18}/></span>
            <div><small>GERAÇÃO RÁPIDA</small><strong>Design pronto em segundos</strong></div>
          </div>

          <div className="float-card right">
            <span className="float-icon green"><ShieldCheck size={18}/></span>
            <div><small>RESULTADO PROFISSIONAL</small><strong>Visual de alto padrão</strong></div>
          </div>
        </div>
      </section>

      <section className="businesses">
        <span>CRIADO PARA NEGÓCIOS QUE QUEREM CRESCER COM PROFISSIONALISMO</span>
        <div>{["Restaurantes","Clínicas","Prestadores","Lojas","Agências","Profissionais"].map(x=><strong key={x}>{x}</strong>)}</div>
      </section>

      <section id="recursos" className="section light">
        <div className="section-title">
          <div className="eyebrow dark"><Sparkles size={14}/> Tudo em um único lugar</div>
          <h2>Uma plataforma completa para sua marca parecer <span>maior e mais profissional.</span></h2>
          <p>Crie, publique, divulgue e acompanhe sua presença digital sem complicação.</p>
        </div>

        <div className="feature-grid">
          {features.map(([Icon,title,text]:any)=>
            <article key={title}>
              <span className="feature-icon"><Icon size={23}/></span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="#">Conhecer recurso <ArrowRight size={15}/></a>
            </article>
          )}
        </div>
      </section>

      <section id="como" className="section process">
        <div className="process-copy">
          <div className="eyebrow"><Sparkles size={14}/> Do zero ao online</div>
          <h2>Simples de usar.<br/>Sofisticado no resultado.</h2>
          <p>Você não precisa entender de design ou programação. A plataforma guia todo o processo.</p>

          <div className="steps">
            {steps.map(([n,t,d])=>
              <article key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></article>
            )}
          </div>
        </div>

        <div className="showcase">
          <div className="showcase-label"><span>RESULTADO GERADO</span><strong>Site profissional em minutos</strong></div>
          <div className="showcase-window">
            <div className="showcase-top"><i/><i/><i/><span>atelierarquitetura.com.br</span></div>
            <div className="showcase-site">
              <div className="showcase-overlay"/>
              <div className="showcase-nav"><strong>ATELIER</strong><span>Projetos</span><span>Sobre</span><span>Contato</span></div>
              <div className="showcase-copy">
                <small>ARQUITETURA CONTEMPORÂNEA</small>
                <h3>Espaços que traduzem sua essência.</h3>
                <p>Projetos autorais com equilíbrio entre estética, função e identidade.</p>
                <button>Conhecer projetos</button>
              </div>
            </div>
          </div>
          <div className="result-badge"><Check size={16}/> SEO, responsividade e conversão incluídos</div>
        </div>
      </section>

      <section id="planos" className="section light pricing">
        <div className="section-title">
          <div className="eyebrow dark"><Sparkles size={14}/> Planos transparentes</div>
          <h2>Comece gratuitamente.<br/>Cresça quando estiver pronto.</h2>
        </div>

        <div className="plans">
          <article>
            <small>ESSENCIAL</small><h3>R$ 0</h3><p>Para conhecer a plataforma.</p>
            <ul><li><Check size={15}/>1 site</li><li><Check size={15}/>5 créditos de IA</li><li><Check size={15}/>Templates essenciais</li></ul>
            <Link href="/cadastro">Começar grátis</Link>
          </article>

          <article className="featured">
            <em>MAIS ESCOLHIDO</em><small>PROFISSIONAL</small><h3>R$ 59<sup>/mês</sup></h3><p>Para negócios que querem crescer.</p>
            <ul><li><Check size={15}/>Até 10 sites</li><li><Check size={15}/>Logo Studio</li><li><Check size={15}/>Banner Studio</li><li><Check size={15}/>Domínio próprio</li><li><Check size={15}/>SEO e analytics</li></ul>
            <CheckoutButton plan="profissional" className="checkout">Escolher Profissional</CheckoutButton>
          </article>

          <article>
            <small>AGÊNCIA</small><h3>R$ 149<sup>/mês</sup></h3><p>Para atender vários clientes.</p>
            <ul><li><Check size={15}/>Sites ilimitados</li><li><Check size={15}/>White label</li><li><Check size={15}/>Área de clientes</li><li><Check size={15}/>Créditos ampliados</li><li><Check size={15}/>Suporte prioritário</li></ul>
            <CheckoutButton plan="agencia" className="checkout">Escolher Agência</CheckoutButton>
          </article>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-glow"/>
        <div>
          <div className="eyebrow"><Sparkles size={14}/> Sua próxima fase começa aqui</div>
          <h2>Pare de apresentar seu negócio<br/>com aparência improvisada.</h2>
          <p>Crie uma presença digital profissional, confiável e pronta para vender.</p>
          <Link href="/cadastro" className="button large">Criar gratuitamente <ArrowRight size={18}/></Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">
              <span className="brand-mark">PF</span>
              <span><strong>PáginaFácil</strong><small>AI Studio</small></span>
            </Link>
            <p>Tecnologia para transformar pequenos negócios em marcas profissionais.</p>
          </div>
          <div><strong>Plataforma</strong><a href="#recursos">Recursos</a><a href="#como">Como funciona</a><a href="#planos">Planos</a></div>
          <div><strong>Conta</strong><Link href="/login">Entrar</Link><Link href="/cadastro">Criar conta</Link></div>
          <div><strong>Legal</strong><Link href="/privacidade">Privacidade</Link><Link href="/termos">Termos</Link></div>
        </div>
        <div className="footer-bottom"><span>© 2026 PáginaFácil AI Studio</span><span>Feito para negócios que querem crescer.</span></div>
      </footer>

      <style jsx global>{`
        :root{--bg:#070a13;--panel:#111728;--text:#f7f8fc;--muted:#a2aac0;--purple:#7a5cff;--cyan:#55d7e8;--line:rgba(255,255,255,.09);--light:#f6f7fb;--dark:#141827}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{text-decoration:none;color:inherit}button{font:inherit}
        .home-premium{overflow:hidden;background:var(--bg)}.nav{width:min(1440px,calc(100% - 48px));min-height:82px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);position:relative;z-index:20}
        .brand{display:inline-flex;align-items:center;gap:12px}.brand-mark{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(135deg,var(--purple),var(--cyan));font-weight:900;box-shadow:0 12px 30px rgba(122,92,255,.28)}.brand>span:last-child{display:flex;flex-direction:column}.brand strong{font-size:16px}.brand small{margin-top:2px;color:#8e97ad;font-size:10px;letter-spacing:.07em;text-transform:uppercase}
        .nav>nav{display:flex;gap:34px;color:#aab2c7;font-size:13px;font-weight:650}.nav>nav a:hover{color:#fff}.nav-actions{display:flex;align-items:center;gap:18px}.login{font-size:13px;font-weight:700}
        .button{min-height:48px;padding:0 22px;border-radius:13px;display:inline-flex;align-items:center;justify-content:center;gap:10px;font-size:13px;font-weight:800;background:linear-gradient(135deg,#7452ff,#a173ff);box-shadow:0 14px 30px rgba(112,77,255,.28);transition:.2s}.button:hover{transform:translateY(-2px);filter:brightness(1.05)}.button.small{min-height:42px;padding:0 17px;border-radius:11px;font-size:12px}.button.large{min-height:56px;padding:0 25px}.button.secondary{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.03);box-shadow:none}
        .hero{width:min(1440px,calc(100% - 48px));min-height:760px;margin:auto;padding:95px 0 105px;display:grid;grid-template-columns:.9fr 1.1fr;align-items:center;gap:70px;position:relative}.hero-grid{position:absolute;inset:0;opacity:.14;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:60px 60px;mask-image:linear-gradient(to bottom,black,transparent 90%)}.orb{position:absolute;border-radius:50%;filter:blur(90px)}.orb-a{width:360px;height:360px;left:-160px;top:40px;background:rgba(78,84,255,.18)}.orb-b{width:440px;height:440px;right:-150px;top:30px;background:rgba(126,66,255,.2)}
        .hero-copy,.hero-visual{position:relative;z-index:2}.eyebrow{display:inline-flex;align-items:center;gap:8px;color:#a991ff;font-size:11px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}.eyebrow.dark{color:#6d4fe7}.hero h1{max-width:650px;margin:24px 0 22px;font-size:clamp(52px,5.4vw,82px);line-height:.98;letter-spacing:-.06em}.hero h1 span{background:linear-gradient(90deg,#9d80ff,#6ee7ef);-webkit-background-clip:text;color:transparent}.hero-copy>p{max-width:610px;margin:0;color:#aeb6ca;font-size:18px;line-height:1.7}.hero-actions{margin-top:34px;display:flex;gap:14px;flex-wrap:wrap}.trust{margin-top:23px;display:flex;gap:22px;color:#7f899f;font-size:11px;font-weight:650;flex-wrap:wrap}.trust span{display:flex;align-items:center;gap:6px}.trust svg{color:#6ee7c7}
        .hero-visual{min-height:620px;display:grid;place-items:center}.visual-glow{position:absolute;width:76%;height:76%;border-radius:50%;background:rgba(105,69,255,.22);filter:blur(80px)}.browser{width:100%;position:relative;z-index:2;overflow:hidden;border:1px solid rgba(255,255,255,.14);border-radius:22px;background:#0e1424;box-shadow:0 50px 120px rgba(0,0,0,.48);transform:perspective(1400px) rotateY(-4deg)}
        .browser-top{height:52px;padding:0 18px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border-bottom:1px solid rgba(255,255,255,.06);background:#141a2d;color:#606b82;font-size:9px}.browser-top>div{display:flex;gap:7px}.browser-top i,.showcase-top i{width:8px;height:8px;border-radius:50%;background:#4e5870}.browser-top b{justify-self:end;display:flex;align-items:center;gap:6px;font-weight:500}.browser-top em{width:7px;height:7px;border-radius:50%;background:#4de0b0}
        .app-shell{min-height:510px;display:grid;grid-template-columns:58px 1fr}.app-shell aside{padding:16px 11px;border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;align-items:center;gap:17px;background:#0b1020}.mini-logo{width:31px;height:31px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(135deg,#7a5cff,#a173ff);font-size:9px;font-weight:900}.app-shell aside i{width:20px;height:20px;border-radius:6px;background:rgba(255,255,255,.035);position:relative}.app-shell aside i:after{content:"";position:absolute;inset:7px;border:1px solid #56617a;border-radius:2px}.app-shell aside i.active{background:rgba(122,92,255,.13)}.app-shell aside i.active:after{border-color:#8f75ff}
        .workspace{padding:21px}.workspace-head{margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}.workspace-head>div{display:flex;flex-direction:column}.workspace-head small,.controls>small{color:#6e7890;font-size:8px;letter-spacing:.09em}.workspace-head strong{margin-top:5px;font-size:14px}.workspace-head button{min-height:36px;padding:0 13px;border:0;border-radius:9px;background:linear-gradient(135deg,#7352fa,#a16dff);color:#fff;display:flex;align-items:center;gap:6px;font-size:9px;font-weight:800}.workspace-grid{display:grid;grid-template-columns:180px 1fr;gap:16px}.controls{min-height:400px;padding:14px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:#11182a}.controls>small{display:block;margin:13px 0 8px}.controls>small:first-child{margin-top:0}.upload{overflow:hidden;border:1px solid rgba(151,127,255,.24);border-radius:10px;background:#0c1221}.upload-photo{height:80px;background:url("https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=500&q=80") center/cover}.upload span{display:block;padding:7px;color:#a8b0c2;font-size:7px}.formats{display:grid;grid-template-columns:1fr 1fr;gap:6px}.formats span,.styles span{min-height:30px;padding:0 7px;border:1px solid rgba(255,255,255,.07);border-radius:7px;display:flex;align-items:center;justify-content:center;color:#8992a8;font-size:7px;font-weight:700}.formats .selected,.styles .selected{border-color:rgba(143,117,255,.55);background:rgba(122,92,255,.12);color:#b9a8ff}.styles{display:grid;gap:6px}
        .creative{border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:12px;background:#0b1020;display:grid;place-items:center}.creative-image{width:100%;aspect-ratio:1.25;border-radius:10px;position:relative;overflow:hidden;background:url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85") center/cover}.creative-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,7,13,.95),rgba(5,7,13,.65) 52%,rgba(5,7,13,.04))}.creative-copy{position:absolute;left:7%;top:14%;width:54%}.creative-copy small{color:#b5a4ff;font-size:7px;font-weight:800}.creative-copy h3{margin:10px 0 9px;font-size:clamp(18px,2.05vw,34px);line-height:1.02}.creative-copy p{margin:0;color:#bac1d2;font-size:clamp(7px,.75vw,11px);line-height:1.5}.creative-copy button{margin-top:18px;min-height:31px;padding:0 13px;border:0;border-radius:7px;background:#fff;color:#121625;font-size:7px;font-weight:900;text-transform:uppercase}
        .float-card{position:absolute;z-index:3;min-width:230px;min-height:72px;padding:12px 15px;border:1px solid rgba(255,255,255,.13);border-radius:16px;background:rgba(14,20,36,.82);backdrop-filter:blur(18px);box-shadow:0 20px 55px rgba(0,0,0,.34);display:flex;align-items:center;gap:12px}.float-card.left{left:-38px;bottom:48px}.float-card.right{right:-24px;top:65px}.float-icon{width:42px;height:42px;border-radius:12px;background:rgba(122,92,255,.15);color:#a991ff;display:grid;place-items:center}.float-icon.green{color:#5de3bc;background:rgba(93,227,188,.12)}.float-card div{display:flex;flex-direction:column}.float-card small{color:#737e96;font-size:7px;font-weight:900}.float-card strong{margin-top:5px;font-size:11px}
        .businesses{padding:29px 24px 35px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);text-align:center;background:#090d17}.businesses>span{color:#626d84;font-size:9px;font-weight:900;letter-spacing:.15em}.businesses>div{margin-top:23px;display:flex;justify-content:center;gap:clamp(25px,5vw,75px);flex-wrap:wrap}.businesses strong{color:#8f98ac;font-size:12px}
        .section{padding:120px 24px}.light{background:var(--light);color:var(--dark)}.section-title{max-width:800px;margin:0 auto 62px;text-align:center}.section-title h2{margin:20px 0 18px;font-size:clamp(38px,4.5vw,64px);line-height:1.04;letter-spacing:-.055em}.section-title h2 span{color:#7255e8}.section-title p{color:#666f84;font-size:16px}
        .feature-grid{width:min(1240px,100%);margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.feature-grid article{min-height:285px;padding:30px;border:1px solid #e5e7ef;border-radius:20px;background:#fff;box-shadow:0 18px 45px rgba(27,34,51,.06);transition:.22s}.feature-grid article:hover{transform:translateY(-5px);box-shadow:0 26px 55px rgba(74,58,154,.11)}.feature-icon{width:50px;height:50px;border-radius:15px;background:linear-gradient(135deg,#f0edff,#e7fbfd);color:#6d4fe7;display:grid;place-items:center}.feature-grid h3{margin:24px 0 12px;font-size:20px}.feature-grid p{color:#727a8d;font-size:14px;line-height:1.65}.feature-grid a{margin-top:24px;color:#6648df;display:flex;align-items:center;gap:5px;font-size:12px;font-weight:800}
        .process{width:min(1440px,100%);margin:auto;display:grid;grid-template-columns:.88fr 1.12fr;gap:90px;align-items:center;background:#090d17}.process-copy h2{margin:22px 0 20px;font-size:clamp(42px,4.5vw,68px);line-height:1.02;letter-spacing:-.055em}.process-copy>p{color:#9ca5bb;line-height:1.7}.steps{margin-top:38px}.steps article{padding:18px 0;border-top:1px solid rgba(255,255,255,.09);display:grid;grid-template-columns:46px 1fr;gap:15px}.steps article>span{color:#8063f2;font-size:12px;font-weight:900}.steps p{margin:6px 0 0;color:#7f899f;font-size:12px}
        .showcase{position:relative}.showcase-label{margin-bottom:16px;display:flex;justify-content:space-between}.showcase-label span{color:#7d68db;font-size:9px;font-weight:900}.showcase-label strong{font-size:13px}.showcase-window{overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:22px;background:#111728;box-shadow:0 45px 110px rgba(0,0,0,.4)}.showcase-top{height:48px;padding:0 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:7px;color:#69748b;font-size:8px}.showcase-top span{margin:auto}.showcase-site{min-height:510px;padding:28px 32px;position:relative;background:url("https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85") center/cover}.showcase-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,9,14,.93),rgba(7,9,14,.46) 58%,rgba(7,9,14,.08))}.showcase-nav,.showcase-copy{position:relative;z-index:2}.showcase-nav{display:flex;gap:28px;color:rgba(255,255,255,.72);font-size:9px}.showcase-nav strong{margin-right:auto}.showcase-copy{width:62%;margin-top:105px}.showcase-copy small{color:#c9b67a;font-size:9px;font-weight:900}.showcase-copy h3{margin:15px 0 14px;font-size:clamp(38px,4vw,62px);line-height:.98}.showcase-copy p{color:rgba(255,255,255,.78);font-size:13px}.showcase-copy button{margin-top:20px;min-height:44px;padding:0 19px;border:1px solid rgba(255,255,255,.35);border-radius:9px;background:rgba(255,255,255,.07);color:#fff;font-size:9px;font-weight:900}.result-badge{position:absolute;right:-22px;bottom:-22px;min-height:56px;padding:0 17px;border:1px solid rgba(255,255,255,.13);border-radius:15px;background:rgba(17,23,40,.92);display:flex;align-items:center;gap:9px;font-size:10px}.result-badge svg{color:#60dfb5}
        .plans{width:min(1120px,100%);margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.plans article{padding:31px;border:1px solid #e2e5ed;border-radius:22px;background:#fff;position:relative}.plans article.featured{border-color:#7960ee;background:linear-gradient(180deg,#13182a,#0d1220);color:#fff;transform:translateY(-13px);box-shadow:0 28px 70px rgba(70,52,153,.25)}.plans em{position:absolute;top:-13px;left:50%;transform:translateX(-50%);padding:7px 13px;border-radius:999px;background:linear-gradient(135deg,#7352f8,#a36fff);color:#fff;font-size:8px;font-style:normal;font-weight:900}.plans small{color:#7257df;font-size:10px;font-weight:900}.plans h3{font-size:42px;margin:16px 0 0}.plans sup{font-size:12px;color:#7a8294}.plans p{color:#757d90;font-size:13px}.plans ul{min-height:190px;margin:25px 0;padding:0;list-style:none;display:grid;align-content:start;gap:13px}.plans li{display:flex;gap:9px;color:#555e73;font-size:12px}.featured li{color:#b9c0d1}.plans article>a,.checkout{width:100%;min-height:47px;border:1px solid #d9dce5;border-radius:11px;background:#fff;color:#1e2432;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900}.featured .checkout{border:0;background:linear-gradient(135deg,#7453fa,#a473ff);color:#fff}
        .final-cta{min-height:540px;padding:100px 24px;display:grid;place-items:center;text-align:center;position:relative;overflow:hidden}.final-glow{position:absolute;width:680px;height:360px;border-radius:50%;background:rgba(100,66,255,.22);filter:blur(80px)}.final-cta>div:last-child{position:relative;z-index:2}.final-cta h2{margin:22px 0 18px;font-size:clamp(42px,5vw,72px);line-height:1.02}.final-cta p{margin:0 0 28px;color:#a0a9bd}
        .footer{width:min(1440px,calc(100% - 48px));margin:auto;padding:65px 0 28px}.footer-grid{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:45px}.footer-grid>div:first-child p{max-width:330px;color:#79839a;font-size:12px}.footer-grid>div:not(:first-child){display:flex;flex-direction:column;gap:13px}.footer-grid a{color:#7f899f;font-size:11px}.footer-bottom{margin-top:55px;padding-top:22px;border-top:1px solid var(--line);display:flex;justify-content:space-between;color:#5f697f;font-size:10px}
        @media(max-width:1120px){.hero{grid-template-columns:1fr}.hero-copy{text-align:center}.hero-copy>p,.hero h1{margin-left:auto;margin-right:auto}.hero-actions,.trust{justify-content:center}.process{grid-template-columns:1fr}.feature-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:780px){.nav{width:calc(100% - 28px)}.nav>nav,.login{display:none}.hero{width:calc(100% - 28px);padding:70px 0 80px}.hero h1{font-size:48px}.browser{transform:none}.workspace-grid{grid-template-columns:1fr}.controls,.float-card{display:none}.app-shell{grid-template-columns:44px 1fr}.section{padding:85px 18px}.feature-grid,.plans{grid-template-columns:1fr}.plans article.featured{transform:none}.process{padding-left:18px;padding-right:18px}.showcase-copy{width:85%}.result-badge{position:static;margin-top:14px}.footer-grid{grid-template-columns:1fr 1fr}.footer-grid>div:first-child{grid-column:1/-1}.footer-bottom{flex-direction:column;gap:9px}}
        @media(max-width:480px){.nav-actions .button{font-size:10px;padding:0 12px}.hero h1{font-size:40px}.hero-actions{display:grid}.hero-actions a{width:100%}.browser-top{grid-template-columns:1fr auto}.browser-top>span{display:none}.creative-copy{width:68%}.section-title h2,.process-copy h2{font-size:38px}.footer-grid{grid-template-columns:1fr}.footer-grid>div:first-child{grid-column:auto}}
      `}</style>
    </main>
  );
}
