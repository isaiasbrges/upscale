import { z } from "zod";
import type { BlockField } from "@/types/block";

export const boosterFunnelConfigSchema = z.object({
  previewStage: z.enum(["scratch", "unlock", "offer"]).default("scratch"),
  brandText: z.string().default("VENDEDOR SINCERO — SÓ PRA VOCÊ"),
  scratchTitle: z.string().default("RASPE E VEJA\nO QUE VOCÊ GANHOU"),
  scratchSubtitle: z.string().default("Encontre 3 iguais e desbloqueie seu booster"),
  scratchInstruction: z.string().default("Raspe todas as casas"),
  multiplier: z.string().default("110X"),
  unlockTitle: z.string().default("BOOSTER 110X\nDESBLOQUEADO!"),
  unlockDescription: z.string().default("Você encontrou 3 símbolos iguais e liberou o multiplicador de chances para o Jetta GLI 0KM e o Caminhão VW 11.180 + F-250 Kit 200cv."),
  unlockCta: z.string().default("VER MINHA CONDIÇÃO EXCLUSIVA"),
  reserveText: z.string().default("SEU BOOSTER ESTÁ RESERVADO — NÃO FECHE ESSA PÁGINA"),
  offerTitle: z.string().default("VOCÊ DESBLOQUEOU O\nBOOSTER 110X"),
  alertText: z.string().default("JETTA GLI DISPONÍVEL AGORA. R$ 800.000 EM JOGO."),
  heroDescription: z.string().default("110X mais chances de encontrar o Jetta GLI 0KM e se posicionar fortíssimo no Caminhão VW + F-250 — só nessa página."),
  mediaUrl: z.string().default(""),
  mediaButton: z.string().default("ATIVAR SOM"),
  primaryCta: z.string().default("ATIVAR MEU BOOSTER 110X"),
  ctaUrl: z.string().default("#oferta"),
  prizeHeadline: z.string().default("R$ 800.000 EM PRÊMIOS.\nVOCÊ DENTRO DE TUDO."),
  progress: z.number().min(0).max(100).default(17),
  comparisonTitle: z.string().default("QUEM ATACA.\nQUEM TORCE."),
  explanationTitle: z.string().default("ISSO NÃO É SORTE.\nÉ SUPERFÍCIE DE ATAQUE."),
  price: z.string().default("R$ 90"),
  offerHeading: z.string().default("ATIVE AGORA E ENTRE\nNO GRUPO DOS 5%"),
  countdownMinutes: z.number().min(1).max(120).default(3),
  accentColor: z.string().default("#20d42f"),
  highlightColor: z.string().default("#ffd400"),
  dangerColor: z.string().default("#ff4040"),
  customCss: z.string().default(""),
});

export type BoosterFunnelConfig = z.infer<typeof boosterFunnelConfigSchema>;
export const boosterFunnelDefaultConfig = boosterFunnelConfigSchema.parse({});

export const boosterFunnelFields: BlockField[] = [
  { key: "previewStage", label: "Etapa exibida no editor", type: "select", group: "Geral", options: [
    { label: "Raspadinha", value: "scratch" }, { label: "Desbloqueio", value: "unlock" }, { label: "Oferta", value: "offer" },
  ]},

  { key: "brandText", label: "Linha superior", type: "text", group: "Raspadinha" },
  { key: "scratchTitle", label: "Título da raspadinha", type: "textarea", group: "Raspadinha" },
  { key: "scratchSubtitle", label: "Subtítulo da raspadinha", type: "text", group: "Raspadinha" },
  { key: "scratchInstruction", label: "Instrução", type: "text", group: "Raspadinha" },
  { key: "multiplier", label: "Multiplicador", type: "text", group: "Raspadinha" },

  { key: "unlockTitle", label: "Título do desbloqueio", type: "textarea", group: "Desbloqueio (Modal)" },
  { key: "unlockDescription", label: "Descrição do desbloqueio", type: "textarea", group: "Desbloqueio (Modal)" },
  { key: "unlockCta", label: "Botão do desbloqueio", type: "text", group: "Desbloqueio (Modal)" },

  { key: "reserveText", label: "Aviso da barra superior", type: "text", group: "Oferta (Landing)" },
  { key: "offerTitle", label: "Título principal da oferta", type: "textarea", group: "Oferta (Landing)" },
  { key: "alertText", label: "Alerta da oferta", type: "text", group: "Oferta (Landing)" },
  { key: "heroDescription", label: "Descrição principal", type: "textarea", group: "Oferta (Landing)" },
  { key: "mediaUrl", label: "Imagem/vídeo principal (URL)", type: "url", group: "Oferta (Landing)" },
  { key: "mediaButton", label: "Texto sobre a mídia", type: "text", group: "Oferta (Landing)" },
  { key: "primaryCta", label: "Texto dos botões", type: "text", group: "Oferta (Landing)" },
  { key: "ctaUrl", label: "Link do botão de checkout", type: "url", group: "Oferta (Landing)" },
  { key: "prizeHeadline", label: "Título dos prêmios", type: "textarea", group: "Oferta (Landing)" },
  { key: "progress", label: "Progresso da campanha (%)", type: "number", group: "Oferta (Landing)" },
  { key: "comparisonTitle", label: "Título da comparação", type: "textarea", group: "Oferta (Landing)" },
  { key: "explanationTitle", label: "Título da explicação", type: "textarea", group: "Oferta (Landing)" },
  { key: "offerHeading", label: "Título da oferta final", type: "textarea", group: "Oferta (Landing)" },
  { key: "price", label: "Preço", type: "text", group: "Oferta (Landing)" },
  { key: "countdownMinutes", label: "Contador (minutos)", type: "number", group: "Oferta (Landing)" },

  { key: "accentColor", label: "Verde principal", type: "color", group: "Estilo" },
  { key: "highlightColor", label: "Amarelo principal", type: "color", group: "Estilo" },
  { key: "dangerColor", label: "Vermelho de urgência", type: "color", group: "Estilo" },
  { key: "customCss", label: "CSS personalizado", type: "textarea", group: "Estilo" },
];
