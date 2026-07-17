"use client";

import { useEffect } from "react";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import {
  ArrowRight, BarChart3, Check, Globe2, LayoutTemplate,
  LineChart, Palette, Sparkles,
  WandSparkles
} from "lucide-react";

const features = [
  [WandSparkles, "Sites profissionais", "Estrutura, textos e seções adaptadas ao seu segmento."],
  [Palette, "Identidade visual", "Logo, paleta e tipografia consistentes para sua marca."],
  [LayoutTemplate, "Banners de alto nível", "Artes para anúncios, redes sociais e campanhas."],
  [Globe2, "Domínio e publicação", "Publique com endereço próprio e transmita mais confiança."],
  [LineChart, "SEO e conversão", "Páginas rápidas e preparadas para busca e vendas."],
  [BarChart3, "Analytics e leads", "Acompanhe visitas, cliques e contatos em um só painel."]
];

const steps = [
  ["01", "Conte sobre seu negócio", "Responda perguntas rápidas sobre sua empresa e objetivo."],
  ["02", "Escolha a direção visual", "A plataforma monta a primeira versão da sua marca."],
  ["03", "Personalize visualmente", "Edite textos, cores e imagens sem programação."],
  ["04", "Publique e acompanhe", "Coloque no ar e acompanhe visitas e oportunidades."]
];

