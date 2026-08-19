import { notFound } from "next/navigation";
import { BuilderClient } from "@/components/builder/builder-client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string; campaignId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { clientId, campaignId } = await params;
  const { page: requestedPageId } = await searchParams;
  const user = await requireUser();

  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      clientId,
      client: { members: { some: { userId: user.id } } },
    },
    include: {
      client: { select: { slug: true } },
      pages: {
        orderBy: { createdAt: "asc" },
        include: { blocks: { orderBy: { position: "asc" } } },
      },
    },
  });

  if (!campaign) notFound();

  const page =
    (requestedPageId && campaign.pages.find((p) => p.id === requestedPageId)) ||
    campaign.pages[0] ||
    (await prisma.page.create({
      data: { campaignId, name: "Principal" },
      include: { blocks: true },
    }));

  // We map the database blocks to simple objects so they can be passed to Client Component
  const blocks = page.blocks.map(b => ({
    id: b.id,
    type: b.type,
    config: b.config as Record<string, unknown>
  }));

  // We are completely changing the paradigm here:
  // Instead of a simple list, we return the full Framer-style 3-column Builder.
  // We break out of the standard dashboard padding using absolute positioning to take full screen minus header.
  
  return (
    <div className="-m-4 flex h-[calc(100dvh-64px)] min-w-0 overflow-hidden sm:-m-6 lg:-m-8">
      <BuilderClient
        clientId={clientId}
        campaignId={campaignId}
        pageId={page.id}
        blocks={blocks}
        campaignStatus={campaign.status}
        campaignSlug={campaign.slug}
        clientSlug={campaign.client.slug}
      />
    </div>
  );
}
