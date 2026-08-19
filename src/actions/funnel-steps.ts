"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireFunnelAccess } from "@/lib/access-control";
import { FUNNEL_STEP_TYPES, type FunnelStepType } from "@/lib/funnel-step-types";

const URL_STEP_TYPES = new Set<FunnelStepType>(["REDIRECT", "EXTERNAL_URL"]);

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
  await requireFunnelAccess(user.id, funnelId);

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

  await prisma.funnelStep.create({
    data: {
      funnelId,
      name: parsed.data.name,
      type: parsed.data.type,
      order: (last?.order ?? -1) + 1,
      config: (parsed.data.externalUrl ? { url: parsed.data.externalUrl } : undefined) as any,
    },
  });

  revalidatePath(`/dashboard/funnels/${funnelId}`);
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
