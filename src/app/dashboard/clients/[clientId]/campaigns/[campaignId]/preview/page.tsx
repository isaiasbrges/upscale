import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrCreateMainPage } from "@/actions/campaigns";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import type { BlockType } from "@/lib/blocks/registry";
import { prisma } from "@/lib/prisma";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ clientId: string; campaignId: string }>;
}) {
  const { clientId, campaignId } = await params;
  const user = await requireUser();

  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      clientId,
      client: { members: { some: { userId: user.id } } },
    },
  });

  if (!campaign) notFound();

  const page = await getOrCreateMainPage(campaignId);
  const enabledBlocks = page.blocks.filter((b) => b.enabled);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/clients/${clientId}/campaigns/${campaignId}/builder`}
          >
            <Button variant="ghost" size="sm">← Builder</Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">Preview</h2>
            <p className="text-zinc-400">{campaign.name}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-white">
        {enabledBlocks.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center bg-zinc-100">
            <p className="text-zinc-500">
              Nenhum bloco habilitado. Adicione blocos no builder.
            </p>
          </div>
        ) : (
          enabledBlocks.map((block) => (
            <BlockRenderer
              key={block.id}
              type={block.type as BlockType}
              config={block.config as Record<string, unknown>}
              preview
            />
          ))
        )}
      </div>
    </div>
  );
}
