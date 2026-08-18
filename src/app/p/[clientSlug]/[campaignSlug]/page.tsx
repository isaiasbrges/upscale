import { notFound } from "next/navigation";
import { PublicCampaign } from "@/components/campaigns/public-campaign";
import { prisma } from "@/lib/prisma";
export default async function PublicCampaignPage({ params }: { params: Promise<{ clientSlug: string; campaignSlug: string }> }) {
  const { clientSlug, campaignSlug } = await params;
  const campaign = await prisma.campaign.findFirst({ where: { slug: campaignSlug, status: "PUBLISHED", client: { slug: clientSlug } }, select: { id: true } });
  if (!campaign) notFound();
  return <PublicCampaign campaignId={campaign.id} />;
}
