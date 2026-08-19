"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireFunnelAccess, requireCampaignAccess } from "@/lib/access-control";
import { FUNNEL_STEP_TYPES, type FunnelStepType } from "@/lib/funnel-step-types";
import { slugify } from "@/lib/utils";

const URL_STEP_TYPES = new Set<FunnelStepType>(["REDIRECT", "EXTERNAL_URL"]);

/**
 * PAGE e SCRATCH_CARD são etapas "com conteúdo": além da linha na tabela
 * FunnelStep, precisam de uma Page/ScratchCard de verdade para editar e
 * publicar. Ambas exigem uma Campaign — se o funil ainda não tiver uma
 * vinculada, criamos uma automaticamente para não travar o fluxo.
 */
async function ensureFunnelCampaign(funnelId: string, clientId: string, funnelName: string) {
  const existing = await prisma.campaign.findFirst({ where: { funnelId }, select: { id: true } });
  if (existing) return existing.id;

  const slug = `${slugify(funnelName) || "funil"}-${funnelId.slice(-6)}`;
  const campaign = await prisma.campaign.create({
    data: {
      clientId,
      funnelId,
      name: funnelName,
      slug,
      pages: { create: { name: "Principal" } },
    },
    select: { id: true },
  });
  return campaign.id;
}

const addStepSchema = z.object({
  name: z.string().trim().min(2, "O nome da etapa deve ter pelo menos 2 caracteres.").max(120, "O nome da etapa deve ter no máximo 120 caracteres."),
  type: z.enum(FUNNEL_STEP_TYPES, { message: "Tipo de etapa inválido." }),
  externalUrl: z.string().trim().url("Informe uma URL válida.").optional().or(z.literal("")),
});

const updateStepSchema = z.object({
  name: z.string().trim().min(2, "O nome da etapa deve ter pelo menos 2 caracteres.").max(120, "O nome da etapa deve ter no máximo 120 caracteres."),
  externalUrl: z.string().trim().url("Informe uma URL válida.").optional().or(z.literal("")),
});

