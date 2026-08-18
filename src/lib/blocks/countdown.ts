import { z } from "zod";
import type { BlockField } from "@/types/block";

export const countdownConfigSchema = z.object({
  message: z.string().min(1, "Mensagem é obrigatória"),
  durationMinutes: z.number().min(1).default(5),
  backgroundColor: z.string().default("#080808"),
  textColor: z.string().default("#ffffff"),
  timerColor: z.string().default("#E53935"),
});

export type CountdownConfig = z.infer<typeof countdownConfigSchema>;

export const countdownDefaultConfig: CountdownConfig = {
  message: "⚠️ SEU BOOSTER ESTÁ RESERVADO — NÃO FECHE ESSA PÁGINA",
  durationMinutes: 5,
  backgroundColor: "#080808",
  textColor: "#ffffff",
  timerColor: "#E53935",
};

export const countdownFields: BlockField[] = [
  { key: "message", label: "Mensagem (com emojis se desejar)", type: "text" },
  { key: "durationMinutes", label: "Duração em Minutos", type: "number" },
  { key: "backgroundColor", label: "Cor de fundo da barra", type: "color" },
  { key: "textColor", label: "Cor do texto", type: "color" },
  { key: "timerColor", label: "Cor do cronômetro", type: "color" },
];
