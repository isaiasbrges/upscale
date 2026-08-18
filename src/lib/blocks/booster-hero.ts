import { z } from "zod";
import type { BlockField } from "@/types/block";

export const boosterHeroConfigSchema = z.object({
  topBadge: z.string().default("Seu Booster foi liberado"),
  title: z.string().default("ENTRE 190X MAIS FORTE"),
  videoUrl: z.string().optional().default(""),
});

export type BoosterHeroConfig = z.infer<typeof boosterHeroConfigSchema>;

export const boosterHeroDefaultConfig: BoosterHeroConfig = {
  topBadge: "Seu Booster foi liberado",
  title: "ENTRE 190X MAIS FORTE",
  videoUrl: "",
};

export const boosterHeroFields: BlockField[] = [
  { key: "topBadge", label: "Badge Superior", type: "text" },
  { key: "title", label: "Título Principal", type: "text" },
  { key: "videoUrl", label: "URL do Vídeo", type: "url" },
];
