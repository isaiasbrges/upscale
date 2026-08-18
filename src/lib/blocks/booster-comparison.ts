import { z } from "zod";
import type { BlockField } from "@/types/block";

export const boosterComparisonConfigSchema = z.object({
  title: z.string().default("Compare as chances"),
  normalText: z.string().default("1X"),
  boosterText: z.string().default("190X"),
});

export type BoosterComparisonConfig = z.infer<typeof boosterComparisonConfigSchema>;

export const boosterComparisonDefaultConfig: BoosterComparisonConfig = {
  title: "Compare as chances",
  normalText: "1X",
  boosterText: "190X",
};

export const boosterComparisonFields: BlockField[] = [
  { key: "title", label: "Título", type: "text" },
  { key: "normalText", label: "Texto Normal", type: "text" },
  { key: "boosterText", label: "Texto Booster", type: "text" },
];
