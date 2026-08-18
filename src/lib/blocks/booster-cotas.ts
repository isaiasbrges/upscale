import { z } from "zod";
import type { BlockField } from "@/types/block";

export const boosterCotasConfigSchema = z.object({
  title: z.string().default("O que está em jogo"),
  items: z.array(z.string()).default(["Motos", "PIX"]),
});

export type BoosterCotasConfig = z.infer<typeof boosterCotasConfigSchema>;

export const boosterCotasDefaultConfig: BoosterCotasConfig = {
  title: "O que está em jogo",
  items: ["Motos 0KM", "PIX R$ 10.000"],
};

export const boosterCotasFields: BlockField[] = [
  { key: "title", label: "Título", type: "text" },
  // Simple representation, in reality might need list field type
];
