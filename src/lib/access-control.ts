import { prisma } from "@/lib/prisma";

export async function requireClientAccess(userId: string, clientId: string) {
  const membership = await prisma.clientMember.findUnique({
    where: { userId_clientId: { userId, clientId } },
    select: { id: true },
  });

  if (!membership) throw new Error("Recurso não encontrado ou acesso negado");
}

export async function requireCampaignAccess(userId: string, campaignId: string) {
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      client: { members: { some: { userId } } },
    },
    select: { id: true, clientId: true },
  });

  if (!campaign) throw new Error("Recurso não encontrado ou acesso negado");
  return campaign;
}

export async function requirePrizeAccess(userId: string, prizeId: string) {
  const prize = await prisma.prize.findFirst({
    where: {
      id: prizeId,
      OR: [
        { campaign: { client: { members: { some: { userId } } } } },
        { scratchCard: { client: { members: { some: { userId } } } } },
      ],
    },
    select: { id: true, campaignId: true },
  });

  if (!prize) throw new Error("Recurso não encontrado ou acesso negado");
  return prize;
}
