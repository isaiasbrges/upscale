"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { requireClientAccess, requireCampaignAccess } from "@/lib/access-control";

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  clientId: z.string().min(1),
  campaignId: z.string().min(1),
  template: z.string().trim().min(1).max(80),
});

export async function getClients() {
  const user = await requireUser();
  return await prisma.client.findMany({
    where: { members: { some: { userId: user.id } } },
    select: { id: true, name: true }
  });
}

export async function getCampaignsByClient(clientId: string) {
  const user = await requireUser();
  await requireClientAccess(user.id, clientId);
  return await prisma.campaign.findMany({
    where: { clientId },
    select: { id: true, name: true }
  });
}

export async function createScratchCard(data: { name: string, clientId: string, campaignId: string, template: string }) {
  const user = await requireUser();
  const parsed = createSchema.parse(data);
  await requireClientAccess(user.id, parsed.clientId);
  const campaign = await requireCampaignAccess(user.id, parsed.campaignId);
  if (campaign.clientId !== parsed.clientId) throw new Error("Campanha inválida");
  const scratchCard = await prisma.scratchCard.create({
    data: {
      name: parsed.name,
      clientId: parsed.clientId,
      campaignId: parsed.campaignId,
      template: parsed.template,
      status: "DRAFT",
      settings: {
        coverImage: "",
        backgroundColor: "#ffffff",
      }
    }
  });

  revalidatePath("/dashboard/scratch-cards");
  return scratchCard;
}
