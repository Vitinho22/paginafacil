export type SiteStatus = "rascunho" | "publicado";
export type TemplateId = "corporativo" | "restaurante" | "vendas" | "portfolio";

export type SiteSection = {
  titulo: string;
  texto: string;
};

export type Site = {
  id: string;
  userId: string;
  nome: string;
  segmento: string;
  cidade: string;
  whatsapp: string;
  instagram: string;
  estilo: string;
  templateId: TemplateId;
  descricaoInicial: string;
  titulo: string;
  subtitulo: string;
  etiqueta: string;
  ctaPrimario: string;
  ctaSecundario: string;
  cor: string;
  corFundo: string;
  servicos: SiteSection[];
  beneficios: SiteSection[];
  status: SiteStatus;
  criadoEm: string;
  atualizadoEm: string;
};
