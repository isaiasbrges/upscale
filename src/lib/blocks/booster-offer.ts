import { z } from "zod";
import type { BlockField } from "@/types/block";

export const boosterOfferConfigSchema = z.object({
  priceText: z.string().default("R$ 90"),
  includes: z.array(z.string()).default(["Inclui tudo", "Bônus especial"]),
});

export type BoosterOfferConfig = z.infer<typeof boosterOfferConfigSchema>;

export const boosterOfferDefaultConfig: BoosterOfferConfig = {
  priceText: "R$ 90",
  includes: ["Inclui tudo", "Bônus especial"],
};

export const boosterOfferFields: BlockField[] = [
  { key: "priceText", label: "Preço", type: "text" },
];
