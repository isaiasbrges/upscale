import type { z } from "zod";
import type { BlockField } from "@/types/block";
import { heroConfigSchema, heroDefaultConfig, heroFields } from "./hero";
import { videoConfigSchema, videoDefaultConfig, videoFields } from "./video";
import { offerConfigSchema, offerDefaultConfig, offerFields } from "./offer";
import { ctaConfigSchema, ctaDefaultConfig, ctaFields } from "./cta";
import { faqConfigSchema, faqDefaultConfig, faqFields } from "./faq";
import { prizesConfigSchema, prizesDefaultConfig, prizesFields } from "./prizes";
import {
  countdownConfigSchema,
  countdownDefaultConfig,
  countdownFields,
} from "./countdown";
import {
  scratchConfigSchema,
  scratchDefaultConfig,
  scratchFields,
} from "./scratch";
import { boosterHeroConfigSchema, boosterHeroDefaultConfig, boosterHeroFields } from "./booster-hero";
import { boosterCotasConfigSchema, boosterCotasDefaultConfig, boosterCotasFields } from "./booster-cotas";
import { boosterComparisonConfigSchema, boosterComparisonDefaultConfig, boosterComparisonFields } from "./booster-comparison";
import { boosterOfferConfigSchema, boosterOfferDefaultConfig, boosterOfferFields } from "./booster-offer";
import { boosterFunnelConfigSchema, boosterFunnelDefaultConfig, boosterFunnelFields } from "./booster-funnel";

export type BlockType =
  | "hero"
  | "video"
  | "offer"
  | "cta"
  | "faq"
  | "prizes"
  | "countdown"
  | "scratch"
  | "boosterHero"
  | "boosterCotas"
  | "boosterComparison"
  | "boosterOffer"
  | "boosterFunnel";

export type BlockRegistryEntry = {
  label: string;
  description: string;
  icon: string;
  defaultConfig: Record<string, unknown>;
  configSchema: z.ZodSchema;
  fields: BlockField[];
};

export const blockRegistry: Record<BlockType, BlockRegistryEntry> = {
  hero: {
    label: "Hero",
    description: "Seção principal com título, subtítulo e CTA",
    icon: "◆",
    defaultConfig: heroDefaultConfig as unknown as Record<string, unknown>,
    configSchema: heroConfigSchema,
    fields: heroFields,
  },
  video: {
    label: "Vídeo",
    description: "Player de vídeo embarcado",
    icon: "▶",
    defaultConfig: videoDefaultConfig as unknown as Record<string, unknown>,
    configSchema: videoConfigSchema,
    fields: videoFields,
  },
  offer: {
    label: "Oferta",
    description: "Card de oferta com preço e benefícios",
    icon: "◈",
    defaultConfig: offerDefaultConfig as unknown as Record<string, unknown>,
    configSchema: offerConfigSchema,
    fields: offerFields,
  },
  cta: {
    label: "CTA",
    description: "Chamada para ação em destaque",
    icon: "◉",
    defaultConfig: ctaDefaultConfig as unknown as Record<string, unknown>,
    configSchema: ctaConfigSchema,
    fields: ctaFields,
  },
  faq: {
    label: "FAQ",
    description: "Perguntas e respostas em accordion",
    icon: "◇",
    defaultConfig: faqDefaultConfig as unknown as Record<string, unknown>,
    configSchema: faqConfigSchema,
    fields: faqFields,
  },
  prizes: {
    label: "Prêmios",
    description: "Grid de prêmios da campanha",
    icon: "★",
    defaultConfig: prizesDefaultConfig as unknown as Record<string, unknown>,
    configSchema: prizesConfigSchema,
    fields: prizesFields,
  },
  countdown: {
    label: "Contador",
    description: "Contador regressivo até uma data",
    icon: "◷",
    defaultConfig: countdownDefaultConfig as unknown as Record<string, unknown>,
    configSchema: countdownConfigSchema,
    fields: countdownFields,
  },
  scratch: {
    label: "Raspadinha",
    description: "Um bloco interativo de raspadinha para revelar prêmios.",
    icon: "🎟️",
    defaultConfig: scratchDefaultConfig as unknown as Record<string, unknown>,
    configSchema: scratchConfigSchema,
    fields: scratchFields,
  },
  boosterHero: {
    label: "Booster Hero",
    description: "Hero para Booster 190X com título e vídeo.",
    icon: "🚀",
    defaultConfig: boosterHeroDefaultConfig as unknown as Record<string, unknown>,
    configSchema: boosterHeroConfigSchema,
    fields: boosterHeroFields,
  },
  boosterCotas: {
    label: "Booster Cotas",
    description: "Lista de prêmios do Booster.",
    icon: "📋",
    defaultConfig: boosterCotasDefaultConfig as unknown as Record<string, unknown>,
    configSchema: boosterCotasConfigSchema,
    fields: boosterCotasFields,
  },
  boosterComparison: {
    label: "Booster Comparação",
    description: "Comparação de chances 1X vs 190X.",
    icon: "⚖️",
    defaultConfig: boosterComparisonDefaultConfig as unknown as Record<string, unknown>,
    configSchema: boosterComparisonConfigSchema,
    fields: boosterComparisonFields,
  },
  boosterOffer: {
    label: "Booster Oferta",
    description: "Oferta de desbloqueio do Booster.",
    icon: "💎",
    defaultConfig: boosterOfferDefaultConfig as unknown as Record<string, unknown>,
    configSchema: boosterOfferConfigSchema,
    fields: boosterOfferFields,
  },
  boosterFunnel: {
    label: "Funil Booster 110X",
    description: "Raspadinha, desbloqueio e oferta completa em um único fluxo.",
    icon: "⚡",
    defaultConfig: boosterFunnelDefaultConfig as unknown as Record<string, unknown>,
    configSchema: boosterFunnelConfigSchema,
    fields: boosterFunnelFields,
  },
};

export function getDefaultConfig(type: BlockType): Record<string, unknown> {
  return blockRegistry[type].defaultConfig;
}

export function getConfigSchema(type: BlockType): z.ZodSchema {
  return blockRegistry[type].configSchema;
}
