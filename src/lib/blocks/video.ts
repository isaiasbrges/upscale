import { z } from "zod";
import type { BlockField } from "@/types/block";

export const videoConfigSchema = z.object({
  videoUrl: z.string().min(1, "URL do vídeo é obrigatória"),
  title: z.string().optional().default(""),
  aspectRatio: z.enum(["16:9", "4:3", "1:1"]).default("16:9"),
  autoplay: z.boolean().default(false),
});

export type VideoConfig = z.infer<typeof videoConfigSchema>;

export const videoDefaultConfig: VideoConfig = {
  videoUrl: "",
  title: "",
  aspectRatio: "16:9",
  autoplay: false,
};

export const videoFields: BlockField[] = [
  { key: "videoUrl", label: "URL do vídeo (YouTube, Vimeo ou direto)", type: "url" },
  { key: "title", label: "Título (opcional)", type: "text" },
  {
    key: "aspectRatio",
    label: "Proporção",
    type: "select",
    options: [
      { label: "16:9", value: "16:9" },
      { label: "4:3", value: "4:3" },
      { label: "1:1", value: "1:1" },
    ],
  },
  { key: "autoplay", label: "Autoplay", type: "toggle" },
];