const templates = [
  { title: "Atelier de Arquitetura", subtitle: "Portfólio elegante", category: "Arquitetura", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=88" },
  { title: "Café & Bistro", subtitle: "Cardápio e reservas", category: "Gastronomia", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=88" },
  { title: "Clínica Estética", subtitle: "Confiança e atendimento", category: "Beleza", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1400&q=88" },
  { title: "Loja Essencial", subtitle: "Vitrine e e-commerce", category: "Moda", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=88" },
  { title: "Imobiliária Prime", subtitle: "Imóveis e captação", category: "Imóveis", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=88" },
  { title: "Studio Fitness", subtitle: "Planos e matrículas", category: "Bem-estar", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=88" }
];

export default function Home() {
  useEffect(() => {
    const revealSelectors = [
      ".section-heading",
      ".template-card-new",
      ".feature-grid-new article",
      ".process-intro",
      ".steps-new article",
      ".process-preview",
      ".plans-new article",
      ".final-copy",
      ".final-art",
      ".footer-top > div"
    ];

    const elements = document.querySelectorAll<HTMLElement>(revealSelectors.join(","));
    elements.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    elements.forEach(element => observer.observe(element));

    const stage = document.querySelector<HTMLElement>(".hero-stage");
    const onPointerMove = (event: PointerEvent) => {
      if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      stage.style.setProperty("--mouse-x", x.toFixed(3));
      stage.style.setProperty("--mouse-y", y.toFixed(3));
    };
    const resetPointer = () => {
      stage?.style.setProperty("--mouse-x", "0");
      stage?.style.setProperty("--mouse-y", "0");
    };

    stage?.addEventListener("pointermove", onPointerMove);
    stage?.addEventListener("pointerleave", resetPointer);

    return () => {
      observer.disconnect();
      stage?.removeEventListener("pointermove", onPointerMove);
      stage?.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <main className="home-premium">
      <header className="nav">
        <Link href="/" className="brand">
          <span className="brand-mark">PF</span>
          <span><strong>PáginaFácil</strong><small>Studio</small></span>
        </Link>

        <nav>
          <a href="#modelos">Modelos</a>
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

      <section className="hero" aria-label="Apresentação do PáginaFácil">
        <div className="hero-copy">
          <div className="hero-kicker">Criação digital para pequenos negócios</div>
          <h1>Seu negócio pronto para<br/><span>ser visto e escolhido.</span></h1>
          <p>
            Crie um site profissional, uma identidade visual marcante e materiais para divulgar
            sua empresa — tudo em um único lugar, sem precisar entender de design.
          </p>

          <div className="hero-actions">
            <Link href="/cadastro" className="button large hero-primary">
              Começar a criar <ArrowRight size={18}/>
            </Link>
            <a href="#modelos" className="hero-text-link">Explorar modelos <ArrowRight size={16}/></a>
          </div>
        </div>

        <div className="hero-stage" aria-label="Exemplo de site e identidade visual criados na plataforma">
          <div className="stage-glow stage-glow-one"/>
          <div className="stage-glow stage-glow-two"/>

          <div className="browser-card">
            <div className="browser-top">
              <div className="browser-dots"><i/><i/><i/></div>
              <span>luminaarquitetura.com.br</span>
              <div className="browser-actions"><i/><i/></div>
            </div>
            <div className="site-preview">
              <div className="site-shade"/>
              <div className="site-nav">
                <strong>LUMINA</strong>
                <div><span>Projetos</span><span>Studio</span><span>Contato</span></div>
                <button>Solicitar projeto</button>
              </div>
              <div className="site-copy">
                <small>ARQUITETURA CONTEMPORÂNEA</small>
                <h2>Espaços com propósito.<br/>Design com identidade.</h2>
                <p>Projetos residenciais que combinam estética, conforto e personalidade.</p>
                <a>Conhecer projetos <ArrowRight size={14}/></a>
              </div>
            </div>
          </div>

          <div className="floating-card brand-card">
            <span>IDENTIDADE VISUAL</span>
            <div className="mini-logo">L</div>
            <strong>LUMINA</strong>
            <small>Arquitetura & Interiores</small>
            <div className="color-row"><i/><i/><i/><i/></div>
          </div>

          <div className="floating-card social-card">
            <div className="social-image"/>
            <div className="social-copy">
              <span>POST PARA REDES SOCIAIS</span>
              <strong>Design que transforma a forma de viver.</strong>
            </div>
          </div>

          <div className="phone-card">
            <div className="phone-notch"/>
            <div className="phone-screen">
              <div className="phone-nav"><strong>L</strong><i/></div>
              <div className="phone-copy"><small>NOVO PROJETO</small><strong>Casa Aurora</strong></div>
            </div>
          </div>

          <div className="stage-label label-sites"><Check size={14}/> Site publicado</div>
          <div className="stage-label label-brand"><Sparkles size={14}/> Identidade completa</div>
        </div>
      </section>

      <section id="modelos" className="section templates-new">
        <div className="section-heading split-heading">
          <div>
            <span className="section-label">Modelos profissionais</span>
            <h2>Escolha uma base bonita.<br/>Depois deixe com a sua cara.</h2>
          </div>
          <div className="heading-side">
            <p>Modelos completos, responsivos e pensados para transmitir confiança desde a primeira visita.</p>
            <Link href="/cadastro" className="text-arrow">Ver todos os modelos <ArrowRight size={16}/></Link>
          </div>
        </div>

        <div className="templates-grid-new">
          {templates.map((t, index) => (
            <article className={`template-card-new ${index === 0 ? "template-featured" : ""}`} key={t.title}>
              <div className="template-media-new" style={{backgroundImage:`url(${t.img})`}}>
                <span className="template-category">{t.category}</span>
                <div className="template-hover">
                  <Link href="/cadastro">Usar este modelo <ArrowRight size={16}/></Link>
                </div>
              </div>
              <div className="template-info">
                <div><strong>{t.title}</strong><p>{t.subtitle}</p></div>
                <span className="template-index">0{index + 1}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="recursos" className="section resources-new">
        <div className="section-heading centered-heading">
          <span className="section-label">Tudo no mesmo lugar</span>
          <h2>Uma plataforma para criar,<br/>publicar e divulgar.</h2>
          <p>Sem pular entre várias ferramentas. Sua identidade permanece consistente em cada material.</p>
        </div>

        <div className="feature-grid-new">
          {features.map(([Icon,title,text]:any, index:number)=>(
            <article key={title} className={index === 0 ? "feature-main" : ""}>
              <div className="feature-top"><span>0{index + 1}</span><Icon size={22}/></div>
              <div><h3>{title}</h3><p>{text}</p></div>
              <Link href="/cadastro" aria-label={`Conhecer ${title}`}><ArrowRight size={18}/></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="como" className="process-new">
        <div className="process-inner">
          <div className="process-intro">
            <span className="section-label light-label">Como funciona</span>
            <h2>Você conta a ideia.<br/>A plataforma organiza o resto.</h2>
            <p>Um processo simples, visual e guiado. Sem código, sem termos técnicos e sem tela confusa.</p>
            <Link href="/cadastro" className="button large process-button">Criar meu projeto <ArrowRight size={18}/></Link>
          </div>

          <div className="steps-new">
            {steps.map(([n,t,d])=>(
              <article key={n}>
                <span>{n}</span>
                <div><strong>{t}</strong><p>{d}</p></div>
                <ArrowRight size={18}/>
              </article>
            ))}
          </div>
        </div>

        <div className="process-preview">
          <div className="preview-toolbar"><i/><i/><i/><span>paginafacil.app/editor</span></div>
          <div className="preview-layout">
            <aside><b>PF</b><span/><span/><span/><span/></aside>
            <div className="preview-canvas">
              <div className="canvas-nav"><strong>ATELIER</strong><span>Projetos</span><span>Sobre</span><button>Contato</button></div>
              <div className="canvas-content"><small>ARQUITETURA AUTORAL</small><h3>Espaços que traduzem quem você é.</h3><p>Projeto, estética e funcionalidade em equilíbrio.</p><button>Conhecer projetos</button></div>
            </div>
            <div className="preview-panel"><span>Personalizar</span><label>Texto</label><div/><label>Cores</label><div className="panel-colors"><i/><i/><i/></div><label>Imagem</label><button>Trocar imagem</button></div>
          </div>
        </div>
      </section>

      <section id="planos" className="section pricing-new">
        <div className="section-heading split-heading pricing-heading">
          <div><span className="section-label">Planos simples</span><h2>Comece pequeno.<br/>Cresça sem trocar de plataforma.</h2></div>
          <p>Teste gratuitamente e assine quando precisar publicar, usar domínio próprio e criar mais materiais.</p>
        </div>

        <div className="plans-new">
          <article>
            <div className="plan-name"><span>Essencial</span><small>Para testar</small></div>
            <h3>R$ 0</h3><p>Conheça a plataforma e crie seu primeiro projeto.</p>
            <ul><li><Check size={16}/>1 site</li><li><Check size={16}/>5 créditos</li><li><Check size={16}/>Modelos essenciais</li></ul>
            <Link href="/cadastro" className="plan-button light-plan">Começar grátis</Link>
          </article>

          <article className="plan-featured-new">
            <div className="popular-tag">Mais escolhido</div>
            <div className="plan-name"><span>Profissional</span><small>Para seu negócio</small></div>
            <h3>R$ 59<sup>/mês</sup></h3><p>Site, identidade e materiais para divulgar todos os meses.</p>
            <ul><li><Check size={16}/>Até 10 sites</li><li><Check size={16}/>Logo Studio</li><li><Check size={16}/>Banner Studio</li><li><Check size={16}/>Domínio próprio</li><li><Check size={16}/>SEO e analytics</li></ul>
            <CheckoutButton plan="profissional" className="plan-button dark-plan">Escolher Profissional</CheckoutButton>
          </article>

          <article>
            <div className="plan-name"><span>Agência</span><small>Para vários clientes</small></div>
            <h3>R$ 149<sup>/mês</sup></h3><p>Mais capacidade, organização e recursos para atender clientes.</p>
            <ul><li><Check size={16}/>Sites ilimitados</li><li><Check size={16}/>White label</li><li><Check size={16}/>Área de clientes</li><li><Check size={16}/>Créditos ampliados</li><li><Check size={16}/>Suporte prioritário</li></ul>
            <CheckoutButton plan="agencia" className="plan-button light-plan">Escolher Agência</CheckoutButton>
          </article>
        </div>
      </section>

      <section className="final-cta-new">
        <div className="final-copy">
          <span className="section-label light-label">Sua marca pode começar hoje</span>
          <h2>Deixe de improvisar.<br/>Comece a parecer profissional.</h2>
          <p>Crie seu site, sua identidade e seus materiais em uma única plataforma.</p>
          <Link href="/cadastro" className="button large final-button">Começar gratuitamente <ArrowRight size={18}/></Link>
        </div>
        <div className="final-art"><div className="art-card art-one">SITE</div><div className="art-card art-two">LOGO</div><div className="art-card art-three">POST</div></div>
      </section>

      <footer className="footer-new">
        <div className="footer-top">
          <div className="footer-brand"><Link href="/" className="brand"><span className="brand-mark">PF</span><span><strong>PáginaFácil</strong><small>Studio</small></span></Link><p>Sites, identidade visual e materiais para pequenos negócios crescerem com presença profissional.</p></div>
          <div><strong>Plataforma</strong><a href="#modelos">Modelos</a><a href="#recursos">Recursos</a><a href="#planos">Planos</a></div>
          <div><strong>Conta</strong><Link href="/login">Entrar</Link><Link href="/cadastro">Criar conta</Link></div>
          <div><strong>Legal</strong><Link href="/privacidade">Privacidade</Link><Link href="/termos">Termos</Link></div>
        </div>
        <div className="footer-bottom-new"><span>© 2026 PáginaFácil Studio</span><span>Feito para negócios que querem ser levados a sério.</span></div>
      </footer>

      <style jsx global>{`
        :root{
          --bg:#0b0d12;
          --panel:#111521;
          --text:#f6f7fb;
          --muted:#97a1b8;
          --dark:#11131a;
          --accent:#7a5cff;
          --accent-2:#55d7e8;
          --card:#0c1220;
          --glass: rgba(255,255,255,0.04);
        }
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}button{font:inherit}
        .home-premium{overflow:hidden;background:#0b0d12;min-height:100vh}

        /* NAV */
        .nav{width:100%;min-height:78px;padding:0 max(24px,calc((100% - 1240px)/2));margin:0;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:40;background:#f6f5f1;color:#15171d;border-bottom:1px solid #e7e5df}
        .brand{display:inline-flex;align-items:center;gap:12px}.brand-mark{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#11131a;color:#fff;font-weight:900;box-shadow:none}.brand>span:last-child{display:flex;flex-direction:column}.brand strong{font-size:15px}.brand small{margin-top:2px;color:#777b85;font-size:10px;letter-spacing:.075em;text-transform:uppercase}
        .nav>nav{display:flex;gap:26px;color:#555862;font-size:13px;font-weight:700}.nav>nav a:hover{color:#11131a}
        .nav-actions{display:flex;align-items:center;gap:14px}.login{font-size:13px;font-weight:700;color:#444750}
        .button{min-height:48px;padding:0 20px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;gap:10px;font-size:13px;font-weight:800;border:0;cursor:pointer}
        .button.small{min-height:40px;padding:0 14px;border-radius:10px;font-size:13px}
        .button.large{min-height:56px;padding:0 22px}
        .button.primary{background:linear-gradient(90deg,var(--accent),#9a74ff);color:white;box-shadow:0 20px 50px rgba(124,88,255,.18)}
        .button.secondary{background:transparent;border:1px solid rgba(255,255,255,.06);color:var(--text)}

        /* HERO */
        .hero{position:relative;background:#f6f5f1;color:#11131a;text-align:center;padding:88px 24px 0;overflow:hidden;border-bottom:1px solid #e9e7e0}
        .hero-copy{position:relative;z-index:5;max-width:980px;margin:0 auto}
        .hero-kicker{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 13px;border:1px solid #d8d5cc;border-radius:999px;background:rgba(255,255,255,.68);font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#60636c}
        .hero-copy h1{font-size:clamp(46px,6.6vw,88px);line-height:.96;margin:26px 0 22px;font-weight:520;letter-spacing:-.065em;color:#0b0d12}
        .hero-copy h1 span{color:#6657e8}
        .hero-copy p{max-width:720px;margin:0 auto;color:#5f626c;font-size:17px;line-height:1.65}
        .hero-actions{margin-top:30px;display:flex;justify-content:center;align-items:center;gap:22px;flex-wrap:wrap}
        .button.hero-primary{background:#101114;color:#fff;border-radius:999px;padding:0 24px;box-shadow:0 12px 30px rgba(16,17,20,.16);transition:transform .2s,box-shadow .2s}
        .button.hero-primary:hover{transform:translateY(-2px);box-shadow:0 18px 38px rgba(16,17,20,.2)}
        .hero-text-link{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:800;color:#24262d}
        .hero-text-link:hover{color:#6657e8}

        .hero-stage{position:relative;width:min(1180px,100%);height:600px;margin:68px auto 0;perspective:1400px}
        .stage-glow{position:absolute;border-radius:50%;filter:blur(70px);opacity:.48;pointer-events:none}
        .stage-glow-one{width:430px;height:260px;background:#b7a9ff;left:25%;top:10%}
        .stage-glow-two{width:340px;height:260px;background:#8fded7;right:10%;bottom:8%}
        .browser-card{position:absolute;left:50%;top:0;transform:translateX(-50%) rotateX(1deg);width:min(820px,74%);height:500px;background:#fff;border:1px solid rgba(19,23,34,.12);border-radius:18px;overflow:hidden;box-shadow:0 40px 100px rgba(40,38,56,.2);z-index:3}
        .browser-top{height:44px;padding:0 16px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;background:#fff;border-bottom:1px solid #ececf0;color:#888b94;font-size:10px}
        .browser-dots{display:flex;gap:6px}.browser-dots i{width:7px;height:7px;border-radius:50%;background:#d3d4d9}.browser-actions{justify-self:end;display:flex;gap:8px}.browser-actions i{width:14px;height:14px;border:1px solid #dadce2;border-radius:4px}
        .site-preview{position:relative;height:calc(100% - 44px);background:url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=88") center/cover no-repeat;color:#fff;text-align:left}
        .site-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,18,17,.72),rgba(12,18,17,.18) 62%,rgba(12,18,17,.08))}
        .site-nav{position:relative;z-index:2;height:68px;padding:0 26px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.17)}
        .site-nav strong{font-size:13px;letter-spacing:.18em}.site-nav div{display:flex;gap:20px;font-size:9px}.site-nav button{background:#fff;color:#111;border:0;border-radius:999px;padding:9px 14px;font-size:8px;font-weight:800}
        .site-copy{position:absolute;z-index:2;left:36px;bottom:42px;max-width:500px}.site-copy small{font-size:8px;letter-spacing:.2em}.site-copy h2{font-size:clamp(28px,3.3vw,48px);line-height:1.02;letter-spacing:-.04em;margin:12px 0}.site-copy p{font-size:11px;line-height:1.6;max-width:330px;color:rgba(255,255,255,.78)}.site-copy a{margin-top:16px;display:inline-flex;align-items:center;gap:7px;font-size:9px;font-weight:800;border-bottom:1px solid rgba(255,255,255,.55);padding-bottom:5px}
        .floating-card{position:absolute;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);border:1px solid rgba(30,32,42,.1);box-shadow:0 24px 70px rgba(35,34,52,.16);z-index:5;text-align:left}
        .brand-card{left:0;top:118px;width:210px;padding:22px;border-radius:18px;transform:rotate(-4deg)}
        .brand-card>span,.social-copy span{font-size:7px;font-weight:900;letter-spacing:.15em;color:#8a8d96}.mini-logo{width:48px;height:48px;margin:20px 0 12px;border-radius:14px;display:grid;place-items:center;background:#1c2c27;color:#e8ddc8;font-family:Georgia,serif;font-size:25px}.brand-card strong{display:block;font-size:18px;letter-spacing:.12em}.brand-card small{display:block;color:#777b84;font-size:8px;margin-top:5px}.color-row{display:flex;gap:7px;margin-top:18px}.color-row i{width:27px;height:18px;border-radius:5px}.color-row i:nth-child(1){background:#1c2c27}.color-row i:nth-child(2){background:#c6a977}.color-row i:nth-child(3){background:#e7dfd2}.color-row i:nth-child(4){background:#858277}
        .social-card{right:-8px;top:74px;width:220px;border-radius:18px;overflow:hidden;transform:rotate(4deg)}.social-image{height:140px;background:url("https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=86") center/cover}.social-copy{padding:16px}.social-copy strong{display:block;font-family:Georgia,serif;font-size:16px;line-height:1.18;margin-top:8px;color:#25282e}
        .phone-card{position:absolute;right:66px;bottom:2px;width:176px;height:350px;padding:7px;border-radius:28px;background:#121317;border:1px solid rgba(255,255,255,.6);box-shadow:0 28px 70px rgba(31,30,45,.26);z-index:6;transform:rotate(2deg)}
        .phone-notch{position:absolute;top:13px;left:50%;transform:translateX(-50%);width:54px;height:14px;border-radius:999px;background:#111;z-index:2}.phone-screen{height:100%;border-radius:21px;overflow:hidden;background:url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=85") center/cover;color:#fff;position:relative}.phone-screen:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.62))}.phone-nav{position:relative;z-index:1;padding:23px 15px;display:flex;justify-content:space-between}.phone-nav strong{font-family:Georgia,serif}.phone-nav i{width:16px;height:1px;background:#fff;box-shadow:0 5px 0 #fff}.phone-copy{position:absolute;z-index:2;left:16px;bottom:22px;text-align:left}.phone-copy small{font-size:6px;letter-spacing:.18em}.phone-copy strong{display:block;font-family:Georgia,serif;font-size:22px;margin-top:6px}
        .stage-label{position:absolute;z-index:7;display:flex;align-items:center;gap:7px;padding:10px 13px;border-radius:999px;background:#fff;border:1px solid rgba(22,24,32,.08);box-shadow:0 14px 34px rgba(39,37,56,.12);font-size:10px;font-weight:800;color:#2c2e35}.stage-label svg{color:#6657e8}.label-sites{left:19%;bottom:44px}.label-brand{right:18%;top:28px}

        /* LOWER SECTIONS */
        .section{padding:120px 24px}.section-heading{width:min(1180px,100%);margin:0 auto 54px}.split-heading{display:grid;grid-template-columns:1.25fr .75fr;gap:80px;align-items:end}.centered-heading{text-align:center;max-width:820px}.section-label{display:inline-block;margin-bottom:18px;color:#6a5ce8;font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.section-heading h2{margin:0;font-size:clamp(38px,5vw,64px);line-height:.98;letter-spacing:-.055em;color:#11131a;font-weight:600}.section-heading p{margin:0;color:#6a6d76;font-size:16px;line-height:1.7}.heading-side{display:grid;gap:22px}.text-arrow{display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:900;color:#11131a}

        .templates-new{background:#f6f5f1;color:#11131a}.templates-grid-new{width:min(1180px,100%);margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:28px}.template-card-new{min-width:0}.template-media-new{position:relative;height:360px;border-radius:22px;background-size:cover;background-position:center;overflow:hidden;box-shadow:0 18px 45px rgba(24,26,36,.08)}.template-featured{grid-column:span 2}.template-featured .template-media-new{height:500px}.template-category{position:absolute;top:18px;left:18px;padding:9px 12px;border-radius:999px;background:rgba(255,255,255,.9);backdrop-filter:blur(12px);font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.template-hover{position:absolute;inset:auto 18px 18px;transform:translateY(18px);opacity:0;transition:.25s}.template-hover a{display:flex;align-items:center;justify-content:center;gap:9px;min-height:48px;border-radius:999px;background:#11131a;color:#fff;font-size:12px;font-weight:900}.template-media-new:hover .template-hover{transform:none;opacity:1}.template-info{padding:18px 4px 0;display:flex;justify-content:space-between;gap:20px}.template-info strong{font-size:18px}.template-info p{margin:6px 0 0;color:#777a83;font-size:13px}.template-index{color:#adafb6;font-size:11px;font-weight:800}

        .resources-new{background:#fff;color:#11131a}.centered-heading p{max-width:670px;margin:20px auto 0}.feature-grid-new{width:min(1180px,100%);margin:auto;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #e7e7ea;border-left:1px solid #e7e7ea}.feature-grid-new article{min-height:290px;padding:30px;border-right:1px solid #e7e7ea;border-bottom:1px solid #e7e7ea;display:flex;flex-direction:column;justify-content:space-between;transition:background .2s}.feature-grid-new article:hover{background:#f7f6ff}.feature-top{display:flex;align-items:center;justify-content:space-between;color:#6a5ce8}.feature-top span{font-size:10px;font-weight:900;letter-spacing:.1em}.feature-grid-new h3{font-size:24px;margin:0 0 12px;letter-spacing:-.03em}.feature-grid-new p{margin:0;color:#6a6d76;font-size:14px;line-height:1.65}.feature-grid-new article>a{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;border:1px solid #dcdde2;margin-top:26px}.feature-main{background:#11131a!important;color:#fff}.feature-main p{color:#b7bac3}.feature-main .feature-top{color:#9c90ff}.feature-main>a{border-color:#3b3e48}

        .process-new{background:#101217;color:#fff;padding:120px 24px 0}.process-inner{width:min(1180px,100%);margin:auto;display:grid;grid-template-columns:.85fr 1.15fr;gap:100px;align-items:start}.light-label{color:#9f94ff}.process-intro h2{font-size:clamp(40px,5vw,66px);line-height:.98;letter-spacing:-.055em;margin:0}.process-intro p{color:#a8acb8;font-size:16px;line-height:1.7;max-width:500px;margin:24px 0 30px}.process-button{background:#fff;color:#11131a;border-radius:999px}.steps-new{border-top:1px solid #292c34}.steps-new article{display:grid;grid-template-columns:58px 1fr auto;gap:20px;align-items:center;padding:26px 0;border-bottom:1px solid #292c34}.steps-new article>span{color:#8d80ff;font-size:12px;font-weight:900}.steps-new strong{display:block;font-size:17px}.steps-new p{margin:7px 0 0;color:#9498a5;font-size:13px}.steps-new svg{color:#5b5f6a}.process-preview{width:min(1180px,100%);height:620px;margin:90px auto 0;border-radius:26px 26px 0 0;background:#e8e9ed;box-shadow:0 -20px 90px rgba(0,0,0,.25);overflow:hidden;border:1px solid #343741;border-bottom:0}.preview-toolbar{height:48px;background:#1a1c22;color:#737784;display:flex;align-items:center;gap:7px;padding:0 16px;font-size:10px}.preview-toolbar i{width:8px;height:8px;border-radius:50%;background:#41444c}.preview-toolbar span{margin-left:12px}.preview-layout{height:calc(100% - 48px);display:grid;grid-template-columns:64px 1fr 220px}.preview-layout aside{background:#15171c;display:flex;flex-direction:column;align-items:center;gap:18px;padding-top:20px}.preview-layout aside b{width:34px;height:34px;border-radius:9px;background:#6a5ce8;display:grid;place-items:center;font-size:11px}.preview-layout aside span{width:22px;height:22px;border-radius:7px;background:#292c33}.preview-canvas{position:relative;background:url("https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=88") center/cover;color:#fff}.preview-canvas:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(13,17,16,.72),rgba(13,17,16,.15))}.canvas-nav,.canvas-content{position:relative;z-index:2}.canvas-nav{height:72px;padding:0 30px;display:flex;align-items:center;gap:24px;border-bottom:1px solid rgba(255,255,255,.18)}.canvas-nav strong{margin-right:auto;letter-spacing:.16em}.canvas-nav span{font-size:10px}.canvas-nav button,.canvas-content button{border:0;border-radius:999px;background:#fff;color:#111;padding:10px 15px;font-size:9px;font-weight:900}.canvas-content{padding:90px 42px;max-width:590px}.canvas-content small{letter-spacing:.16em;font-size:9px}.canvas-content h3{font-size:48px;line-height:1.02;letter-spacing:-.04em;margin:16px 0}.canvas-content p{color:rgba(255,255,255,.75);font-size:13px}.preview-panel{background:#fff;color:#202229;padding:24px;display:flex;flex-direction:column;gap:12px}.preview-panel>span{font-weight:900;margin-bottom:10px}.preview-panel label{font-size:10px;font-weight:900;color:#777a83;text-transform:uppercase}.preview-panel>div{height:38px;border-radius:9px;background:#f1f2f5}.preview-panel .panel-colors{background:transparent;display:flex;gap:8px}.panel-colors i{width:32px;height:32px;border-radius:50%;background:#1d2d28}.panel-colors i:nth-child(2){background:#c1a57a}.panel-colors i:nth-child(3){background:#ded8cd}.preview-panel button{height:38px;border:1px solid #dedfe4;background:#fff;border-radius:9px;font-size:11px;font-weight:800}

        .pricing-new{background:#f6f5f1;color:#11131a}.pricing-heading>p{max-width:440px}.plans-new{width:min(1180px,100%);margin:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:stretch}.plans-new article{position:relative;padding:34px;border:1px solid #deddd8;border-radius:24px;background:#fff;display:flex;flex-direction:column;min-height:560px}.plan-featured-new{background:#11131a!important;color:#fff;border-color:#11131a!important;transform:translateY(-14px);box-shadow:0 30px 70px rgba(20,21,28,.2)}.popular-tag{position:absolute;top:18px;right:18px;background:#7568ee;color:#fff;padding:8px 11px;border-radius:999px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.plan-name{display:flex;justify-content:space-between;align-items:end;margin-bottom:34px}.plan-name span{font-size:19px;font-weight:900}.plan-name small{color:#888b94}.plans-new h3{font-size:48px;letter-spacing:-.05em;margin:0}.plans-new h3 sup{font-size:15px;letter-spacing:0}.plans-new>article>p{color:#777a83;line-height:1.6;min-height:52px}.plan-featured-new>p{color:#adb0bb!important}.plans-new ul{list-style:none;padding:26px 0;margin:20px 0;border-top:1px solid #ececef;display:grid;gap:14px}.plan-featured-new ul{border-color:#2d3038}.plans-new li{display:flex;align-items:center;gap:10px;font-size:13px;color:#565963}.plan-featured-new li{color:#d3d5dc}.plans-new li svg{color:#6a5ce8}.plan-button{margin-top:auto;min-height:50px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;border:0}.light-plan{background:#f0f0f2;color:#11131a}.dark-plan{background:#fff;color:#11131a;width:100%}

        .final-cta-new{min-height:560px;background:#6557e8;color:#fff;padding:90px max(24px,calc((100% - 1180px)/2));display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:50px;overflow:hidden}.final-copy h2{font-size:clamp(46px,6vw,76px);line-height:.96;letter-spacing:-.06em;margin:0}.final-copy p{font-size:17px;color:#dedbff;margin:24px 0 30px}.final-button{background:#fff;color:#11131a;border-radius:999px}.final-art{position:relative;height:380px}.art-card{position:absolute;width:260px;height:170px;border-radius:22px;background:#fff;color:#11131a;display:grid;place-items:center;font-size:30px;font-weight:900;letter-spacing:.12em;box-shadow:0 30px 70px rgba(39,30,120,.28)}.art-one{left:50px;top:80px;transform:rotate(-8deg)}.art-two{right:20px;top:20px;transform:rotate(8deg);background:#14161d;color:#fff}.art-three{right:80px;bottom:0;transform:rotate(-3deg);background:#c9ff64}

        .footer-new{background:#0f1116;color:#fff;padding:76px max(24px,calc((100% - 1180px)/2)) 28px}.footer-top{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:60px}.footer-brand p{max-width:390px;color:#9296a2;font-size:14px;line-height:1.7;margin-top:22px}.footer-top>div:not(.footer-brand){display:flex;flex-direction:column;gap:13px}.footer-top>div>strong{margin-bottom:8px;font-size:12px}.footer-top a{color:#969aa6;font-size:13px}.footer-top a:hover{color:#fff}.footer-new .brand-mark{background:#fff;color:#11131a}.footer-bottom-new{margin-top:60px;padding-top:22px;border-top:1px solid #262830;display:flex;justify-content:space-between;color:#737782;font-size:11px}

        /* MOTION SYSTEM */
        .hero-copy{animation:heroEnter .9s cubic-bezier(.2,.8,.2,1) both}
        .hero-kicker{animation:heroEnter .75s .05s cubic-bezier(.2,.8,.2,1) both}
        .hero-copy h1{animation:heroEnter .9s .14s cubic-bezier(.2,.8,.2,1) both}
        .hero-copy p{animation:heroEnter .9s .24s cubic-bezier(.2,.8,.2,1) both}
        .hero-actions{animation:heroEnter .9s .34s cubic-bezier(.2,.8,.2,1) both}
        .hero-stage{--mouse-x:0;--mouse-y:0;animation:stageEnter 1.1s .28s cubic-bezier(.16,1,.3,1) both}
        .browser-card{transform:translateX(calc(-50% + (var(--mouse-x) * 7px))) translateY(calc(var(--mouse-y) * 5px)) rotateX(calc(1deg + (var(--mouse-y) * -1deg))) rotateY(calc(var(--mouse-x) * 1.2deg));transition:transform .28s ease-out;animation:browserFloat 7s 1.4s ease-in-out infinite}
        .brand-card{transform:translate(calc(var(--mouse-x) * -10px),calc(var(--mouse-y) * -7px)) rotate(-4deg);transition:transform .28s ease-out;animation:cardFloatLeft 6s 1.1s ease-in-out infinite}
        .social-card{transform:translate(calc(var(--mouse-x) * 11px),calc(var(--mouse-y) * 8px)) rotate(4deg);transition:transform .28s ease-out;animation:cardFloatRight 6.6s 1.35s ease-in-out infinite}
        .phone-card{transform:translate(calc(var(--mouse-x) * 8px),calc(var(--mouse-y) * 10px)) rotate(2deg);transition:transform .28s ease-out;animation:phoneFloat 6.2s 1.55s ease-in-out infinite}
        .stage-label{animation:labelPulse 4.5s ease-in-out infinite}
        .label-brand{animation-delay:.8s}
        .stage-glow-one{animation:glowDriftOne 8s ease-in-out infinite}
        .stage-glow-two{animation:glowDriftTwo 9s ease-in-out infinite}
        .site-preview:after{content:"";position:absolute;inset:-30%;z-index:1;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.12) 50%,transparent 60%);transform:translateX(-70%) rotate(8deg);animation:siteShine 7s 2s ease-in-out infinite;pointer-events:none}
        .template-card-new,.feature-grid-new article,.plans-new article{transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease,border-color .35s ease}
        .template-card-new:hover{transform:translateY(-9px)}
        .template-card-new:hover .template-media-new{box-shadow:0 30px 70px rgba(24,26,36,.16)}
        .template-media-new{transition:transform .55s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease}
        .template-card-new:hover .template-media-new{transform:scale(1.012)}
        .feature-grid-new article:hover{transform:translateY(-7px);box-shadow:0 20px 55px rgba(27,29,42,.08);position:relative;z-index:2}
        .feature-grid-new article>a svg,.text-arrow svg,.hero-text-link svg,.button svg{transition:transform .25s ease}
        .feature-grid-new article>a:hover svg,.text-arrow:hover svg,.hero-text-link:hover svg,.button:hover svg{transform:translateX(4px)}
        .steps-new article{transition:padding-left .28s ease,background .28s ease}
        .steps-new article:hover{padding-left:12px;background:rgba(255,255,255,.025)}
        .plans-new article:hover{transform:translateY(-8px);box-shadow:0 28px 70px rgba(20,21,28,.13)}
        .plan-featured-new:hover{transform:translateY(-21px)}
        .final-art{animation:artFloat 7s ease-in-out infinite}
        .art-one{animation:artOne 6s ease-in-out infinite}
        .art-two{animation:artTwo 7s .4s ease-in-out infinite}
        .art-three{animation:artThree 6.5s .8s ease-in-out infinite}
        .reveal{opacity:0;transform:translateY(34px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1);transition-delay:var(--reveal-delay,0ms)}
        .reveal.is-visible{opacity:1;transform:none}

        @keyframes heroEnter{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
        @keyframes stageEnter{from{opacity:0;transform:translateY(60px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes browserFloat{0%,100%{margin-top:0}50%{margin-top:-10px}}
        @keyframes cardFloatLeft{0%,100%{margin-top:0}50%{margin-top:-14px}}
        @keyframes cardFloatRight{0%,100%{margin-top:0}50%{margin-top:12px}}
        @keyframes phoneFloat{0%,100%{margin-bottom:0}50%{margin-bottom:12px}}
        @keyframes labelPulse{0%,100%{transform:translateY(0);box-shadow:0 14px 34px rgba(39,37,56,.12)}50%{transform:translateY(-5px);box-shadow:0 20px 44px rgba(39,37,56,.18)}}
        @keyframes glowDriftOne{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,18px) scale(1.12)}}
        @keyframes glowDriftTwo{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-26px,-20px) scale(1.08)}}
        @keyframes siteShine{0%,60%{transform:translateX(-75%) rotate(8deg)}82%,100%{transform:translateX(75%) rotate(8deg)}}
        @keyframes artFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes artOne{0%,100%{transform:rotate(-8deg) translateY(0)}50%{transform:rotate(-5deg) translateY(-12px)}}
        @keyframes artTwo{0%,100%{transform:rotate(8deg) translateY(0)}50%{transform:rotate(5deg) translateY(11px)}}
        @keyframes artThree{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(0deg) translateY(-10px)}}

        @media(max-width:1120px){
          .hero-stage{height:540px}.brand-card{left:2%;transform:rotate(-3deg) scale(.9)}.social-card{right:1%;transform:rotate(3deg) scale(.9)}.phone-card{right:4%;transform:scale(.9)}
          .split-heading{grid-template-columns:1fr;gap:28px}.templates-grid-new{grid-template-columns:repeat(2,1fr)}.template-featured{grid-column:span 2}.process-inner{grid-template-columns:1fr;gap:60px}.plans-new{grid-template-columns:1fr}.plan-featured-new{transform:none}.final-cta-new{grid-template-columns:1fr}.final-art{height:300px}.footer-top{grid-template-columns:1.5fr 1fr 1fr}
        }
        @media(max-width:780px){
          .nav{padding:0 16px}.nav>nav,.login{display:none}.hero{padding:54px 16px 0}.hero-copy h1{font-size:46px;line-height:1}.hero-copy p{font-size:15px}.hero-stage{height:470px;margin-top:48px}.browser-card{width:94%;height:390px}.site-nav div,.site-nav button{display:none}.site-copy{left:22px;bottom:28px}.site-copy h2{font-size:30px}.brand-card{left:-52px;top:94px;transform:rotate(-5deg) scale(.7)}.social-card{right:-66px;top:48px;transform:rotate(5deg) scale(.7)}.phone-card{right:2px;bottom:-25px;transform:scale(.7);transform-origin:bottom right}.stage-label{display:none}
          .section{padding:82px 18px}.section-heading h2{font-size:40px}.templates-grid-new{grid-template-columns:1fr}.template-featured{grid-column:auto}.template-featured .template-media-new,.template-media-new{height:360px}.feature-grid-new{grid-template-columns:1fr}.process-new{padding:82px 18px 0}.process-intro h2{font-size:42px}.process-preview{height:480px;margin-top:60px}.preview-layout{grid-template-columns:48px 1fr}.preview-panel{display:none}.canvas-content{padding:70px 24px}.canvas-content h3{font-size:36px}.canvas-nav span{display:none}.pricing-heading{display:block}.pricing-heading>p{margin-top:24px}.plans-new article{min-height:auto}.final-cta-new{padding:80px 18px}.final-copy h2{font-size:46px}.final-art{height:250px}.art-card{width:190px;height:125px;font-size:21px}.footer-top{grid-template-columns:1fr 1fr}.footer-brand{grid-column:1/-1}.footer-bottom-new{flex-direction:column;gap:8px}
        }
        @media(max-width:480px){
          .hero-copy h1{font-size:39px}.hero-actions{gap:14px;flex-direction:column}.hero-text-link{font-size:12px}.hero-stage{height:410px}.browser-card{height:340px}.site-copy h2{font-size:25px}.site-copy p{display:none}.section-heading h2{font-size:34px}.template-media-new,.template-featured .template-media-new{height:300px}.process-preview{height:420px}.canvas-content h3{font-size:30px}.final-copy h2{font-size:39px}.art-one{left:0}.art-two{right:-30px}.art-three{right:20px}
        }
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
          .reveal{opacity:1!important;transform:none!important}
        }
      `}</style>
    </main>
  );
}