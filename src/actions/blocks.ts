"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { blockRegistry, type BlockType } from "@/lib/blocks/registry";
import { prisma } from "@/lib/prisma";

async function ensureCampaignBuilderAccess(
  userId: string,
  clientId: string,
  campaignId: string,
) {
  const member = await prisma.clientMember.findUnique({
    where: { userId_clientId: { userId, clientId } },
  });
  if (!member) throw new Error("Sem acesso");

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, clientId },
  });
  if (!campaign) throw new Error("Campanha não encontrada");
  return campaign;
}

export type BlockActionState = {
  error?: string;
  success?: boolean;
};

export type CreatedBlock = {
  id: string;
  type: string;
  config: Record<string, unknown>;
};

export async function addBlockAction(
  clientId: string,
  campaignId: string,
  pageId: string,
  blockType: string,
): Promise<BlockActionState & { block?: CreatedBlock }> {
  const user = await requireUser();
  await ensureCampaignBuilderAccess(user.id, clientId, campaignId);

  const entry = blockRegistry[blockType as BlockType];
  if (!entry) return { error: "Tipo de bloco inválido" };

  const page = await prisma.page.findFirst({
    where: { id: pageId, campaignId },
    include: { blocks: { select: { position: true } } },
  });
  if (!page) return { error: "Página não encontrada" };

  const maxPosition = page.blocks.reduce(
    (max, b) => Math.max(max, b.position),
    -1,
  );

  // Novos blocos nascem com a cor de marca do cliente (quando cadastrada),
  // aplicada só nos campos claramente "de marca" — nunca na cor de texto,
  // pra não arriscar quebrar contraste de leitura.
  const config: Record<string, unknown> = { ...entry.defaultConfig };
  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { brandColor: true } });
  if (client?.brandColor) {
    for (const field of entry.fields) {
      if (field.type === "color" && (field.key === "backgroundColor" || field.key === "accentColor")) {
        config[field.key] = client.brandColor;
      }
    }
  }

  const created = await prisma.block.create({
    data: {
      pageId: page.id,
      type: blockType,
      position: maxPosition + 1,
      config: config as any,
    },
  });

  revalidatePath(
    `/dashboard/clients/${clientId}/campaigns/${campaignId}/builder`,
  );
  return {
    success: true,
    block: { id: created.id, type: created.type, config: created.config as Record<string, unknown> },
  };
}

/**
 * Persiste a nova ordem dos blocos após um drag-and-drop no painel de
 * camadas. Recebe os IDs já na ordem final e grava position = índice —
 * mais simples e robusto do que tentar calcular deslocamentos.
 */
export async function reorderBlocksAction(
  clientId: string,
  campaignId: string,
  pageId: string,
  orderedBlockIds: string[],
): Promise<BlockActionState> {
  const user = await requireUser();
  await ensureCampaignBuilderAccess(user.id, clientId, campaignId);

  const page = await prisma.page.findFirst({
    where: { id: pageId, campaignId },
    include: { blocks: { select: { id: true } } },
  });
  if (!page) return { error: "Página não encontrada" };

  const validIds = new Set(page.blocks.map((b) => b.id));
  if (orderedBlockIds.length !== page.blocks.length || orderedBlockIds.some((id) => !validIds.has(id))) {
    return { error: "Lista de blocos inválida" };
  }

  await prisma.$transaction(
    orderedBlockIds.map((id, index) =>
      prisma.block.update({ where: { id }, data: { position: index } }),
    ),
  );

  revalidatePath(
    `/dashboard/clients/${clientId}/campaigns/${campaignId}/builder`,
  );
  revalidatePath(
    `/dashboard/clients/${clientId}/campaigns/${campaignId}/preview`,
  );
  return { success: true };
}

export async function updateBlockAction(
  clientId: string,
  campaignId: string,
  _prev: BlockActionState | null,
  formData: FormData,
): Promise<BlockActionState> {
  const user = await requireUser();
  await ensureCampaignBuilderAccess(user.id, clientId, campaignId);

  const blockId = formData.get("blockId") as string;
  const blockType = formData.get("blockType") as string;
  const configJson = formData.get("config") as string;

  const entry = blockRegistry[blockType as BlockType];
  if (!entry) return { error: "Tipo de bloco inválido" };

  let config: unknown;
  try {
    config = JSON.parse(configJson);
  } catch {
    return { error: "Configuração inválida" };
  }

  const parsed = entry.configSchema.safeParse(config);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Configuração inválida",
    };
  }

  const block = await prisma.block.findFirst({
    where: { id: blockId, page: { campaignId } },
  });
  if (!block) return { error: "Bloco não encontrado" };

  await prisma.block.update({
    where: { id: blockId },
    data: { config: parsed.data as any },
  });

  revalidatePath(
    `/dashboard/clients/${clientId}/campaigns/${campaignId}/builder`,
  );
  revalidatePath(
    `/dashboard/clients/${clientId}/campaigns/${campaignId}/preview`,
  );
  return { success: true };
}

export async function deleteBlockAction(
  clientId: string,
  campaignId: string,
  blockId: string,
): Promise<BlockActionState> {
  const user = await requireUser();
  await ensureCampaignBuilderAccess(user.id, clientId, campaignId);

  const block = await prisma.block.findFirst({
    where: { id: blockId, page: { campaignId } },
  });
  if (!block) return { error: "Bloco não encontrado" };

  await prisma.block.delete({ where: { id: blockId } });

  revalidatePath(
    `/dashboard/clients/${clientId}/campaigns/${campaignId}/builder`,
  );
  return { success: true };
}
