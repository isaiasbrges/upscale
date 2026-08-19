"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireClientAccess, requireFunnelAccess } from "@/lib/access-control";

const funnelSchema = z.object({
  name: z.string().trim().min(2, "O nome do funil deve ter pelo menos 2 caracteres.").max(120, "O nome do funil deve ter no máximo 120 caracteres."),
  description: z.string().trim().max(500, "A descrição deve ter no máximo 500 caracteres.").optional().or(z.literal("")),
  clientId: z.string().min(1, "Selecione um cliente."),
  campaignId: z.string().optional().or(z.literal("")),
});

export type FunnelActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function assertCampaignAvailable(clientId: string, campaignId: string, currentFunnelId?: string) {
  const campaign = await prisma.campaign.findFirst({ where: { id: campaignId, clientId } });
  if (!campaign) return { error: "Campanha inválida para o cliente selecionado." } as const;
  if (campaign.funnelId && campaign.funnelId !== currentFunnelId) {
    return { error: "Esta campanha já está vinculada a outro funil." } as const;
  }
  return { campaign } as const;
}

export async function createFunnelAction(
  _prev: FunnelActionState,
  formData: FormData,
): Promise<FunnelActionState> {
  const user = await requireUser();

  const parsed = funnelSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    clientId: formData.get("clientId"),
    campaignId: formData.get("campaignId") || "",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await requireClientAccess(user.id, parsed.data.clientId);

  let campaignId: string | null = null;
  if (parsed.data.campaignId) {
    const check = await assertCampaignAvailable(parsed.data.clientId, parsed.data.campaignId);
    if ("error" in check) return { error: check.error };
    campaignId = check.campaign.id;
  }

  const funnel = await prisma.funnel.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      clientId: parsed.data.clientId,
      ...(campaignId ? { campaigns: { connect: { id: campaignId } } } : {}),
    },
  });

  revalidatePath("/dashboard/funnels");
  revalidatePath("/dashboard");
  redirect(`/dashboard/funnels/${funnel.id}`);
}

export async function updateFunnelAction(
  funnelId: string,
  _prev: FunnelActionState,
  formData: FormData,
): Promise<FunnelActionState> {
  const user = await requireUser();
  const funnel = await requireFunnelAccess(user.id, funnelId);

  const parsed = funnelSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    clientId: funnel.clientId,
    campaignId: formData.get("campaignId") || "",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  let campaignId: string | null = null;
  if (parsed.data.campaignId) {
    const check = await assertCampaignAvailable(funnel.clientId, parsed.data.campaignId, funnelId);
    if ("error" in check) return { error: check.error };
    campaignId = check.campaign.id;
  }

  await prisma.$transaction(async (tx) => {
    // Unlink any campaign currently pointing at this funnel that isn't the newly selected one.
    await tx.campaign.updateMany({
      where: { funnelId, ...(campaignId ? { NOT: { id: campaignId } } : {}) },
      data: { funnelId: null },
    });

    await tx.funnel.update({
      where: { id: funnelId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        ...(campaignId ? { campaigns: { connect: { id: campaignId } } } : {}),
      },
    });
  });

  revalidatePath("/dashboard/funnels");
  revalidatePath(`/dashboard/funnels/${funnelId}`);
  return {};
}

export async function setFunnelStatusAction(funnelId: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const user = await requireUser();
  await requireFunnelAccess(user.id, funnelId);
  await prisma.funnel.update({ where: { id: funnelId }, data: { status } });
  revalidatePath("/dashboard/funnels");
  revalidatePath(`/dashboard/funnels/${funnelId}`);
  revalidatePath("/dashboard");
}

export async function deleteFunnelAction(funnelId: string) {
  const user = await requireUser();
  await requireFunnelAccess(user.id, funnelId);
  await prisma.funnel.delete({ where: { id: funnelId } });
  revalidatePath("/dashboard/funnels");
  revalidatePath("/dashboard");
}

export async function duplicateFunnelAction(funnelId: string) {
  const user = await requireUser();
  const funnel = await requireFunnelAccess(user.id, funnelId);

  const original = await prisma.funnel.findUnique({
    where: { id: funnelId },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!original) throw new Error("Funil não encontrado");

  const copy = await prisma.funnel.create({
    data: {
      name: `${original.name} (cópia)`,
      description: original.description,
      clientId: funnel.clientId,
      status: "DRAFT",
      steps: {
        create: original.steps.map((step) => ({
          order: step.order,
          name: step.name,
          type: step.type,
          status: "DRAFT",
          config: (step.config ?? undefined) as any,
          // Intentionally do not copy pageId/scratchCardId: duplicated steps start
          // unlinked so editing the copy never mutates the original's content.
        })),
      },
    },
  });

  revalidatePath("/dashboard/funnels");
  return copy;
}
