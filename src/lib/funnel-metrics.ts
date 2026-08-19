import { prisma } from "@/lib/prisma";

export type StepMetrics = {
  visitors: number | null;
  conversions: number | null;
  advanceRate: number | null; // taxa de avanço (conversões / visitantes)
  abandonment: number | null; // 100 - taxa de avanço
};

const EMPTY_METRICS: StepMetrics = {
  visitors: null,
  conversions: null,
  advanceRate: null,
  abandonment: null,
};

/**
 * Calcula métricas reais para uma etapa do funil.
 *
 * Hoje só existe uma fonte real de eventos para etapas do tipo "Raspadinha"
 * (o modelo ScratchPlay). Para os demais tipos de etapa não existe nenhum
 * rastreamento de visualização/clique implementado na aplicação ainda —
 * por isso retornamos métricas nulas (renderizadas como "Sem dados") em vez
 * de inventar números.
 */
export async function getFunnelStepMetrics(step: { type: string; scratchCardId: string | null }): Promise<StepMetrics> {
  if (step.type !== "SCRATCH_CARD" || !step.scratchCardId) {
    return EMPTY_METRICS;
  }

  const plays = await prisma.scratchPlay.findMany({
    where: { scratchCardId: step.scratchCardId },
    select: { visitorId: true, resultType: true },
  });

  const visitors = new Set(plays.map((p) => p.visitorId)).size;
  const conversions = plays.filter((p) => p.resultType === "WIN").length;
  const advanceRate = visitors > 0 ? (conversions / visitors) * 100 : null;

  return {
    visitors,
    conversions,
    advanceRate,
    abandonment: advanceRate !== null ? 100 - advanceRate : null,
  };
}

export async function getFunnelStepsWithMetrics<T extends { type: string; scratchCardId: string | null }>(
  steps: T[],
): Promise<(T & { metrics: StepMetrics })[]> {
  return Promise.all(
    steps.map(async (step) => ({ ...step, metrics: await getFunnelStepMetrics(step) })),
  );
}
