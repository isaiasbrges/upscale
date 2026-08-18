import { HeroPremium, type HeroPremiumConfig } from "./component";
import type { BlockDefinition } from "@/types/block";

export const heroPremiumBlock: BlockDefinition<HeroPremiumConfig> = {
  type: "hero-premium",
  name: "Hero Premium",
  category: "Hero",
  version: 1,
  description: "Hero escuro premium com destaque, background e CTA.",
  component: HeroPremium,
  defaultConfig: {
    eyebrow: "EXCLUSIVO PARA VOCÊ",
    title: "Você desbloqueou uma",
    highlight: "nova oportunidade",
    subtitle: "Personalize este texto sem alterar a estrutura visual do bloco.",
    buttonText: "QUERO COMEÇAR",
    buttonUrl: "#",
    backgroundUrl: "",
    accentColor: "#F5C518"
  },
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Título", type: "text" },
    { key: "highlight", label: "Destaque", type: "text" },
    { key: "subtitle", label: "Subtítulo", type: "textarea" },
    { key: "buttonText", label: "Texto do botão", type: "text" },
    { key: "buttonUrl", label: "Link do botão", type: "url" },
    { key: "backgroundUrl", label: "Imagem de fundo", type: "image" },
    { key: "accentColor", label: "Cor de destaque", type: "color" }
  ]
};
