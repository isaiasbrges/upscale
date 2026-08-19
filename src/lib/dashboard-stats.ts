import { prisma } from "@/lib/prisma";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export type ActivityItem = {
  id: string;
  label: string;
  entity: string;
  href: string;
  at: Date;
};

export async function getDashboardStats(userId: string) {
  const accessibleClient = { client: { members: { some: { userId } } } };
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

  const [
    clientCount,
    activeCampaignCount,
    publishedFunnelCount,
    activeScratchCardCount,
    recentCampaigns,
    recentActivityCampaigns,
    recentActivityFunnels,
    recentActivityScratchCards,
    recentActivityDomains,
    recentPlays,
  ] = await Promise.all([
    prisma.clientMember.count({ where: { userId } }),
    prisma.campaign.count({ where: { ...accessibleClient, status: "PUBLISHED" } }),
    prisma.funnel.count({ where: { ...accessibleClient, status: "PUBLISHED" } }),
    prisma.scratchCard.count({ where: { ...accessibleClient, status: "PUBLISHED" } }),
    prisma.campaign.findMany({
      where: accessibleClient,
      include: {
        client: { select: { name: true } },
        _count: { select: { scratchPlays: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.campaign.findMany({
      where: accessibleClient,
      select: { id: true, name: true, clientId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.funnel.findMany({
      where: { ...accessibleClient, status: "PUBLISHED" },
      select: { id: true, name: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.scratchCard.findMany({
      where: accessibleClient,
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.domain.findMany({
      where: accessibleClient,
      select: { id: true, hostname: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.scratchPlay.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        OR: [
          { campaign: accessibleClient },
          { scratchCard: accessibleClient },
        ],
      },
      select: { visitorId: true, resultType: true },
    }),
  ]);

  const uniqueVisitors = new Set(recentPlays.map((play) => play.visitorId)).size;
  const conversions = recentPlays.filter((play) => play.resultType === "WIN").length;
  const conversionRate = uniqueVisitors > 0 ? (conversions / uniqueVisitors) * 100 : null;

  const activity: ActivityItem[] = [
    ...recentActivityCampaigns.map((c) => ({
      id: `campaign-${c.id}`,
      label: `Campanha "${c.name}" criada`,
      entity: "Campanha",
      href: `/dashboard/clients/${c.clientId}/campaigns/${c.id}`,
      at: c.createdAt,
    })),
    ...recentActivityFunnels.map((f) => ({
      id: `funnel-${f.id}`,
      label: `Funil "${f.name}" publicado`,
      entity: "Funil",
      href: `/dashboard/funnels/${f.id}`,
      at: f.updatedAt,
    })),
    ...recentActivityScratchCards.map((s) => ({
      id: `scratch-${s.id}`,
      label: `Raspadinha "${s.name}" criada`,
      entity: "Raspadinha",
      href: `/dashboard/scratch-cards/${s.id}/edit`,
      at: s.createdAt,
    })),
    ...recentActivityDomains.map((d) => ({
      id: `domain-${d.id}`,
      label: `Domínio "${d.hostname}" conectado`,
      entity: "Domínio",
      href: `/dashboard/domains`,
      at: d.createdAt,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);

  return {
    clientCount,
    activeCampaignCount,
    publishedFunnelCount,
    activeScratchCardCount,
    recentCampaigns: recentCampaigns.map((c) => ({
      id: c.id,
      name: c.name,
      clientId: c.clientId,
      clientName: c.client.name,
      status: c.status,
      conversions: c._count.scratchPlays,
      updatedAt: c.updatedAt,
    })),
    performance: {
      visitors: uniqueVisitors,
      conversions,
      leads: null as number | null, // sem fonte de dados real ainda (nenhum evento de lead é registrado)
      clicks: null as number | null, // sem fonte de dados real ainda (nenhum evento de clique é registrado)
      conversionRate,
    },
    activity,
  };
}
