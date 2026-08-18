import { Scratch90x, type Scratch90xConfig } from "./component";
import type { BlockDefinition } from "@/types/block";

export const scratch90xBlock: BlockDefinition<Scratch90xConfig> = {
  type: "scratch-90x",
  name: "Raspadinha 90X",
  category: "Gamificação",
  version: 1,
  description: "Estrutura inicial do bloco de raspadinha. A mecânica real entra na próxima etapa.",
  component: Scratch90x,
  defaultConfig: {
    title: "Raspe e descubra",
    subtitle: "Revele todos os campos para desbloquear seu resultado.",
    buttonText: "ATIVAR AGORA",
    sound: true,
    confetti: true,
    accentColor: "#F5C518"
  },
  fields: [
    { key: "title", label: "Título", type: "text" },
    { key: "subtitle", label: "Subtítulo", type: "textarea" },
    { key: "buttonText", label: "Texto do botão", type: "text" },
    { key: "sound", label: "Som", type: "toggle" },
    { key: "confetti", label: "Confete", type: "toggle" },
    { key: "accentColor", label: "Cor de destaque", type: "color" }
  ]
};
