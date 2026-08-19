import { prisma } from "@/lib/prisma";

/**
 * Resolve a URL pública da próxima etapa publicada de um funil, dada a
 * etapa atual. Usada para que o "Continuar" de uma raspadinha (ou o botão
 * de um bloco) leve automaticamente para o próximo passo do funil, sem
 * precisar hardcodar a URL de destino.
 */
export async function getNextFunnelStepPath(step: { funnelId: string; order: number }) {
  const next = await prisma.funnelStep.findFirst({
    where: { funnelId: step.funnelId, order: { gt: step.order }, status: "PUBLISHED" },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  return next ? `/f/${next.id}` : null;
}
