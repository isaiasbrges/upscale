import { z } from "zod";
import type { BlockField } from "@/types/block";

export const ctaConfigSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional().default(""),
  buttonText: z.string().min(1, "Texto do botão é obrigatório"),
  buttonUrl: z.string().optional().default("#"),
  backgroundColor: z.string().default("#7c3aed"),
  textColor: z.string().default("#ffffff"),
  buttonColor: z.string().default("#facc15"),
  urgencyText: z.string().optional().default(""),
});

export type CtaConfig = z.infer<typeof ctaConfigSchema>;

export const ctaDefaultConfig: CtaConfig = {
  title: "Não perca essa oportunidade!",
  subtitle: "Vagas limitadas — garanta a sua agora",
  buttonText: "QUERO PARTICIPAR",
  buttonUrl: "#",
  backgroundColor: "#7c3aed",
  textColor: "#ffffff",
  buttonColor: "#facc15",
  urgencyText: "🔥 Restam poucas vagas",
};

export const ctaFields: BlockField[] = [
  { key: "title", label: "Título", type: "text" },
  { key: "subtitle", label: "Subtítulo", type: "text" },
  { key: "buttonText", label: "Texto do botão", type: "text" },
  { key: "buttonUrl", label: "URL do botão", type: "url" },
  { key: "backgroundColor", label: "Cor de fundo", type: "color" },
  { key: "textColor", label: "Cor do texto", type: "color" },
  { key: "buttonColor", label: "Cor do botão", type: "color" },
  { key: "urgencyText", label: "Texto de urgência", type: "text" },
];
