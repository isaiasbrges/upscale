import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { BlockType } from "@/lib/blocks/registry";
import type { HeroConfig } from "@/lib/blocks/hero";
import type { VideoConfig } from "@/lib/blocks/video";
import type { OfferConfig } from "@/lib/blocks/offer";
import type { CtaConfig } from "@/lib/blocks/cta";
import type { FaqConfig } from "@/lib/blocks/faq";
import type { PrizesConfig } from "@/lib/blocks/prizes";
import type { CountdownConfig } from "@/lib/blocks/countdown";
import type { BoosterHeroConfig } from "@/lib/blocks/booster-hero";
import type { BoosterCotasConfig } from "@/lib/blocks/booster-cotas";
import type { BoosterComparisonConfig } from "@/lib/blocks/booster-comparison";
import type { BoosterOfferConfig } from "@/lib/blocks/booster-offer";
import type { BoosterFunnelConfig } from "@/lib/blocks/booster-funnel";

const HeroBlock = dynamic(() => import("./hero-block").then((mod) => mod.HeroBlock));
const VideoBlock = dynamic(() => import("./video-block").then((mod) => mod.VideoBlock));
const OfferBlock = dynamic(() => import("./offer-block").then((mod) => mod.OfferBlock));
const CtaBlock = dynamic(() => import("./cta-block").then((mod) => mod.CtaBlock));
const FaqBlock = dynamic(() => import("./faq-block").then((mod) => mod.FaqBlock));
const PrizesBlock = dynamic(() => import("./prizes-block").then((mod) => mod.PrizesBlock));
const CountdownBlock = dynamic(() => import("./countdown-block").then((mod) => mod.CountdownBlock));
const ScratchRenderer = dynamic(() => import("./scratch/scratch-renderer").then((mod) => mod.ScratchRenderer));
const BoosterHeroBlock = dynamic(() => import("./booster-hero-block").then((mod) => mod.BoosterHeroBlock));
const BoosterCotasBlock = dynamic(() => import("./booster-cotas-block").then((mod) => mod.BoosterCotasBlock));
const BoosterComparisonBlock = dynamic(() => import("./booster-comparison-block").then((mod) => mod.BoosterComparisonBlock));
const BoosterOfferBlock = dynamic(() => import("./booster-offer-block").then((mod) => mod.BoosterOfferBlock));
const BoosterFunnelBlock = dynamic(() => import("./booster-funnel-block").then((mod) => mod.BoosterFunnelBlock));

type BlockRendererProps = {
  type: BlockType;
  config: Record<string, unknown>;
  preview?: boolean;
};

export function BlockRenderer({ type, config, preview = false }: BlockRendererProps) {
  switch (type) {
    case "hero":
      return <HeroBlock config={config as unknown as HeroConfig} preview={preview} />;
    case "video":
      return <VideoBlock config={config as unknown as VideoConfig} preview={preview} />;
    case "offer":
      return <OfferBlock config={config as unknown as OfferConfig} preview={preview} />;
    case "cta":
      return <CtaBlock config={config as unknown as CtaConfig} preview={preview} />;
    case "faq":
      return <FaqBlock config={config as unknown as FaqConfig} preview={preview} />;
    case "prizes":
      return <PrizesBlock config={config as unknown as PrizesConfig} preview={preview} />;
    case "countdown":
      return <CountdownBlock config={config as unknown as CountdownConfig} preview={preview} />;
    case "scratch":
      return <ScratchRenderer {...(config as unknown as ComponentProps<typeof ScratchRenderer>)} />;
    case "boosterHero":
      return <BoosterHeroBlock config={config as unknown as BoosterHeroConfig} />;
    case "boosterCotas":
      return <BoosterCotasBlock config={config as unknown as BoosterCotasConfig} />;
    case "boosterComparison":
      return <BoosterComparisonBlock config={config as unknown as BoosterComparisonConfig} />;
    case "boosterOffer":
      return <BoosterOfferBlock config={config as unknown as BoosterOfferConfig} />;
    case "boosterFunnel":
      return <BoosterFunnelBlock config={config as unknown as BoosterFunnelConfig} preview={preview} />;
    default:
      return null;
  }
}
