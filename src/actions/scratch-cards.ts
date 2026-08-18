"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const scratchCardSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  clientId: z.string().min(1, "Cliente é obrigatório"),
  campaignId: z.string().min(1, "Campanha é obrigatória"),
  template: z.string().default("vendedor-sincero"),
  status: z.string().default("DRAFT"),
  settings: z.string().optional().transform(val => {
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  }),
});

export type ScratchCardActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function ensureClientAccess(userId: string, clientId: string) {
  const member = await prisma.clientMember.findUnique({
    where: { userId_clientId: { userId, clientId } },
  });
  if (!member) throw new Error("Cliente não encontrado ou acesso negado");
}

export async function createScratchCardAction(
  _prev: ScratchCardActionState,
  formData: FormData,
): Promise<ScratchCardActionState> {
  const user = await requireUser();
  
  const parsed = scratchCardSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    campaignId: formData.get("campaignId"),
    template: formData.get("template") || "vendedor-sincero",
    status: formData.get("status") || "DRAFT",
    settings: formData.get("settings"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await ensureClientAccess(user.id, parsed.data.clientId);

  // Validate campaign belongs to client
  const campaign = await prisma.campaign.findFirst({
    where: { id: parsed.data.campaignId, clientId: parsed.data.clientId },
  });
  if (!campaign) {
    return { error: "Campanha inválida para o cliente selecionado." };
  }

  const scratchCard = await prisma.scratchCard.create({
    data: {
      name: parsed.data.name,
      clientId: parsed.data.clientId,
      campaignId: parsed.data.campaignId,
      template: parsed.data.template,
      status: parsed.data.status,
      settings: parsed.data.settings ?? undefined,
    },
  });

  revalidatePath(`/dashboard/scratch-cards`);
  revalidatePath(`/dashboard/clients/${parsed.data.clientId}`);
  revalidatePath(`/dashboard/clients/${parsed.data.clientId}/campaigns/${parsed.data.campaignId}`);
  redirect(`/dashboard/scratch-cards`);
}

export async function updateScratchCardAction(
  id: string,
  _prev: ScratchCardActionState,
  formData: FormData,
): Promise<ScratchCardActionState> {
  const user = await requireUser();
  
  const parsed = scratchCardSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    campaignId: formData.get("campaignId"),
    template: formData.get("template") || "vendedor-sincero",
    status: formData.get("status") || "DRAFT",
    settings: formData.get("settings"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await ensureClientAccess(user.id, parsed.data.clientId);

  const existing = await prisma.scratchCard.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Raspadinha não encontrada" };
  }
  if (existing.clientId !== parsed.data.clientId) {
    // If transferring to another client, make sure they have access
    await ensureClientAccess(user.id, parsed.data.clientId);
  }

  // Validate campaign belongs to client
  const campaign = await prisma.campaign.findFirst({
    where: { id: parsed.data.campaignId, clientId: parsed.data.clientId },
  });
  if (!campaign) {
    return { error: "Campanha inválida para o cliente selecionado." };
  }

  await prisma.scratchCard.update({
    where: { id },
    data: {
      name: parsed.data.name,
      clientId: parsed.data.clientId,
      campaignId: parsed.data.campaignId,
      template: parsed.data.template,
      status: parsed.data.status,
      settings: parsed.data.settings ?? existing.settings ?? undefined,
    },
  });

  revalidatePath(`/dashboard/scratch-cards`);
  revalidatePath(`/dashboard/clients/${parsed.data.clientId}`);
  revalidatePath(`/dashboard/clients/${parsed.data.clientId}/campaigns/${parsed.data.campaignId}`);
  if (existing.clientId !== parsed.data.clientId) {
    revalidatePath(`/dashboard/clients/${existing.clientId}`);
  }
  if (existing.campaignId !== parsed.data.campaignId) {
    revalidatePath(`/dashboard/clients/${existing.clientId}/campaigns/${existing.campaignId}`);
  }

  redirect(`/dashboard/scratch-cards`);
}

export async function deleteScratchCardAction(id: string) {
  const user = await requireUser();
  const existing = await prisma.scratchCard.findUnique({ where: { id } });
  
  if (!existing) {
    throw new Error("Raspadinha não encontrada");
  }

  await ensureClientAccess(user.id, existing.clientId);

  await prisma.scratchCard.delete({ where: { id } });

  revalidatePath(`/dashboard/scratch-cards`);
  revalidatePath(`/dashboard/clients/${existing.clientId}`);
  revalidatePath(`/dashboard/clients/${existing.clientId}/campaigns/${existing.campaignId}`);
  
  // Return void, calling components should redirect or refresh
}

export async function setWinningPrize(scratchCardId: string, prizeId: string | null) {
  const user = await requireUser();
  const existing = await prisma.scratchCard.findUnique({ where: { id: scratchCardId } });
  
  if (!existing) {
    throw new Error("Raspadinha não encontrada");
  }

  await ensureClientAccess(user.id, existing.clientId);

  const updated = await prisma.scratchCard.update({
    where: { id: scratchCardId },
    data: { winningPrizeId: prizeId },
  });

  revalidatePath(`/dashboard/scratch-cards`);
  revalidatePath(`/dashboard/clients/${existing.clientId}`);
  revalidatePath(`/dashboard/clients/${existing.clientId}/campaigns/${existing.campaignId}`);
  
  return updated;
}
