import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getNextFunnelStepPath } from "@/lib/funnel-public";
import { personalizeConfig } from "@/lib/personalization";
import { PublicScratchPlay } from "@/components/blocks/scratch/public-scratch-play";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import type { BlockType } from "@/lib/blocks/registry";

/**
 * Resolve uma etapa de funil para o seu destino público real.
 *
 * Esse é o endereço que os botões/CTAs das páginas apontam quando o
 * usuário escolhe "etapa do funil" em vez de digitar uma URL — assim,
 * reordenar ou trocar o conteúdo de uma etapa no funil não exige editar
 * link nenhum manualmente.
 */
export default async function FunnelStepPage({
  params,
  searchParams,
}: {
  params: Promise<{ stepId: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { stepId } = await params;
  const { ref } = await searchParams;

  const step = await prisma.funnelStep.findUnique({
    where: { id: stepId },
    include: {
      page: {
        include: {
          campaign: { select: { status: true, clientId: true } },
          blocks: { where: { enabled: true }, orderBy: { position: "asc" } },
        },
      },
      scratchCard: { select: { id: true, status: true, settings: true } },
    },
  });

  if (!step || step.status !== "PUBLISHED") notFound();

  const nextStepPath = await getNextFunnelStepPath(step);

  if (step.type === "PAGE") {
    const page = step.page;
    if (!page || page.campaign.status !== "PUBLISHED") notFound();

    // Se a URL trouxer ?ref=<id-do-pedido>, busca o nome do comprador salvo
    // pelo webhook de compra (ver /api/webhooks/purchase/[clientId]) e
    // personaliza {{nome}} nos blocos — usado no upsell pós-checkout.
    let buyerName: string | null = null;
    if (ref) {
      const purchase = await prisma.purchaseEvent.findUnique({
        where: { clientId_referenceId: { clientId: page.campaign.clientId, referenceId: ref } },
        select: { buyerName: true },
      });
      buyerName = purchase?.buyerName ?? null;
    }

    return (
      <main className="min-h-dvh bg-black">
        {page.blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            type={block.type as BlockType}
            config={personalizeConfig(block.config as Record<string, unknown>, buyerName)}
          />
        ))}
      </main>
    );
  }

  if (step.type === "SCRATCH_CARD") {
    if (!step.scratchCard || step.scratchCard.status !== "PUBLISHED") notFound();
    const settings = (step.scratchCard.settings as Record<string, string> | null) ?? {};
    return <PublicScratchPlay scratchCardId={step.scratchCard.id} settings={settings} nextStepPath={nextStepPath} />;
  }

  if (step.type === "REDIRECT" || step.type === "EXTERNAL_URL") {
    const url = step.config && typeof step.config === "object" && "url" in step.config ? String((step.config as any).url) : null;
    if (!url) notFound();
    redirect(url);
  }

  if (step.type === "THANK_YOU") {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-black text-center px-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{step.name}</h1>
          <p className="text-white/60">Obrigado! Sua participação foi registrada.</p>
        </div>
      </main>
    );
  }

  notFound();
}
