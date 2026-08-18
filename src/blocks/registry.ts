import type { BlockDefinition } from "@/types/block";
import { heroPremiumBlock } from "./hero-premium";
import { scratch90xBlock } from "./scratch-90x";
import { scratchBlock } from "./scratch";

export const blockRegistry: Record<string, BlockDefinition<any>> = {
  [heroPremiumBlock.type]: heroPremiumBlock,
  [scratch90xBlock.type]: scratch90xBlock,
  [scratchBlock.type]: scratchBlock,
};

export const blockLibrary = Object.values(blockRegistry);

export function getBlockDefinition(type: string) {
  return blockRegistry[type];
}
