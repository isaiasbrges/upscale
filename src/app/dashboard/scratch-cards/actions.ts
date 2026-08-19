"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { requireClientAccess, requireCampaignAccess } from "@/lib/access-control";

const createSchema = z.object({
  name: z.string().trim().min(2, "O nome da raspadinha deve ter pelo menos 2 caracteres.").max(120, "O nome da raspadinha deve ter no máximo 120 caracteres."),
  clientId: z.string().min(1, "Selecione um cliente."),
  campaignId: z.string().min(1, "Selecione uma campanha."),
  template: z.string().trim().min(1, "Selecione um template.").max(80),
});

export type CreateScratchCardResult =
  | { success: true; scratchCard: { id: string } }
  | { success: false; error?: string; fieldErrors?: Record<string, string[]> };

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

export async function createScratchCard(data: { name: string, clientId: string, campaignId: string, template: string }): Promise<CreateScratchCardResult> {
  const user = await requireUser();

  const parsed = createSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await requireClientAccess(user.id, parsed.data.clientId);
    const campaign = await requireCampaignAccess(user.id, parsed.data.campaignId);
    if (campaign.clientId !== parsed.data.clientId) {
      return { success: false, error: "Campanha inválida para o cliente selecionado." };
    }

    const scratchCard = await prisma.scratchCard.create({
      data: {
        name: parsed.data.name,
        clientId: parsed.data.clientId,
        campaignId: parsed.data.campaignId,
        template: parsed.data.template,
        status: "DRAFT",
        settings: {
          coverImage: "",
          backgroundColor: "#ffffff",
        }
      }
    });

    revalidatePath("/dashboard/scratch-cards");
    return { success: true, scratchCard };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível criar a raspadinha.",
    };
  }
}