export type FunnelStepActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function addFunnelStepAction(
  funnelId: string,
  _prev: FunnelStepActionState,
  formData: FormData,
): Promise<FunnelStepActionState> {
  const user = await requireUser();
  const funnel = await requireFunnelAccess(user.id, funnelId);

  const parsed = addStepSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    externalUrl: formData.get("externalUrl") || "",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  if (URL_STEP_TYPES.has(parsed.data.type) && !parsed.data.externalUrl) {
    return { fieldErrors: { externalUrl: ["Informe a URL de destino."] } };
  }

  const last = await prisma.funnelStep.findFirst({
    where: { funnelId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  let pageId: string | null = null;
  let scratchCardId: string | null = null;

  if (parsed.data.type === "PAGE") {
    const funnelName = await prisma.funnel.findUniqueOrThrow({ where: { id: funnelId }, select: { name: true } });
    const campaignId = await ensureFunnelCampaign(funnelId, funnel.clientId, funnelName.name);
    const page = await prisma.page.findFirst({ where: { campaignId }, select: { id: true } });
    pageId = page?.id ?? (await prisma.page.create({ data: { campaignId, name: "Principal" }, select: { id: true } })).id;
  } else if (parsed.data.type === "SCRATCH_CARD") {
    const funnelName = await prisma.funnel.findUniqueOrThrow({ where: { id: funnelId }, select: { name: true } });
    const campaignId = await ensureFunnelCampaign(funnelId, funnel.clientId, funnelName.name);
    const scratchCard = await prisma.scratchCard.create({
      data: {
        name: parsed.data.name,
        clientId: funnel.clientId,
        campaignId,
        template: "vendedor-sincero",
        status: "DRAFT",
      },
      select: { id: true },
    });
    scratchCardId = scratchCard.id;
  }

  await prisma.funnelStep.create({
    data: {
      funnelId,
      name: parsed.data.name,
      type: parsed.data.type,
      order: (last?.order ?? -1) + 1,
      pageId,
      scratchCardId,
      config: (parsed.data.externalUrl ? { url: parsed.data.externalUrl } : undefined) as any,
    },
  });

  revalidatePath(`/dashboard/funnels/${funnelId}`);
  revalidatePath(`/dashboard/scratch-cards`);
  revalidatePath(`/dashboard/clients/${funnel.clientId}`);
  return {};
}

export async function updateFunnelStepAction(
  funnelId: string,
  stepId: string,
  _prev: FunnelStepActionState,
  formData: FormData,
): Promise<FunnelStepActionState> {
  const user = await requireUser();
  await requireFunnelAccess(user.id, funnelId);

  const step = await prisma.funnelStep.findFirst({ where: { id: stepId, funnelId } });
  if (!step) return { error: "Etapa não encontrada." };

  const parsed = updateStepSchema.safeParse({
    name: formData.get("name"),
    externalUrl: formData.get("externalUrl") || "",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  if (URL_STEP_TYPES.has(step.type as FunnelStepType) && !parsed.data.externalUrl) {
    return { fieldErrors: { externalUrl: ["Informe a URL de destino."] } };
  }

  await prisma.funnelStep.update({
    where: { id: stepId },
    data: {
      name: parsed.data.name,
      config: (parsed.data.externalUrl ? { url: parsed.data.externalUrl } : step.config ?? undefined) as any,
    },
  });

  revalidatePath(`/dashboard/funnels/${funnelId}`);
  return {};
}

export async function setFunnelStepStatusAction(funnelId: string, stepId: string, status: "DRAFT" | "PUBLISHED") {
  const user = await requireUser();
  await requireFunnelAccess(user.id, funnelId);
  const step = await prisma.funnelStep.findFirst({ where: { id: stepId, funnelId } });
  if (!step) throw new Error("Etapa não encontrada.");
  await prisma.funnelStep.update({ where: { id: stepId }, data: { status } });
  revalidatePath(`/dashboard/funnels/${funnelId}`);
}

export async function deleteFunnelStepAction(funnelId: string, stepId: string) {
  const user = await requireUser();
  await requireFunnelAccess(user.id, funnelId);
  const step = await prisma.funnelStep.findFirst({ where: { id: stepId, funnelId } });
  if (!step) throw new Error("Etapa não encontrada.");
  await prisma.funnelStep.delete({ where: { id: stepId } });
  revalidatePath(`/dashboard/funnels/${funnelId}`);
}

export async function reorderFunnelStepsAction(funnelId: string, orderedStepIds: string[]) {
  const user = await requireUser();
  await requireFunnelAccess(user.id, funnelId);

  const steps = await prisma.funnelStep.findMany({ where: { funnelId }, select: { id: true } });
  const validIds = new Set(steps.map((s) => s.id));
  if (orderedStepIds.length !== steps.length || !orderedStepIds.every((id) => validIds.has(id))) {
    throw new Error("Lista de etapas inválida.");
  }

  await prisma.$transaction(
    orderedStepIds.map((id, index) =>
      prisma.funnelStep.update({ where: { id }, data: { order: index } }),
    ),
  );

  revalidatePath(`/dashboard/funnels/${funnelId}`);
}

const RESOLVABLE_STEP_TYPES = new Set<FunnelStepType>(["PAGE", "SCRATCH_CARD", "REDIRECT", "EXTERNAL_URL", "THANK_YOU"]);

/**
 * Lista as etapas do funil vinculado a uma campanha que já têm um destino
 * público resolvível (ver src/app/f/[stepId]/page.tsx), para alimentar o
 * seletor "Etapa do funil" nos campos de link dos blocos do builder.
 */
export async function getFunnelStepsForCampaign(campaignId: string) {
  const user = await requireUser();
  const campaign = await requireCampaignAccess(user.id, campaignId);

  const funnel = await prisma.funnel.findFirst({
    where: { campaigns: { some: { id: campaign.id } } },
    select: { steps: { orderBy: { order: "asc" }, select: { id: true, name: true, type: true, pageId: true, scratchCardId: true } } },
  });

  if (!funnel) return [];

  return funnel.steps
    .filter((step) => {
      const type = step.type as FunnelStepType;
      if (!RESOLVABLE_STEP_TYPES.has(type)) return false;
      if (type === "PAGE") return Boolean(step.pageId);
      if (type === "SCRATCH_CARD") return Boolean(step.scratchCardId);
      return true;
    })
    .map((step) => ({ id: step.id, name: step.name, type: step.type }));
}
