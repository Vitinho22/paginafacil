import type { Site, SiteSection, TemplateId } from "@/types/site";

export type TemplateDefinition = {
  id: TemplateId;
  nome: string;
  descricao: string;
  indicadoPara: string;
  cor: string;
  corFundo: string;
};

export const templates: TemplateDefinition[] = [
  {
    id: "corporativo",
    nome: "Norte",
    descricao: "Institucional sóbrio, confiável e direto.",
    indicadoPara: "Empresas, clínicas e serviços",
    cor: "#2563EB",
    corFundo: "#F6F8FC",
  },
  {
    id: "restaurante",
    nome: "Sabor",
    descricao: "Apresentação visual com destaque para pedidos.",
    indicadoPara: "Restaurantes, cafés e delivery",
    cor: "#D97706",
    corFundo: "#FFF9F0",
  },
  {
    id: "vendas",
    nome: "Conversão",
    descricao: "Página comercial com foco em benefícios e ação.",
    indicadoPara: "Produtos, cursos e ofertas",
    cor: "#7C3AED",
    corFundo: "#FAF8FF",
  },
  {
    id: "portfolio",
    nome: "Ateliê",
    descricao: "Layout editorial para destacar trabalhos.",
    indicadoPara: "Designers, fotógrafos e profissionais",
    cor: "#0F766E",
    corFundo: "#F5FAF9",
  },
];

function section(titulo: string, texto: string): SiteSection {
  return { titulo, texto };
}

export function escolherTemplate(segmento: string): TemplateId {
  const value = segmento.toLowerCase();
  if (
    value.includes("restaurante") ||
    value.includes("pizz") ||
    value.includes("barbearia")
  ) {
    return "restaurante";
  }
  if (
    value.includes("curso") ||
    value.includes("landing") ||
    value.includes("loja")
  ) {
    return "vendas";
  }
  if (value.includes("portfólio") || value.includes("portfolio")) {
    return "portfolio";
  }
  return "corporativo";
}

export function criarConteudoInicial(data: {
  nome?: string;
  segmento?: string;
  cidade?: string;
  estilo?: string;
  templateId?: TemplateId;
}): Omit<
  Site,
  "id" | "userId" | "whatsapp" | "instagram" | "descricaoInicial" | "status" | "criadoEm" | "atualizadoEm"
> {
  const nome = data.nome?.trim() || "Seu negócio";
  const segmento = data.segmento?.trim() || "Empresa";
  const cidade = data.cidade?.trim() || "";
  const templateId = data.templateId || escolherTemplate(segmento);
  const template = templates.find((item) => item.id === templateId)!;

  if (templateId === "restaurante") {
    return {
      nome,
      segmento,
      cidade,
      estilo: data.estilo || "Elegante",
      templateId,
      etiqueta: "Sabor, qualidade e atendimento",
      titulo: `${nome}: uma experiência que começa pelo primeiro pedido.`,
      subtitulo: cidade
        ? `Atendimento em ${cidade}, com opções pensadas para tornar cada momento mais especial.`
        : "Conheça nosso cardápio, faça seu pedido e aproveite uma experiência preparada com cuidado.",
      ctaPrimario: "Fazer pedido",
      ctaSecundario: "Ver opções",
      cor: template.cor,
      corFundo: template.corFundo,
      servicos: [
        section("Seleção especial", "Opções preparadas com ingredientes selecionados."),
        section("Pedido rápido", "Atendimento simples e direto pelo WhatsApp."),
        section("Experiência completa", "Qualidade do primeiro contato até a entrega."),
      ],
      beneficios: [
        section("Atendimento local", cidade || "Atendimento na sua região"),
        section("Contato direto", "Converse com a equipe sem intermediários."),
        section("Informações claras", "Veja opções, horários e formas de atendimento."),
      ],
    };
  }

  if (templateId === "vendas") {
    return {
      nome,
      segmento,
      cidade,
      estilo: data.estilo || "Moderno",
      templateId,
      etiqueta: "Uma solução criada para gerar resultado",
      titulo: `Transforme interesse em ação com ${nome}.`,
      subtitulo:
        "Uma proposta clara, profissional e preparada para mostrar valor, responder dúvidas e facilitar a decisão.",
      ctaPrimario: "Quero saber mais",
      ctaSecundario: "Conhecer benefícios",
      cor: template.cor,
      corFundo: template.corFundo,
      servicos: [
        section("Proposta clara", "Apresente o valor da sua oferta sem distrações."),
        section("Benefícios objetivos", "Mostre o que muda para o cliente."),
        section("Chamada para ação", "Leve o visitante para o próximo passo."),
      ],
      beneficios: [
        section("Comunicação profissional", "Textos organizados e fáceis de entender."),
        section("Estrutura de conversão", "Seções pensadas para reduzir dúvidas."),
        section("Contato imediato", "Botões prontos para gerar conversas."),
      ],
    };
  }

  if (templateId === "portfolio") {
    return {
      nome,
      segmento,
      cidade,
      estilo: data.estilo || "Minimalista",
      templateId,
      etiqueta: "Portfólio e apresentação profissional",
      titulo: `${nome}: trabalho autoral apresentado com clareza.`,
      subtitulo:
        "Uma presença digital limpa para destacar projetos, experiência e a forma como você trabalha.",
      ctaPrimario: "Solicitar orçamento",
      ctaSecundario: "Ver projetos",
      cor: template.cor,
      corFundo: template.corFundo,
      servicos: [
        section("Projetos selecionados", "Uma curadoria dos trabalhos mais importantes."),
        section("Processo transparente", "Explique como cada projeto é conduzido."),
        section("Contato profissional", "Facilite pedidos de orçamento e parcerias."),
      ],
      beneficios: [
        section("Identidade consistente", "Visual alinhado à sua forma de trabalhar."),
        section("Boa leitura", "Hierarquia clara e conteúdo bem organizado."),
        section("Credibilidade", "Apresentação preparada para novos clientes."),
      ],
    };
  }

  return {
    nome,
    segmento,
    cidade,
    estilo: data.estilo || "Moderno",
    templateId: "corporativo",
    etiqueta: "Estrutura, confiança e atendimento",
    titulo: `${nome}: presença profissional para conquistar novas oportunidades.`,
    subtitulo: cidade
      ? `Atendimento em ${cidade}, com soluções claras, contato rápido e uma apresentação à altura do seu negócio.`
      : "Apresente seus serviços com clareza, transmita confiança e facilite o contato com novos clientes.",
    ctaPrimario: "Solicitar atendimento",
    ctaSecundario: "Conhecer serviços",
    cor: template.cor,
    corFundo: template.corFundo,
    servicos: [
      section("Atendimento consultivo", "Entenda a necessidade antes de apresentar a solução."),
      section("Execução profissional", "Processos organizados e comunicação transparente."),
      section("Suporte próximo", "Contato simples durante todas as etapas."),
    ],
    beneficios: [
      section("Clareza", "Informações organizadas para facilitar a decisão."),
      section("Confiança", "Uma apresentação consistente e profissional."),
      section("Agilidade", "Canais diretos para orçamento e atendimento."),
    ],
  };
}
