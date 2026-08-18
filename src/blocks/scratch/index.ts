import type { BlockDefinition } from "@/types/block";
import { ScratchRenderer } from "@/components/blocks/scratch/scratch-renderer";

export type ScratchBlockConfig = {
  // Aba Conteudo
  eyebrow: string;
  title: string;
  subtitle: string;
  instruction: string;
  winText: string;
  loseText: string;

  // Aba Visual
  scratchBackground: string;
  externalBackground: string;
  borderColor: string;
  borderRadius: number;
  maxWidth: number;

  // Aba Grade
  gridSize: "2x2" | "3x3" | "4x4";
  gridGap: number;

  // Aba Celula
  maskColor: string;
  maskTexture: string; // url
  centerIcon: string; // url
  maskOpacity: number;

  previewMode?: boolean;
};

export const scratchBlock: BlockDefinition<ScratchBlockConfig> = {
  type: "scratch",
  name: "Raspadinha (Scratch)",
  category: "Engajamento",
  version: 1,
  description: "Um bloco interativo de raspadinha para revelar prêmios.",
  defaultConfig: {
    eyebrow: "TENTE A SORTE",
    title: "Raspadinha Premiada",
    subtitle: "Raspe e descubra se você ganhou",
    instruction: "Raspe as células abaixo. Encontre 3 iguais para ganhar!",
    winText: "Você ganhou!",
    loseText: "Não foi dessa vez.",
    scratchBackground: "#ffffff",
    externalBackground: "#f3f4f6",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    maxWidth: 600,
    gridSize: "3x3",
    gridGap: 8,
    maskColor: "#9ca3af",
    maskTexture: "",
    centerIcon: "",
    maskOpacity: 1,
    previewMode: true,
  },
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "title", label: "Título", type: "text" },
    { key: "subtitle", label: "Subtítulo", type: "textarea" },
    { key: "instruction", label: "Instrução", type: "textarea" },
    { key: "winText", label: "Texto de Vitória", type: "text" },
    { key: "loseText", label: "Texto de Derrota", type: "text" },
    { key: "scratchBackground", label: "Cor de Fundo (Interno)", type: "color" },
    { key: "externalBackground", label: "Cor de Fundo (Externo)", type: "color" },
    { key: "borderColor", label: "Cor da Borda", type: "color" },
    { key: "borderRadius", label: "Arredondamento (px)", type: "number" },
    { key: "maxWidth", label: "Largura Máxima (px)", type: "number" },
    {
      key: "gridSize",
      label: "Tamanho da Grade",
      type: "select",
      options: [
        { label: "2x2", value: "2x2" },
        { label: "3x3", value: "3x3" },
        { label: "4x4", value: "4x4" },
      ],
    },
    { key: "gridGap", label: "Espaçamento da Grade (px)", type: "number" },
    { key: "maskColor", label: "Cor da Máscara", type: "color" },
    { key: "maskTexture", label: "Textura da Máscara (URL)", type: "url" },
    { key: "centerIcon", label: "Ícone Central (URL)", type: "url" },
    { key: "maskOpacity", label: "Opacidade da Máscara (0-1)", type: "number" },
    { key: "previewMode", label: "Modo de Pré-visualização", type: "toggle" },
  ],
  component: ScratchRenderer,
};
