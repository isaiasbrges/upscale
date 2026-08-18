import { z } from "zod";
import type { BlockField } from "@/types/block";

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const faqConfigSchema = z.object({
  title: z.string().optional().default("Perguntas Frequentes"),
  items: z.array(faqItemSchema).min(1, "Adicione pelo menos uma pergunta"),
});

export type FaqConfig = z.infer<typeof faqConfigSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;

export const faqDefaultConfig: FaqConfig = {
  title: "Perguntas Frequentes",
  items: [
    { question: "Como funciona?", answer: "É simples! Basta seguir as instruções na tela." },
    { question: "É seguro?", answer: "Sim, utilizamos as melhores práticas de segurança." },
    { question: "Posso cancelar?", answer: "Sim, você pode cancelar a qualquer momento." },
  ],
};

export const faqFields: BlockField[] = [
  { key: "title", label: "Título da seção", type: "text" },
];
