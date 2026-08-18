import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { PublicCampaign } from "@/components/campaigns/public-campaign";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const requestHeaders = await headers();
  const hostname = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "").split(":")[0].toLowerCase().replace(/^www\./, "");
  if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
    const domain = await prisma.domain.findFirst({
      where: { hostname, status: "ACTIVE" },
      include: { client: { include: { campaigns: { where: { status: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 1 } } } },
    });
    const campaignId = domain?.campaignId || domain?.client.campaigns[0]?.id;
    if (campaignId) return <PublicCampaign campaignId={campaignId} />;
  }
  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}
