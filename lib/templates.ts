import type { Site, SiteSection, TemplateId } from "@/types/site";

export type TemplateCategory =
  | "negocios"
  | "alimentacao"
  | "saude"
  | "beleza"
  | "servicos"
  | "vendas"
  | "lojas"
  | "portfolio"
  | "educacao"
  | "eventos";

export type TemplateLayout =
  | "editorial"
  | "luxo"
  | "minimalista"
  | "conversao"
  | "catalogo"
  | "institucional"
  | "criativo";

export type TemplateDefinition = {
  id: TemplateId;
  nome: string;
  descricao: string;
  indicadoPara: string;
  categoria: TemplateCategory;
  tags: string[];
  keywords: string[];
  cor: string;
  corSecundaria: string;
  corFundo: string;
  corTexto: string;
  previewImage: string;
  layout: TemplateLayout;
  destaque: boolean;
  premium: boolean;
};

type ContentProfile = {
  etiqueta: string;
  titulo: (nome: string) => string;
  subtitulo: (nome: string, cidade: string, segmento: string) => string;
  ctaPrimario: string;
  ctaSecundario: string;
  servicos: SiteSection[];
  beneficios: SiteSection[];
  depoimentos?: SiteSection[];
  perguntasFrequentes?: SiteSection[];
};

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=88`;

export const templates: TemplateDefinition[] = [
  {
    id: "corporativo",
    nome: "Norte",
    descricao: "Institucional sofisticado, com autoridade, serviços e contato em destaque.",
    indicadoPara: "Empresas, consultorias, clínicas e prestadores de serviços",
    categoria: "negocios",
    tags: ["Institucional", "Empresa", "Serviços", "Profissional"],
    keywords: ["empresa", "corporativo", "consultoria", "servicos", "negocio"],
    cor: "#1E3A5F",
    corSecundaria: "#C9A66B",
    corFundo: "#F5F2EC",
    corTexto: "#101820",
    previewImage: image("photo-1497366754035-f200968a6e72"),
    layout: "institucional",
    destaque: true,
    premium: false,
  },
  {
    id: "restaurante",
    nome: "Sabor",
    descricao: "Experiência gastronômica com cardápio, reservas e pedidos pelo WhatsApp.",
    indicadoPara: "Restaurantes, bistrôs, lanchonetes e cozinhas autorais",
    categoria: "alimentacao",
    tags: ["Restaurante", "Cardápio", "Reservas", "Delivery"],
    keywords: ["restaurante", "bistro", "comida", "gastronomia", "cardapio"],
    cor: "#8C3B25",
    corSecundaria: "#D6B777",
    corFundo: "#FBF5EA",
    corTexto: "#241611",
    previewImage: image("photo-1414235077428-338989a2e8c0"),
    layout: "luxo",
    destaque: true,
    premium: false,
  },
  {
    id: "vendas",
    nome: "Conversão",
    descricao: "Landing page de alta conversão para apresentar ofertas e gerar ação.",
    indicadoPara: "Produtos, serviços, cursos, ebooks e campanhas",
    categoria: "vendas",
    tags: ["Landing page", "Oferta", "Conversão", "Campanha"],
    keywords: ["vendas", "produto", "oferta", "landing", "conversao"],
    cor: "#5B21B6",
    corSecundaria: "#F59E0B",
    corFundo: "#FAF7FF",
    corTexto: "#171123",
    previewImage: image("photo-1556742049-0cfed4f6a45d"),
    layout: "conversao",
    destaque: true,
    premium: false,
  },
  {
    id: "portfolio",
    nome: "Ateliê",
    descricao: "Portfólio editorial com projetos, processo e orçamento em destaque.",
    indicadoPara: "Designers, fotógrafos, arquitetos e profissionais criativos",
    categoria: "portfolio",
    tags: ["Portfólio", "Criativo", "Projetos", "Editorial"],
    keywords: ["portfolio", "designer", "criativo", "projetos", "artista"],
    cor: "#173F3A",
    corSecundaria: "#C7A46B",
    corFundo: "#F2F0EA",
    corTexto: "#14201E",
    previewImage: image("photo-1505693416388-ac5ce068fe85"),
    layout: "editorial",
    destaque: true,
    premium: false,
  },
  {
    id: "pizzaria",
    nome: "Forno",
    descricao: "Visual marcante para sabores, combos, promoções e pedidos rápidos.",
    indicadoPara: "Pizzarias artesanais, delivery e restaurantes italianos",
    categoria: "alimentacao",
    tags: ["Pizzaria", "Delivery", "Combos", "Cardápio"],
    keywords: ["pizzaria", "pizza", "forno", "delivery"],
    cor: "#A52A1D",
    corSecundaria: "#F2C14E",
    corFundo: "#FFF7E8",
    corTexto: "#241512",
    previewImage: image("photo-1579751626657-72bc17010498"),
    layout: "catalogo",
    destaque: true,
    premium: true,
  },
  {
    id: "hamburgueria",
    nome: "Brasa",
    descricao: "Identidade urbana para cardápio, combos e chamadas promocionais.",
    indicadoPara: "Hamburguerias, food trucks e operações de delivery",
    categoria: "alimentacao",
    tags: ["Hambúrguer", "Delivery", "Urbano", "Combos"],
    keywords: ["hamburguer", "hamburgueria", "burger", "food truck"],
    cor: "#E85D04",
    corSecundaria: "#FFD166",
    corFundo: "#141414",
    corTexto: "#FFFFFF",
    previewImage: image("photo-1568901346375-23c9450c58cd"),
    layout: "catalogo",
    destaque: false,
    premium: true,
  },
  {
    id: "confeitaria",
    nome: "Doce",
    descricao: "Catálogo delicado para bolos, encomendas e datas especiais.",
    indicadoPara: "Confeitarias, boleiras, docerias e festas",
    categoria: "alimentacao",
    tags: ["Confeitaria", "Bolos", "Encomendas", "Catálogo"],
    keywords: ["confeitaria", "bolo", "doceria", "doce", "festa"],
    cor: "#B76E79",
    corSecundaria: "#E7C8A0",
    corFundo: "#FFF8F6",
    corTexto: "#3D292D",
    previewImage: image("photo-1578985545062-69928b1d9587"),
    layout: "luxo",
    destaque: false,
    premium: true,
  },
  {
    id: "cafeteria",
    nome: "Grão",
    descricao: "Atmosfera acolhedora para cardápio, ambiente e reservas.",
    indicadoPara: "Cafeterias, padarias artesanais e bistrôs",
    categoria: "alimentacao",
    tags: ["Café", "Cardápio", "Ambiente", "Reservas"],
    keywords: ["cafeteria", "cafe", "padaria", "grao"],
    cor: "#5E4634",
    corSecundaria: "#C89B6D",
    corFundo: "#F8F1E7",
    corTexto: "#2A211B",
    previewImage: image("photo-1495474472287-4d71bcdd2085"),
    layout: "editorial",
    destaque: false,
    premium: true,
  },
  {
    id: "clinica",
    nome: "Serena",
    descricao: "Apresentação limpa e confiável para especialidades e agendamentos.",
    indicadoPara: "Clínicas médicas, consultórios e centros de saúde",
    categoria: "saude",
    tags: ["Clínica", "Saúde", "Agendamento", "Confiança"],
    keywords: ["clinica", "medico", "saude", "consultorio"],
    cor: "#246B6B",
    corSecundaria: "#90C8C8",
    corFundo: "#F3FAF9",
    corTexto: "#173B3B",
    previewImage: image("photo-1576091160399-112ba8d25d1d"),
    layout: "minimalista",
    destaque: true,
    premium: true,
  },
  {
    id: "dentista",
    nome: "Clare",
    descricao: "Site moderno para tratamentos, equipe, estrutura e agendamentos.",
    indicadoPara: "Dentistas, clínicas odontológicas e ortodontia",
    categoria: "saude",
    tags: ["Odontologia", "Tratamentos", "Agendamento", "Equipe"],
    keywords: ["dentista", "odontologia", "clinica odontologica", "sorriso"],
    cor: "#167D9A",
    corSecundaria: "#7DD3FC",
    corFundo: "#F4FBFD",
    corTexto: "#123440",
    previewImage: image("photo-1609840114035-3c981b782dfe"),
    layout: "minimalista",
    destaque: false,
    premium: true,
  },
  {
    id: "psicologo",
    nome: "Essência",
    descricao: "Experiência serena para apresentar abordagem, atendimento e contato.",
    indicadoPara: "Psicólogos, terapeutas e profissionais de bem-estar",
    categoria: "saude",
    tags: ["Psicologia", "Terapia", "Acolhimento", "Agenda"],
    keywords: ["psicologo", "psicologia", "terapia", "terapeuta"],
    cor: "#6D5D6E",
    corSecundaria: "#B8A7B9",
    corFundo: "#F8F5F8",
    corTexto: "#322C33",
    previewImage: image("photo-1499209974431-9dddcece7f88"),
    layout: "editorial",
    destaque: false,
    premium: true,
  },
  {
    id: "barbearia",
    nome: "Baron",
    descricao: "Visual masculino e premium para serviços, horários e reservas.",
    indicadoPara: "Barbearias, barbeiros e grooming masculino",
    categoria: "beleza",
    tags: ["Barbearia", "Agenda", "Serviços", "Premium"],
    keywords: ["barbearia", "barbeiro", "cabelo", "barba"],
    cor: "#1C1C1C",
    corSecundaria: "#C59D5F",
    corFundo: "#F1EEE8",
    corTexto: "#151515",
    previewImage: image("photo-1503951914875-452162b0f3f1"),
    layout: "luxo",
    destaque: true,
    premium: true,
  },
  {
    id: "salao",
    nome: "Bella",
    descricao: "Site elegante para serviços, profissionais, agenda e resultados.",
    indicadoPara: "Salões de beleza, cabeleireiros e nail designers",
    categoria: "beleza",
    tags: ["Salão", "Beleza", "Agenda", "Serviços"],
    keywords: ["salao", "cabeleireiro", "beleza", "unhas"],
    cor: "#9D4E72",
    corSecundaria: "#E8B4C8",
    corFundo: "#FFF7FA",
    corTexto: "#3D2430",
    previewImage: image("photo-1560066984-138dadb4c035"),
    layout: "luxo",
    destaque: false,
    premium: true,
  },
  {
    id: "estetica",
    nome: "Aura",
    descricao: "Apresentação sofisticada para procedimentos, resultados e agenda.",
    indicadoPara: "Clínicas de estética, spas e profissionais de beleza",
    categoria: "beleza",
    tags: ["Estética", "Procedimentos", "Resultados", "Agenda"],
    keywords: ["estetica", "spa", "procedimento", "beleza"],
    cor: "#8A6D5C",
    corSecundaria: "#D8C2B1",
    corFundo: "#FAF7F3",
    corTexto: "#382E28",
    previewImage: image("photo-1570172619644-dfd03ed5d881"),
    layout: "minimalista",
    destaque: true,
    premium: true,
  },
  {
    id: "academia",
    nome: "Pulse",
    descricao: "Visual energético para planos, modalidades, estrutura e matrículas.",
    indicadoPara: "Academias, boxes, studios e centros esportivos",
    categoria: "saude",
    tags: ["Academia", "Planos", "Matrícula", "Treino"],
    keywords: ["academia", "fitness", "crossfit", "treino"],
    cor: "#121212",
    corSecundaria: "#B8FF3D",
    corFundo: "#F4F5F2",
    corTexto: "#111111",
    previewImage: image("photo-1534438327276-14e5300c3a48"),
    layout: "conversao",
    destaque: true,
    premium: true,
  },
  {
    id: "personal",
    nome: "Move",
    descricao: "Marca pessoal forte para planos, acompanhamento e transformação.",
    indicadoPara: "Personal trainers, coaches e profissionais fitness",
    categoria: "saude",
    tags: ["Personal", "Treino", "Resultados", "Planos"],
    keywords: ["personal", "personal trainer", "coach", "fitness"],
    cor: "#EF5B2A",
    corSecundaria: "#171717",
    corFundo: "#FFF8F3",
    corTexto: "#251A16",
    previewImage: image("photo-1571019613454-1cb2f99b2d8b"),
    layout: "conversao",
    destaque: false,
    premium: true,
  },
  {
    id: "imobiliaria",
    nome: "Prime",
    descricao: "Catálogo premium para imóveis, captação e atendimento comercial.",
    indicadoPara: "Imobiliárias, corretores e lançamentos",
    categoria: "negocios",
    tags: ["Imóveis", "Catálogo", "Captação", "Contato"],
    keywords: ["imobiliaria", "corretor", "imovel", "apartamento", "casa"],
    cor: "#16283A",
    corSecundaria: "#C8A96B",
    corFundo: "#F4F1EA",
    corTexto: "#111C28",
    previewImage: image("photo-1600585154340-be6161a56a0c"),
    layout: "luxo",
    destaque: true,
    premium: true,
  },
  {
    id: "advogado",
    nome: "Legado",
    descricao: "Autoridade e sobriedade para áreas de atuação e atendimento.",
    indicadoPara: "Advogados, escritórios jurídicos e consultorias legais",
    categoria: "negocios",
    tags: ["Advocacia", "Autoridade", "Atuação", "Contato"],
    keywords: ["advogado", "advocacia", "juridico", "direito"],
    cor: "#172033",
    corSecundaria: "#B79A61",
    corFundo: "#F5F2EC",
    corTexto: "#121824",
    previewImage: image("photo-1450101499163-c8848c66ca85"),
    layout: "institucional",
    destaque: true,
    premium: true,
  },
  {
    id: "contabilidade",
    nome: "Balanço",
    descricao: "Site confiável para serviços contábeis, abertura de empresa e contato.",
    indicadoPara: "Contadores, escritórios e consultorias financeiras",
    categoria: "negocios",
    tags: ["Contabilidade", "Empresas", "Financeiro", "Consultoria"],
    keywords: ["contabilidade", "contador", "financeiro", "empresa"],
    cor: "#0F5C4D",
    corSecundaria: "#6BC4A6",
    corFundo: "#F3F9F7",
    corTexto: "#15352F",
    previewImage: image("photo-1554224155-6726b3ff858f"),
    layout: "institucional",
    destaque: false,
    premium: true,
  },
  {
    id: "consultoria",
    nome: "Estratégia",
    descricao: "Posicionamento executivo para soluções, metodologia e resultados.",
    indicadoPara: "Consultores, mentores e especialistas B2B",
    categoria: "negocios",
    tags: ["Consultoria", "B2B", "Estratégia", "Resultados"],
    keywords: ["consultoria", "mentor", "estrategia", "b2b"],
    cor: "#27324A",
    corSecundaria: "#6E8EDB",
    corFundo: "#F5F7FB",
    corTexto: "#141C2B",
    previewImage: image("photo-1521737711867-e3b97375f902"),
    layout: "editorial",
    destaque: false,
    premium: true,
  },
  {
    id: "arquitetura",
    nome: "Forma",
    descricao: "Portfólio editorial para projetos, conceito e identidade autoral.",
    indicadoPara: "Arquitetos, interiores e escritórios de projetos",
    categoria: "portfolio",
    tags: ["Arquitetura", "Interiores", "Projetos", "Editorial"],
    keywords: ["arquitetura", "arquiteto", "interiores", "projetos"],
    cor: "#1D2A27",
    corSecundaria: "#C6A978",
    corFundo: "#EEEAE2",
    corTexto: "#17201E",
    previewImage: image("photo-1600607687939-ce8a6c25118c"),
    layout: "editorial",
    destaque: true,
    premium: true,
  },
  {
    id: "fotografia",
    nome: "Lume",
    descricao: "Portfólio imersivo para ensaios, histórias e orçamento.",
    indicadoPara: "Fotógrafos, videomakers e estúdios criativos",
    categoria: "portfolio",
    tags: ["Fotografia", "Ensaios", "Portfólio", "Orçamento"],
    keywords: ["fotografia", "fotografo", "ensaio", "video"],
    cor: "#171717",
    corSecundaria: "#D8C3A5",
    corFundo: "#F6F3EE",
    corTexto: "#171717",
    previewImage: image("photo-1516035069371-29a1b244cc32"),
    layout: "editorial",
    destaque: false,
    premium: true,
  },
  {
    id: "petshop",
    nome: "Pata",
    descricao: "Site acolhedor para serviços, produtos e agendamentos pet.",
    indicadoPara: "Pet shops, banho e tosa e cuidadores",
    categoria: "servicos",
    tags: ["Pet shop", "Banho e tosa", "Agenda", "Produtos"],
    keywords: ["petshop", "pet shop", "banho e tosa", "animal"],
    cor: "#2F7D6D",
    corSecundaria: "#F2B84B",
    corFundo: "#F4FBF8",
    corTexto: "#183A33",
    previewImage: image("photo-1601758228041-f3b2795255f1"),
    layout: "catalogo",
    destaque: true,
    premium: true,
  },
  {
    id: "veterinaria",
    nome: "Vitta Pet",
    descricao: "Confiança e cuidado para especialidades, equipe e atendimento.",
    indicadoPara: "Clínicas veterinárias e hospitais pet",
    categoria: "saude",
    tags: ["Veterinária", "Saúde pet", "Equipe", "Agenda"],
    keywords: ["veterinaria", "veterinario", "clinica pet", "animal"],
    cor: "#1E6B69",
    corSecundaria: "#8DD3C7",
    corFundo: "#F3FAF9",
    corTexto: "#173936",
    previewImage: image("photo-1628009368231-7bb7cfcb0def"),
    layout: "minimalista",
    destaque: false,
    premium: true,
  },
  {
    id: "oficina",
    nome: "Torque",
    descricao: "Visual robusto para serviços, confiança e orçamento rápido.",
    indicadoPara: "Oficinas, centros automotivos e mecânicos",
    categoria: "servicos",
    tags: ["Oficina", "Automotivo", "Orçamento", "Serviços"],
    keywords: ["oficina", "mecanico", "automotivo", "carro"],
    cor: "#D14924",
    corSecundaria: "#20242A",
    corFundo: "#F4F4F2",
    corTexto: "#1A1D21",
    previewImage: image("photo-1487754180451-c456f719a1fc"),
    layout: "conversao",
    destaque: true,
    premium: true,
  },
  {
    id: "eletricista",
    nome: "Voltz",
    descricao: "Site direto para serviços, emergência e solicitação de orçamento.",
    indicadoPara: "Eletricistas residenciais, comerciais e industriais",
    categoria: "servicos",
    tags: ["Eletricista", "Emergência", "Orçamento", "Serviços"],
    keywords: ["eletricista", "eletrica", "instalacao", "manutencao"],
    cor: "#F1B900",
    corSecundaria: "#20252B",
    corFundo: "#FFFBEA",
    corTexto: "#27230F",
    previewImage: image("photo-1621905252507-b35492cc74b4"),
    layout: "conversao",
    destaque: false,
    premium: true,
  },
  {
    id: "encanador",
    nome: "Fluxo",
    descricao: "Apresentação confiável para serviços hidráulicos e atendimento rápido.",
    indicadoPara: "Encanadores, hidráulica e manutenção residencial",
    categoria: "servicos",
    tags: ["Hidráulica", "Emergência", "Orçamento", "Atendimento"],
    keywords: ["encanador", "hidraulica", "vazamento", "manutencao"],
    cor: "#1677A8",
    corSecundaria: "#6DC5E8",
    corFundo: "#F2FAFD",
    corTexto: "#163543",
    previewImage: image("photo-1585704032915-c3400ca199e7"),
    layout: "institucional",
    destaque: false,
    premium: true,
  },
  {
    id: "loja",
    nome: "Vitrine",
    descricao: "Catálogo elegante para produtos, coleções e atendimento.",
    indicadoPara: "Lojas físicas, pequenos e-commerces e revendedores",
    categoria: "lojas",
    tags: ["Loja", "Produtos", "Catálogo", "WhatsApp"],
    keywords: ["loja", "ecommerce", "produto", "catalogo"],
    cor: "#111827",
    corSecundaria: "#D1A66A",
    corFundo: "#F7F5F0",
    corTexto: "#171A20",
    previewImage: image("photo-1441986300917-64674bd600d8"),
    layout: "catalogo",
    destaque: true,
    premium: true,
  },
  {
    id: "moda",
    nome: "Essencial",
    descricao: "Editorial moderno para coleções, lançamentos e campanhas.",
    indicadoPara: "Marcas de moda, boutiques e lojas de roupas",
    categoria: "lojas",
    tags: ["Moda", "Coleção", "Editorial", "Loja"],
    keywords: ["moda", "roupa", "boutique", "colecao"],
    cor: "#161616",
    corSecundaria: "#D7C3A5",
    corFundo: "#F4F1EC",
    corTexto: "#161616",
    previewImage: image("photo-1445205170230-053b83016050"),
    layout: "editorial",
    destaque: true,
    premium: true,
  },
  {
    id: "delivery",
    nome: "Rápido",
    descricao: "Cardápio objetivo para ofertas, combos e pedidos instantâneos.",
    indicadoPara: "Delivery, marmitas, lanches e comida por encomenda",
    categoria: "alimentacao",
    tags: ["Delivery", "Pedidos", "Combos", "WhatsApp"],
    keywords: ["delivery", "entrega", "marmita", "pedido"],
    cor: "#E5482B",
    corSecundaria: "#FFD34E",
    corFundo: "#FFF8ED",
    corTexto: "#2B1C18",
    previewImage: image("photo-1526367790999-0150786686a2"),
    layout: "conversao",
    destaque: false,
    premium: true,
  },
  {
    id: "evento",
    nome: "Celebra",
    descricao: "Landing page envolvente para programação, ingressos e presença.",
    indicadoPara: "Eventos, festas, workshops e encontros",
    categoria: "eventos",
    tags: ["Evento", "Ingressos", "Programação", "Inscrição"],
    keywords: ["evento", "festa", "workshop", "ingresso"],
    cor: "#5A31D6",
    corSecundaria: "#FF6B9B",
    corFundo: "#F8F5FF",
    corTexto: "#211536",
    previewImage: image("photo-1492684223066-81342ee5ff30"),
    layout: "criativo",
    destaque: false,
    premium: true,
  },
  {
    id: "curso",
    nome: "Método",
    descricao: "Página de lançamento para conteúdo, módulos e matrículas.",
    indicadoPara: "Cursos online, treinamentos e mentorias",
    categoria: "educacao",
    tags: ["Curso", "Módulos", "Matrícula", "Lançamento"],
    keywords: ["curso", "treinamento", "aula", "mentoria"],
    cor: "#4F46E5",
    corSecundaria: "#F59E0B",
    corFundo: "#F7F7FF",
    corTexto: "#17172A",
    previewImage: image("photo-1523240795612-9a054b0db644"),
    layout: "conversao",
    destaque: true,
    premium: true,
  },
  {
    id: "ebook",
    nome: "Autor",
    descricao: "Página de venda elegante para ebook, bônus e chamada para compra.",
    indicadoPara: "Autores, infoprodutores e especialistas",
    categoria: "vendas",
    tags: ["Ebook", "Autor", "Bônus", "Venda"],
    keywords: ["ebook", "e-book", "livro", "autor"],
    cor: "#25304A",
    corSecundaria: "#D6A85F",
    corFundo: "#F7F3EC",
    corTexto: "#1B2232",
    previewImage: image("photo-1495446815901-a7297e633e8d"),
    layout: "conversao",
    destaque: false,
    premium: true,
  },
  {
    id: "afiliado",
    nome: "Oferta",
    descricao: "Landing page objetiva para review, benefícios e direcionamento.",
    indicadoPara: "Afiliados, campanhas e páginas de pré-venda",
    categoria: "vendas",
    tags: ["Afiliado", "Review", "Oferta", "Conversão"],
    keywords: ["afiliado", "review", "presell", "oferta"],
    cor: "#0F172A",
    corSecundaria: "#22C55E",
    corFundo: "#F5F7FA",
    corTexto: "#101827",
    previewImage: image("photo-1556740758-90de374c12ad"),
    layout: "conversao",
    destaque: false,
    premium: true,
  },
  {
    id: "landing-page",
    nome: "Impacto",
    descricao: "Landing page premium, flexível e preparada para qualquer campanha.",
    indicadoPara: "Captação de leads, lançamentos, serviços e campanhas",
    categoria: "vendas",
    tags: ["Landing page", "Leads", "Campanha", "Conversão"],
    keywords: ["landing page", "lead", "campanha", "conversao"],
    cor: "#111827",
    corSecundaria: "#7C3AED",
    corFundo: "#F7F5FF",
    corTexto: "#161522",
    previewImage: image("photo-1460925895917-afdab827c52f"),
    layout: "conversao",
    destaque: true,
    premium: true,
  },
];

const section = (
  titulo: string,
  texto: string,
  imagem?: string,
  icone?: string,
): SiteSection => ({
  titulo,
  texto,
  ...(imagem ? { imagem } : {}),
  ...(icone ? { icone } : {}),
  ativo: true,
});

const contentProfiles: Partial<Record<TemplateId, ContentProfile>> = {
  corporativo: {
    etiqueta: "Estratégia, confiança e presença profissional",
    titulo: (nome) => `${nome}: uma presença digital à altura do seu trabalho.`,
    subtitulo: (_nome, cidade) =>
      cidade
        ? `Atendimento em ${cidade}, com serviços apresentados com clareza, autoridade e contato direto.`
        : "Apresente seus serviços com clareza, fortaleça sua autoridade e transforme visitas em oportunidades.",
    ctaPrimario: "Solicitar atendimento",
    ctaSecundario: "Conhecer serviços",
    servicos: [
      section("Diagnóstico estratégico", "Entendimento do cenário antes de indicar a solução mais adequada."),
      section("Execução profissional", "Processos claros, comunicação próxima e atenção aos detalhes."),
      section("Acompanhamento", "Suporte durante cada etapa para manter qualidade e previsibilidade."),
    ],
    beneficios: [
      section("Mais autoridade", "Uma apresentação coerente aumenta a confiança antes do primeiro contato."),
      section("Decisão facilitada", "Informações organizadas ajudam o visitante a entender seu valor."),
      section("Contato direto", "Chamadas claras para orçamento, atendimento e novas oportunidades."),
    ],
  },
  restaurante: {
    etiqueta: "Sabor, ambiente e experiência em cada detalhe",
    titulo: (nome) => `${nome}: uma experiência criada para ser lembrada.`,
    subtitulo: (_nome, cidade) =>
      cidade
        ? `Sabores selecionados, ambiente acolhedor e atendimento em ${cidade}.`
        : "Descubra sabores selecionados, atendimento acolhedor e uma experiência feita para você.",
    ctaPrimario: "Fazer reserva",
    ctaSecundario: "Ver cardápio",
    servicos: [
      section("Cardápio autoral", "Pratos organizados para valorizar especialidades, novidades e combinações."),
      section("Reservas simples", "Contato rápido para reservar, pedir informações ou organizar uma ocasião especial."),
      section("Experiência completa", "Ambiente, atendimento e apresentação pensados para encantar."),
    ],
    beneficios: [
      section("Escolha mais fácil", "Categorias claras ajudam o cliente a encontrar o que deseja."),
      section("Mais pedidos", "Botões diretos reduzem etapas entre o interesse e a ação."),
      section("Marca valorizada", "Imagens e textos coerentes reforçam a qualidade percebida."),
    ],
  },
  vendas: {
    etiqueta: "Uma página construída para transformar interesse em ação",
    titulo: (nome) => `${nome}: apresente sua oferta com clareza e venda com mais confiança.`,
    subtitulo: () =>
      "Explique sua solução, destaque benefícios, reduza objeções e conduza o visitante para o próximo passo.",
    ctaPrimario: "Quero conhecer",
    ctaSecundario: "Ver benefícios",
    servicos: [
      section("Oferta clara", "Mostre o que está sendo oferecido, para quem serve e qual transformação entrega."),
      section("Prova e confiança", "Use benefícios, diferenciais e evidências para reduzir inseguranças."),
      section("Ação orientada", "Chamadas estratégicas ajudam o visitante a avançar sem confusão."),
    ],
    beneficios: [
      section("Mais atenção", "Hierarquia visual criada para conduzir a leitura."),
      section("Menos objeções", "Conteúdo organizado responde dúvidas antes da decisão."),
      section("Mais conversas", "Botões e seções voltados para contato, compra ou cadastro."),
    ],
  },
  portfolio: {
    etiqueta: "Projetos, processo e identidade profissional",
    titulo: (nome) => `${nome}: trabalhos apresentados com personalidade e propósito.`,
    subtitulo: () =>
      "Uma presença editorial para destacar projetos, experiência, processo criativo e formas de contratação.",
    ctaPrimario: "Solicitar orçamento",
    ctaSecundario: "Ver projetos",
    servicos: [
      section("Projetos selecionados", "Uma curadoria dos trabalhos que melhor representam sua experiência."),
      section("Processo autoral", "Explique como cada projeto é conduzido, da ideia até a entrega."),
      section("Orçamento simples", "Facilite o primeiro contato com um caminho claro e profissional."),
    ],
    beneficios: [
      section("Identidade consistente", "Visual alinhado à sua linguagem e ao público que deseja alcançar."),
      section("Projetos valorizados", "Espaço e hierarquia para cada trabalho ganhar importância."),
      section("Mais credibilidade", "Apresentação preparada para clientes e novas parcerias."),
    ],
  },
};

const profileGroups: Record<string, TemplateId[]> = {
  alimentacao: ["pizzaria", "hamburgueria", "confeitaria", "cafeteria", "delivery"],
  saude: ["clinica", "dentista", "psicologo", "veterinaria"],
  beleza: ["barbearia", "salao", "estetica"],
  fitness: ["academia", "personal"],
  negocios: ["imobiliaria", "advogado", "contabilidade", "consultoria"],
  criativo: ["arquitetura", "fotografia"],
  servicos: ["petshop", "oficina", "eletricista", "encanador"],
  loja: ["loja", "moda"],
  educacao: ["curso", "ebook"],
  campanhas: ["afiliado", "landing-page", "evento"],
};

const groupProfiles: Record<string, ContentProfile> = {
  alimentacao: {
    etiqueta: "Sabor, praticidade e uma experiência que conquista",
    titulo: (nome) => `${nome}: transforme cada escolha em uma experiência especial.`,
    subtitulo: (_nome, cidade, segmento) =>
      `${segmento} com apresentação profissional${cidade ? ` em ${cidade}` : ""}, opções bem organizadas e contato rápido para pedidos.`,
    ctaPrimario: "Fazer pedido",
    ctaSecundario: "Ver opções",
    servicos: [
      section("Seleção especial", "Produtos e opções apresentados com destaque e organização."),
      section("Pedido rápido", "Contato direto para pedidos, dúvidas e informações."),
      section("Atendimento próximo", "Uma experiência simples do primeiro acesso até a entrega."),
    ],
    beneficios: [
      section("Mais desejo", "Imagens, textos e organização aumentam o valor percebido."),
      section("Escolha fácil", "Categorias claras ajudam o cliente a decidir."),
      section("Ação imediata", "Botões estratégicos reduzem o caminho até o pedido."),
    ],
  },
  saude: {
    etiqueta: "Cuidado, confiança e atendimento humanizado",
    titulo: (nome) => `${nome}: cuidado profissional com uma presença que transmite confiança.`,
    subtitulo: (_nome, cidade, segmento) =>
      `Conheça os atendimentos de ${segmento}${cidade ? ` em ${cidade}` : ""}, especialidades e formas de agendamento.`,
    ctaPrimario: "Agendar atendimento",
    ctaSecundario: "Conhecer especialidades",
    servicos: [
      section("Avaliação cuidadosa", "Atendimento atento às necessidades de cada pessoa."),
      section("Especialidades", "Serviços apresentados de forma clara e fácil de entender."),
      section("Acompanhamento", "Orientação e contato próximo durante cada etapa."),
    ],
    beneficios: [
      section("Mais segurança", "Informações claras ajudam o paciente a tomar uma decisão."),
      section("Agenda facilitada", "Contato direto para tirar dúvidas e solicitar atendimento."),
      section("Presença confiável", "Visual limpo e profissional reforça credibilidade."),
    ],
  },
  beleza: {
    etiqueta: "Beleza, cuidado e uma experiência feita para você",
    titulo: (nome) => `${nome}: realce sua melhor versão com cuidado e estilo.`,
    subtitulo: (_nome, cidade, segmento) =>
      `${segmento}${cidade ? ` em ${cidade}` : ""} com serviços selecionados, atendimento personalizado e agendamento simples.`,
    ctaPrimario: "Agendar horário",
    ctaSecundario: "Ver serviços",
    servicos: [
      section("Atendimento personalizado", "Serviços escolhidos de acordo com seu estilo e objetivo."),
      section("Profissionais preparados", "Cuidado técnico e atenção em cada detalhe."),
      section("Agenda prática", "Marque seu horário rapidamente pelo canal de atendimento."),
    ],
    beneficios: [
      section("Resultado valorizado", "Apresentação visual que destaca qualidade e transformação."),
      section("Mais confiança", "Serviços e informações organizados de forma profissional."),
      section("Contato simples", "Menos etapas para tirar dúvidas e marcar horário."),
    ],
  },
  fitness: {
    etiqueta: "Movimento, disciplina e evolução de verdade",
    titulo: (nome) => `${nome}: comece agora a construir sua melhor fase.`,
    subtitulo: (_nome, cidade, segmento) =>
      `${segmento}${cidade ? ` em ${cidade}` : ""} com acompanhamento, estrutura e planos para diferentes objetivos.`,
    ctaPrimario: "Começar agora",
    ctaSecundario: "Conhecer planos",
    servicos: [
      section("Plano personalizado", "Estratégia adaptada ao seu nível, rotina e objetivo."),
      section("Acompanhamento", "Orientação para evoluir com segurança e consistência."),
      section("Resultados reais", "Processo organizado para transformar esforço em progresso."),
    ],
    beneficios: [
      section("Mais motivação", "Metas claras ajudam a manter a constância."),
      section("Treino inteligente", "Planejamento reduz improvisos e melhora o aproveitamento."),
      section("Evolução acompanhada", "Resultados percebidos e ajustados ao longo do caminho."),
    ],
  },
  negocios: {
    etiqueta: "Autoridade, estratégia e resultados consistentes",
    titulo: (nome) => `${nome}: confiança para decisões importantes.`,
    subtitulo: (_nome, cidade, segmento) =>
      `${segmento}${cidade ? ` em ${cidade}` : ""} com atendimento especializado, clareza e compromisso com cada cliente.`,
    ctaPrimario: "Solicitar atendimento",
    ctaSecundario: "Conhecer soluções",
    servicos: [
      section("Análise especializada", "Entendimento detalhado para indicar o melhor caminho."),
      section("Soluções sob medida", "Estratégias adequadas a cada necessidade e contexto."),
      section("Acompanhamento próximo", "Comunicação clara durante todas as etapas."),
    ],
    beneficios: [
      section("Mais confiança", "Posicionamento sólido antes mesmo do primeiro contato."),
      section("Clareza na decisão", "Serviços e diferenciais apresentados sem complicação."),
      section("Atendimento acessível", "Canais diretos para dúvidas, propostas e reuniões."),
    ],
  },
  criativo: {
    etiqueta: "Ideias, projetos e uma identidade que se destaca",
    titulo: (nome) => `${nome}: criatividade apresentada com intenção e presença.`,
    subtitulo: () =>
      "Conheça projetos, processo criativo e soluções desenvolvidas para transformar ideias em resultados.",
    ctaPrimario: "Solicitar orçamento",
    ctaSecundario: "Explorar projetos",
    servicos: [
      section("Projetos autorais", "Trabalhos selecionados para demonstrar estilo e experiência."),
      section("Processo criativo", "Uma visão clara de como cada ideia ganha forma."),
      section("Soluções personalizadas", "Projetos adaptados ao contexto, necessidade e objetivo."),
    ],
    beneficios: [
      section("Identidade forte", "Uma apresentação que diferencia seu trabalho."),
      section("Projetos valorizados", "Hierarquia editorial para dar protagonismo às imagens."),
      section("Mais oportunidades", "Contato direto para propostas e novas parcerias."),
    ],
  },
  servicos: {
    etiqueta: "Atendimento rápido, execução profissional e confiança",
    titulo: (nome) => `${nome}: solução profissional quando você precisa.`,
    subtitulo: (_nome, cidade, segmento) =>
      `${segmento}${cidade ? ` em ${cidade}` : ""} com atendimento ágil, orçamento claro e serviço bem executado.`,
    ctaPrimario: "Pedir orçamento",
    ctaSecundario: "Ver serviços",
    servicos: [
      section("Atendimento ágil", "Resposta rápida para entender sua necessidade."),
      section("Orçamento transparente", "Informações claras antes do início do serviço."),
      section("Execução cuidadosa", "Organização, responsabilidade e atenção ao resultado."),
    ],
    beneficios: [
      section("Menos preocupação", "Você sabe o que será feito e como será conduzido."),
      section("Contato direto", "Acesso rápido ao canal de atendimento."),
      section("Mais confiança", "Apresentação profissional e informações objetivas."),
    ],
  },
  loja: {
    etiqueta: "Produtos escolhidos para valorizar seu estilo",
    titulo: (nome) => `${nome}: uma vitrine criada para despertar desejo.`,
    subtitulo: (_nome, cidade) =>
      `Descubra coleções, novidades e produtos selecionados${cidade ? ` com atendimento em ${cidade}` : ""}.`,
    ctaPrimario: "Ver coleção",
    ctaSecundario: "Falar com a loja",
    servicos: [
      section("Coleções selecionadas", "Produtos organizados para facilitar a descoberta."),
      section("Novidades em destaque", "Lançamentos e peças especiais com mais visibilidade."),
      section("Atendimento próximo", "Contato rápido para tamanhos, disponibilidade e pedidos."),
    ],
    beneficios: [
      section("Mais desejo", "Apresentação editorial aumenta o valor percebido."),
      section("Compra facilitada", "Informações claras e acesso direto ao atendimento."),
      section("Marca consistente", "Cores, imagens e textos trabalhando juntos."),
    ],
  },
  educacao: {
    etiqueta: "Conhecimento organizado para gerar transformação",
    titulo: (nome) => `${nome}: aprenda com clareza e avance com direção.`,
    subtitulo: () =>
      "Conteúdo estruturado, benefícios claros e uma jornada criada para conduzir o aluno do interesse à matrícula.",
    ctaPrimario: "Quero começar",
    ctaSecundario: "Conhecer conteúdo",
    servicos: [
      section("Conteúdo estruturado", "Módulos e etapas apresentados de forma simples."),
      section("Aprendizado aplicável", "Conhecimento conectado a resultados práticos."),
      section("Acesso facilitado", "Informações claras sobre formato, entrega e suporte."),
    ],
    beneficios: [
      section("Mais clareza", "O aluno entende o que vai aprender e para quem serve."),
      section("Mais confiança", "Benefícios, conteúdo e diferenciais bem apresentados."),
      section("Decisão mais fácil", "Uma jornada visual orientada para matrícula ou compra."),
    ],
  },
  campanhas: {
    etiqueta: "Uma campanha clara, visual e preparada para converter",
    titulo: (nome) => `${nome}: uma experiência criada para gerar ação.`,
    subtitulo: () =>
      "Apresente a proposta, destaque os principais benefícios e conduza o visitante para o próximo passo.",
    ctaPrimario: "Quero participar",
    ctaSecundario: "Ver detalhes",
    servicos: [
      section("Mensagem central", "Uma proposta clara desde a primeira dobra."),
      section("Benefícios em destaque", "Razões objetivas para manter o interesse."),
      section("Ação estratégica", "Chamadas distribuídas para facilitar a conversão."),
    ],
    beneficios: [
      section("Mais atenção", "Design e conteúdo criados para prender o olhar."),
      section("Menos dúvidas", "Informações organizadas antes da decisão."),
      section("Mais conversões", "Fluxo construído para cadastro, compra ou contato."),
    ],
  },
};

function normalizarTexto(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function encontrarTemplate(templateId: TemplateId) {
  return (
    templates.find((item) => item.id === templateId) ??
    templates.find((item) => item.id === "corporativo")!
  );
}

export function listarTemplatesPorCategoria(categoria?: TemplateCategory) {
  if (!categoria) return templates;
  return templates.filter((template) => template.categoria === categoria);
}

export function pesquisarTemplates(termo: string) {
  const value = normalizarTexto(termo);

  if (!value) return templates;

  return templates.filter((template) => {
    const searchable = [
      template.nome,
      template.descricao,
      template.indicadoPara,
      template.categoria,
      ...template.tags,
      ...template.keywords,
    ]
      .map(normalizarTexto)
      .join(" ");

    return searchable.includes(value);
  });
}

export function escolherTemplate(segmento: string): TemplateId {
  const value = normalizarTexto(segmento);

  if (!value) return "corporativo";

  const exact = templates.find((template) =>
    template.keywords.some((keyword) => value.includes(normalizarTexto(keyword))),
  );

  return exact?.id ?? "corporativo";
}

type InitialSiteContent = Omit<
  Site,
  | "id"
  | "userId"
  | "whatsapp"
  | "instagram"
  | "descricaoInicial"
  | "status"
  | "criadoEm"
  | "atualizadoEm"
>;

type CreateInitialContentInput = {
  nome?: string;
  segmento?: string;
  cidade?: string;
  estilo?: string;
  templateId?: TemplateId;
};

function encontrarPerfil(templateId: TemplateId): ContentProfile {
  const direct = contentProfiles[templateId];
  if (direct) return direct;

  const group = Object.entries(profileGroups).find(([, ids]) =>
    ids.includes(templateId),
  )?.[0];

  return groupProfiles[group ?? "negocios"] ?? contentProfiles.corporativo!;
}

export function criarConteudoInicial(
  data: CreateInitialContentInput,
): InitialSiteContent {
  const nome = data.nome?.trim() || "Seu negócio";
  const segmento = data.segmento?.trim() || "Empresa";
  const cidade = data.cidade?.trim() || "";
  const templateId = data.templateId || escolherTemplate(segmento);
  const template = encontrarTemplate(templateId);
  const profile = encontrarPerfil(templateId);
  const estilo = data.estilo?.trim() || template.nome;

  return {
    nome,
    segmento,
    cidade,
    estilo,
    templateId,
    etiqueta: profile.etiqueta,
    titulo: profile.titulo(nome),
    subtitulo: profile.subtitulo(nome, cidade, segmento),
    ctaPrimario: profile.ctaPrimario,
    ctaSecundario: profile.ctaSecundario,
    cor: template.cor,
    corSecundaria: template.corSecundaria,
    corFundo: template.corFundo,
    corTexto: template.corTexto,
    imagemHero: template.previewImage,
    servicos: profile.servicos.map((item) => ({ ...item })),
    beneficios: profile.beneficios.map((item) => ({ ...item })),
    depoimentos: profile.depoimentos?.map((item) => ({ ...item })) ?? [],
    perguntasFrequentes:
      profile.perguntasFrequentes?.map((item) => ({ ...item })) ?? [],
  };
}