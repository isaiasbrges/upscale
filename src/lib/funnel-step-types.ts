// Tipos e rótulos das etapas de um funil.
//
// Este arquivo NÃO tem "use server" de propósito: ele é importado tanto por
// Server Actions (src/actions/funnel-steps.ts) quanto por Client Components
// (src/components/funnels/*). Um arquivo "use server" só pode exportar
// funções async — exportar essas constantes dali quebra o build ("A 'use
// server' file can only export async functions, found object").

export const FUNNEL_STEP_TYPES = [
  "LANDING_PAGE",
  "PAGE",
  "SCRATCH_CARD",
  "FORM",
  "CHECKOUT",
  "THANK_YOU",
  "REDIRECT",
  "EXTERNAL_URL",
] as const;

export type FunnelStepType = (typeof FUNNEL_STEP_TYPES)[number];

export const FUNNEL_STEP_TYPE_LABELS: Record<FunnelStepType, string> = {
  LANDING_PAGE: "Landing Page",
  PAGE: "Página",
  SCRATCH_CARD: "Raspadinha",
  FORM: "Formulário",
  CHECKOUT: "Checkout",
  THANK_YOU: "Página de obrigado",
  REDIRECT: "Redirecionamento",
  EXTERNAL_URL: "URL externa",
};

/** Tipos de etapa com destino público resolvível por /f/[stepId] (ver src/app/f/[stepId]/page.tsx). */
const RESOLVABLE_FUNNEL_STEP_TYPES = new Set<FunnelStepType>(["PAGE", "SCRATCH_CARD", "REDIRECT", "EXTERNAL_URL", "THANK_YOU"]);

export function isFunnelStepPubliclyResolvable(step: { type: string; pageId: string | null; scratchCardId: string | null }) {
  const type = step.type as FunnelStepType;
  if (!RESOLVABLE_FUNNEL_STEP_TYPES.has(type)) return false;
  if (type === "PAGE") return Boolean(step.pageId);
  if (type === "SCRATCH_CARD") return Boolean(step.scratchCardId);
  return true;
}
