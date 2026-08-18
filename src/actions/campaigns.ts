"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const campaignSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
});

export type CampaignActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function ensureClientAccess(userId: string, clientId: string) {
  const member = await prisma.clientMember.findUnique({
    where: { userId_clientId: { userId, clientId } },
  });
  if (!member) throw new Error("Cliente não encontrado");
}

async function ensureCampaignAccess(
  userId: string,
  clientId: string,
  campaignId: string,
) {
  await ensureClientAccess(userId, clientId);
  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, clientId },
  });
  if (!campaign) throw new Error("Campanha não encontrada");
  return campaign;
}

export async function createCampaignAction(
  clientId: string,
  _prev: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const user = await requireUser();
  await ensureClientAccess(user.id, clientId);

  const parsed = campaignSchema.safeParse({
    name: formData.get("name"),
    slug:
      formData.get("slug") || slugify(String(formData.get("name") ?? "")),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const slugTaken = await prisma.campaign.findFirst({
    where: { clientId, slug: parsed.data.slug },
  });
  if (slugTaken) {
    return { error: "Este slug já está em uso neste cliente" };
  }

  const campaign = await prisma.campaign.create({
    data: {
      clientId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      pages: {
        create: { name: "Principal" },
      },
    },
  });

  revalidatePath(`/dashboard/clients/${clientId}/campaigns`);
  redirect(`/dashboard/clients/${clientId}/campaigns/${campaign.id}`);
}

export async function updateCampaignAction(
  clientId: string,
  campaignId: string,
  _prev: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const user = await requireUser();
  await ensureCampaignAccess(user.id, clientId, campaignId);

  const parsed = campaignSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const slugTaken = await prisma.campaign.findFirst({
    where: {
      clientId,
      slug: parsed.data.slug,
      NOT: { id: campaignId },
    },
  });
  if (slugTaken) {
    return { error: "Este slug já está em uso neste cliente" };
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
    },
  });

  revalidatePath(`/dashboard/clients/${clientId}/campaigns`);
  revalidatePath(`/dashboard/clients/${clientId}/campaigns/${campaignId}`);
  return {};
}

export async function deleteCampaignAction(
  clientId: string,
  campaignId: string,
) {
  const user = await requireUser();
  await ensureCampaignAccess(user.id, clientId, campaignId);

  await prisma.campaign.delete({ where: { id: campaignId } });
  revalidatePath(`/dashboard/clients/${clientId}/campaigns`);
  redirect(`/dashboard/clients/${clientId}`);
}

export async function getOrCreateMainPage(campaignId: string) {
  let page = await prisma.page.findFirst({
    where: { campaignId },
    include: {
      blocks: { orderBy: { position: "asc" } },
    },
  });

  if (!page) {
    page = await prisma.page.create({
      data: { campaignId, name: "Principal" },
      include: { blocks: { orderBy: { position: "asc" } } },
    });
  }

  return page;
}

export async function setCampaignPublishedAction(clientId: string, campaignId: string, published: boolean) {
  const user = await requireUser();
  await ensureCampaignAccess(user.id, clientId, campaignId);
  await prisma.campaign.update({ where: { id: campaignId }, data: { status: published ? "PUBLISHED" : "DRAFT" } });
  revalidatePath(`/dashboard/clients/${clientId}`);
  revalidatePath(`/dashboard/clients/${clientId}/campaigns/${campaignId}`);
  revalidatePath("/dashboard/domains");
}
