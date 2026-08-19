"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { requireCampaignAccess, requirePrizeAccess } from "@/lib/access-control";

const prizeSchema = z.object({
  name: z.string().trim().min(2, "O nome do prêmio deve ter pelo menos 2 caracteres.").max(120, "O nome do prêmio deve ter no máximo 120 caracteres."),
  description: z.string().trim().max(1000, "A descrição deve ter no máximo 1000 caracteres.").nullish(),
  imageUrl: z.string().url("Informe uma URL de imagem válida.").or(z.literal("")).nullish(),
  icon: z.string().trim().max(100).nullish(),
  value: z.coerce.number().min(0, "O valor não pode ser negativo.").nullable().optional(),
  probability: z.coerce.number().min(0, "A probabilidade mínima é 0.").max(100, "A probabilidade máxima é 100."),
  quantity: z.coerce.number().int().min(0, "A quantidade não pode ser negativa."),
  active: z.coerce.boolean(),
  ctaText: z.string().trim().max(80).nullish(),
  redirectUrl: z.string().url("Informe uma URL de redirecionamento válida.").or(z.literal("")).nullish(),
  scratchCardId: z.string().nullable().optional(),
});

export type PrizeActionResult<T> =
  | { success: true; prize: T }
  | { success: false; error?: string; fieldErrors?: Record<string, string[]> };

export async function createPrize(campaignId: string, data: any): Promise<PrizeActionResult<Awaited<ReturnType<typeof prisma.prize.create>>>> {
  const user = await requireUser();
  await requireCampaignAccess(user.id, campaignId);

  const parsed = prizeSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const prize = await prisma.prize.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl || null,
        icon: parsed.data.icon,
        value: parsed.data.value ?? null,
        probability: parsed.data.probability,
        quantity: parsed.data.quantity,
        active: parsed.data.active,
        ctaText: parsed.data.ctaText,
        redirectUrl: parsed.data.redirectUrl || null,
        campaignId,
        scratchCardId: parsed.data.scratchCardId || null,
      },
    });
    revalidatePath(`/dashboard/clients/[clientId]/campaigns/${campaignId}/prizes`, "page");
    return { success: true, prize };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível criar o prêmio." };
  }
}

export async function updatePrize(id: string, data: any): Promise<PrizeActionResult<Awaited<ReturnType<typeof prisma.prize.update>>>> {
  const user = await requireUser();
  await requirePrizeAccess(user.id, id);

  const parsed = prizeSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const prize = await prisma.prize.update({
      where: { id },
      data: {
        name: parsed.data.name, description: parsed.data.description,
        imageUrl: parsed.data.imageUrl || null, icon: parsed.data.icon,
        value: parsed.data.value ?? null, probability: parsed.data.probability,
        quantity: parsed.data.quantity, active: parsed.data.active,
        ctaText: parsed.data.ctaText, redirectUrl: parsed.data.redirectUrl || null,
        scratchCardId: parsed.data.scratchCardId,
      },
    });
    revalidatePath(`/dashboard/clients/[clientId]/campaigns/${prize.campaignId}/prizes`, "page");
    return { success: true, prize };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível atualizar o prêmio." };
  }
}

export async function deletePrize(id: string) {
  const user = await requireUser();
  await requirePrizeAccess(user.id, id);
  const prize = await prisma.prize.delete({ where: { id } });
  revalidatePath(`/dashboard/clients/[clientId]/campaigns/${prize.campaignId}/prizes`, "page");
  return prize;
}
