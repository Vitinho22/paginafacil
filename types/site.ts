export type SiteStatus = "rascunho" | "publicado";

export type TemplateId =
  | "corporativo"
  | "restaurante"
  | "vendas"
  | "portfolio"
  | "pizzaria"
  | "hamburgueria"
  | "confeitaria"
  | "cafeteria"
  | "clinica"
  | "dentista"
  | "psicologo"
  | "barbearia"
  | "salao"
  | "estetica"
  | "academia"
  | "personal"
  | "imobiliaria"
  | "advogado"
  | "contabilidade"
  | "consultoria"
  | "arquitetura"
  | "fotografia"
  | "petshop"
  | "veterinaria"
  | "oficina"
  | "eletricista"
  | "encanador"
  | "loja"
  | "moda"
  | "delivery"
  | "evento"
  | "curso"
  | "ebook"
  | "afiliado"
  | "landing-page";

export type SiteSection = {
  id?: string;
  titulo: string;
  texto: string;
  imagem?: string;
  icone?: string;
  ativo?: boolean;
};

export type SiteSocialLink = {
  nome: string;
  url: string;
};

export type SiteImage = {
  url: string;
  alt: string;
};

export type Site = {
  id: string;
  userId: string;

  nome: string;
  segmento: string;
  cidade: string;

  whatsapp: string;
  instagram: string;
  email?: string;
  telefone?: string;
  endereco?: string;

  estilo: string;
  templateId: TemplateId;

  descricaoInicial: string;
  titulo: string;
  subtitulo: string;
  etiqueta: string;

  ctaPrimario: string;
  ctaSecundario: string;
  linkCtaPrimario?: string;
  linkCtaSecundario?: string;

  cor: string;
  corSecundaria?: string;
  corFundo: string;
  corTexto?: string;

  logo?: string;
  favicon?: string;
  imagemHero?: string;
  imagens?: SiteImage[];

  servicos: SiteSection[];
  beneficios: SiteSection[];
  depoimentos?: SiteSection[];
  perguntasFrequentes?: SiteSection[];

  redesSociais?: SiteSocialLink[];

  status: SiteStatus;
  slug?: string;
  dominio?: string;
  publicadoEm?: string;

  criadoEm: string;
  atualizadoEm: string;
};