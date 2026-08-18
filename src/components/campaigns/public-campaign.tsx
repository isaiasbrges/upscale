import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import type { BlockType } from "@/lib/blocks/registry";
import { prisma } from "@/lib/prisma";
export async function PublicCampaign({ campaignId }: { campaignId: string }) {
  const campaign = await prisma.campaign.findFirst({ where: { id: campaignId, status: "PUBLISHED" }, include: { pages: { take: 1, orderBy: { createdAt: "asc" }, include: { blocks: { where: { enabled: true }, orderBy: { position: "asc" } } } } } });
  if (!campaign) notFound();
  return <main className="min-h-dvh bg-black">{(campaign.pages[0]?.blocks ?? []).map(block=><BlockRenderer key={block.id} type={block.type as BlockType} config={block.config as Record<string, unknown>} />)}</main>;
}
