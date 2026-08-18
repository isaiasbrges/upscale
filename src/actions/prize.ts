"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { requireCampaignAccess, requirePrizeAccess } from "@/lib/access-control";

const prizeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).nullish(),
  imageUrl: z.string().url().or(z.literal("")).nullish(),
  icon: z.string().trim().max(100).nullish(),
  value: z.coerce.number().min(0).nullable().optional(),
  probability: z.coerce.number().min(0).max(100),
  quantity: z.coerce.number().int().min(0),
  active: z.coerce.boolean(),
  ctaText: z.string().trim().max(80).nullish(),
  redirectUrl: z.string().url().or(z.literal("")).nullish(),
  scratchCardId: z.string().nullable().optional(),
});

export async function createPrize(campaignId: string, data: any) {
  const user = await requireUser();
  await requireCampaignAccess(user.id, campaignId);
  const parsed = prizeSchema.parse(data);
  const prize = await prisma.prize.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      imageUrl: parsed.imageUrl || null,
      icon: parsed.icon,
      value: parsed.value ?? null,
      probability: parsed.probability,
      quantity: parsed.quantity,
      active: parsed.active,
      ctaText: parsed.ctaText,
      redirectUrl: parsed.redirectUrl || null,
      campaignId,
      scratchCardId: parsed.scratchCardId || null,
    },
  });
  revalidatePath(`/dashboard/clients/[clientId]/campaigns/${campaignId}/prizes`, "page");
  return prize;
}

export async function updatePrize(id: string, data: any) {
  const user = await requireUser();
  await requirePrizeAccess(user.id, id);
  const parsed = prizeSchema.parse(data);
  const prize = await prisma.prize.update({
    where: { id },
    data: {
      name: parsed.name, description: parsed.description,
      imageUrl: parsed.imageUrl || null, icon: parsed.icon,
      value: parsed.value ?? null, probability: parsed.probability,
      quantity: parsed.quantity, active: parsed.active,
      ctaText: parsed.ctaText, redirectUrl: parsed.redirectUrl || null,
      scratchCardId: parsed.scratchCardId,
    },
  });
  revalidatePath(`/dashboard/clients/[clientId]/campaigns/${prize.campaignId}/prizes`, "page");
  return prize;
}

export async function deletePrize(id: string) {
  const user = await requireUser();
  await requirePrizeAccess(user.id, id);
  const prize = await prisma.prize.delete({ where: { id } });
  revalidatePath(`/dashboard/clients/[clientId]/campaigns/${prize.campaignId}/prizes`, "page");
  return prize;
}
