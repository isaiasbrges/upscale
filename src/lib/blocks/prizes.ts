import { z } from "zod";
import type { BlockField } from "@/types/block";

const prizeItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
});

export const prizesConfigSchema = z.object({
  title: z.string().optional().default("Prêmios"),
  subtitle: z.string().optional().default(""),
  items: z.array(prizeItemSchema).min(1, "Adicione pelo menos um prêmio"),
  columns: z.number().min(1).max(4).default(3),
});

export type PrizesConfig = z.infer<typeof prizesConfigSchema>;
export type PrizeItem = z.infer<typeof prizeItemSchema>;

export const prizesDefaultConfig: PrizesConfig = {
  title: "Prêmios",
  subtitle: "Confira o que você pode ganhar",
  items: [
    { title: "1º Prêmio", description: "Prêmio principal da campanha", imageUrl: "" },
    { title: "2º Prêmio", description: "Segundo prêmio", imageUrl: "" },
    { title: "3º Prêmio", description: "Terceiro prêmio", imageUrl: "" },
  ],
  columns: 3,
};

export const prizesFields: BlockField[] = [
  { key: "title", label: "Título da seção", type: "text" },
  { key: "subtitle", label: "Subtítulo", type: "text" },
  {
    key: "columns",
    label: "Colunas",
    type: "select",
    options: [
      { label: "1 coluna", value: "1" },
      { label: "2 colunas", value: "2" },
      { label: "3 colunas", value: "3" },
      { label: "4 colunas", value: "4" },
    ],
  },
];
