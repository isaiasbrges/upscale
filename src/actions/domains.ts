"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { requireCampaignAccess, requireClientAccess } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";

const hostnameSchema = z.string().trim().toLowerCase().transform(v => v.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "").replace(/:\d+$/, "")).pipe(z.string().min(4).max(253).regex(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/, "Domínio inválido"));
export type DomainActionState = { error?: string; success?: string };

function vercelProjectUrl(path = "") {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const token = process.env.VERCEL_TOKEN;
  if (!projectId || !token) return null;
  const team = process.env.VERCEL_TEAM_ID;
  const query = team ? `?teamId=${encodeURIComponent(team)}` : "";
  return {
    url: `https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/domains${path}${query}`,
    token,
  };
}

async function addDomainToVercel(hostname: string) {
  const endpoint = vercelProjectUrl();
  if (!endpoint) return false;
  const response = await fetch(endpoint.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${endpoint.token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: hostname }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: { message?: string; code?: string } } | null;
    if (payload?.error?.code !== "domain_already_in_use") {
      throw new Error(payload?.error?.message || "Não foi possível registrar o domínio na Vercel");
    }
  }
  return true;
}

async function removeDomainFromVercel(hostname: string) {
  const endpoint = vercelProjectUrl(`/${encodeURIComponent(hostname)}`);
  if (!endpoint) return;
  const response = await fetch(endpoint.url, { method: "DELETE", headers: { Authorization: `Bearer ${endpoint.token}` } });
  if (!response.ok && response.status !== 404) throw new Error("Não foi possível remover o domínio da Vercel");
}

export async function createDomainAction(_previous: DomainActionState, formData: FormData): Promise<DomainActionState> {
  const user = await requireUser();
  const clientId = String(formData.get("clientId") ?? "");
  const campaignId = String(formData.get("campaignId") ?? "");
  const parsed = hostnameSchema.safeParse(formData.get("hostname"));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Domínio inválido" };
  await requireClientAccess(user.id, clientId);
  if (campaignId) {
    const campaign = await requireCampaignAccess(user.id, campaignId);
    if (campaign.clientId !== clientId) return { error: "A campanha não pertence ao cliente" };
  }
  if (await prisma.domain.findUnique({ where: { hostname: parsed.data } })) return { error: "Este domínio já está cadastrado" };
  try {
    await addDomainToVercel(parsed.data);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao registrar domínio na Vercel" };
  }
  await prisma.domain.create({ data: { hostname: parsed.data, clientId, campaignId: campaignId || null, status: "ACTIVE" } });
  revalidatePath("/dashboard/domains"); revalidatePath(`/dashboard/clients/${clientId}`);
  return { success: "Domínio conectado" };
}

export async function deleteDomainAction(domainId: string) {
  const user = await requireUser();
  const domain = await prisma.domain.findFirst({ where: { id: domainId, client: { members: { some: { userId: user.id } } } } });
  if (!domain) throw new Error("Domínio não encontrado");
  await removeDomainFromVercel(domain.hostname);
  await prisma.domain.delete({ where: { id: domainId } });
  revalidatePath("/dashboard/domains");
}
