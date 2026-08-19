"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const clientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .optional()
    .or(z.literal("")),
});

export type ClientActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function ensureClientAccess(userId: string, clientId: string) {
  const member = await prisma.clientMember.findUnique({
    where: { userId_clientId: { userId, clientId } },
  });
  if (!member) throw new Error("Cliente não encontrado");
}

export async function createClientAction(
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    logoUrl: formData.get("logoUrl") || "",
    brandColor: formData.get("brandColor") || "",
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const slugTaken = await prisma.client.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (slugTaken) {
    return { error: "Este slug já está em uso" };
  }

  const client = await prisma.client.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      logoUrl: parsed.data.logoUrl || null,
      brandColor: parsed.data.brandColor || null,
      members: { create: { userId: user.id } },
    },
  });

  revalidatePath("/dashboard/clients");
  redirect(`/dashboard/clients/${client.id}`);
}

export async function updateClientAction(
  clientId: string,
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();
  await ensureClientAccess(user.id, clientId);

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logoUrl: formData.get("logoUrl") || "",
    brandColor: formData.get("brandColor") || "",
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const slugTaken = await prisma.client.findFirst({
    where: { slug: parsed.data.slug, NOT: { id: clientId } },
  });
  if (slugTaken) {
    return { error: "Este slug já está em uso" };
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      logoUrl: parsed.data.logoUrl || null,
      brandColor: parsed.data.brandColor || null,
    },
  });

  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${clientId}`);
  return {};
}

export async function deleteClientAction(clientId: string) {
  const user = await requireUser();
  await ensureClientAccess(user.id, clientId);

  await prisma.client.delete({ where: { id: clientId } });
  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}
