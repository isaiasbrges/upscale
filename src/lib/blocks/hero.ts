import { z } from "zod";
import type { BlockField } from "@/types/block";

export const heroConfigSchema = z.object({
  topBadge: z.string().optional().default(""),
  title: z.string().min(1, "Título é obrigatório"),
  highlightText: z.string().optional().default(""),
  alertBadge: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  videoUrl: z.string().optional().default(""),
  backgroundImage: z.string().optional().default(""),
  backgroundColor: z.string().default("#09090b"),
  textColor: z.string().default("#ffffff"),
  ctaText: z.string().optional().default(""),
  ctaUrl: z.string().optional().default(""),
});

export type HeroConfig = z.infer<typeof heroConfigSchema>;

export const heroDefaultConfig: HeroConfig = {
  topBadge: "BOOSTER DESBLOQUEADO PARA VOCÊ",
  title: "VOCÊ DESBLOQUEOU O BOOSTER 110X",
  highlightText: "BOOSTER 110X",
  alertBadge: "JETTA GLI DISPONÍVEL AGORA. R$ 800.000 EM JOGO.",
  subtitle: "110X mais chances de encontrar o Jetta GLI 0KM e se posicionar fortíssimo no Caminhão VW + F-250 — só nessa página",
  videoUrl: "",
  backgroundImage: "",
  backgroundColor: "#09090b",
  textColor: "#ffffff",
  ctaText: "ATIVAR MEU BOOSTER 110X",
  ctaUrl: "#",
};

export const heroFields: BlockField[] = [
  { key: "topBadge", label: "Badge Superior (Verde)", type: "text" },
  { key: "title", label: "Título Principal", type: "text" },
  { key: "highlightText", label: "Texto em Destaque (Amarelo)", type: "text" },
  { key: "alertBadge", label: "Alerta Central (Vermelho)", type: "text" },
  { key: "subtitle", label: "Subtítulo", type: "textarea" },
  { key: "videoUrl", label: "URL do Vídeo (Opcional)", type: "url" },
  { key: "ctaText", label: "Texto do Botão", type: "text" },
  { key: "ctaUrl", label: "URL do Botão", type: "url" },
  { key: "backgroundColor", label: "Cor de Fundo", type: "color" },
  { key: "textColor", label: "Cor do Texto", type: "color" },
  { key: "backgroundImage", label: "Imagem de Fundo (URL)", type: "url" },
];
