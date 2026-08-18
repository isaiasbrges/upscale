import { z } from "zod";
import type { BlockField } from "@/types/block";

export const offerConfigSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional().default(""),
  originalPrice: z.string().optional().default(""),
  currentPrice: z.string().min(1, "Preço é obrigatório"),
  discountBadge: z.string().optional().default(""),
  benefits: z.string().optional().default(""),
  ctaText: z.string().optional().default("Comprar agora"),
  ctaUrl: z.string().optional().default(""),
  accentColor: z.string().default("#8b5cf6"),
});

export type OfferConfig = z.infer<typeof offerConfigSchema>;

export const offerDefaultConfig: OfferConfig = {
  title: "Oferta Especial",
  description: "Aproveite esta oportunidade única",
  originalPrice: "R$ 197,00",
  currentPrice: "R$ 97,00",
  discountBadge: "50% OFF",
  benefits: "Acesso vitalício\nSuporte prioritário\nAtualizações gratuitas",
  ctaText: "Comprar agora",
  ctaUrl: "#",
  accentColor: "#8b5cf6",
};

export const offerFields: BlockField[] = [
  { key: "title", label: "Título", type: "text" },
  { key: "description", label: "Descrição", type: "textarea" },
  { key: "originalPrice", label: "Preço original (riscado)", type: "text" },
  { key: "currentPrice", label: "Preço atual", type: "text" },
  { key: "discountBadge", label: "Badge de desconto", type: "text" },
  { key: "benefits", label: "Benefícios (um por linha)", type: "textarea" },
  { key: "ctaText", label: "Texto do botão", type: "text" },
  { key: "ctaUrl", label: "URL do botão", type: "url" },
  { key: "accentColor", label: "Cor de destaque", type: "color" },
];
