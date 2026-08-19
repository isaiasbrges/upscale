import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/design-system/components/page-header";
import { EmptyState } from "@/design-system/components/empty-state";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/components/ui/button";
import { Workflow, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { FunnelFilters } from "@/components/funnels/funnel-filters";
import { FunnelRowMenu } from "@/components/funnels/funnel-row-menu";

const statusLabel: Record<string, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
};

const statusVariant: Record<string, "neutral" | "success" | "warning"> = {
  DRAFT: "neutral",
  PUBLISHED: "success",
  ARCHIVED: "warning",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

async function FunnelsList({
  searchParams,
}: {
  searchParams: { clientId?: string; campaignId?: string; status?: string; q?: string; view?: string };
}) {
  const user = await requireUser();
  const accessibleClient = { client: { members: { some: { userId: user.id } } } };

  const [clients, campaigns] = await Promise.all([
    prisma.client.findMany({ where: { members: { some: { userId: user.id } } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.campaign.findMany({ where: accessibleClient, select: { id: true, name: true, clientId: true }, orderBy: { name: "asc" } }),
  ]);

  const where = {
    ...accessibleClient,
    ...(searchParams.clientId ? { clientId: searchParams.clientId } : {}),
    ...(searchParams.status ? { status: searchParams.status } : {}),
    ...(searchParams.campaignId ? { campaigns: { some: { id: searchParams.campaignId } } } : {}),
    ...(searchParams.q ? { name: { contains: searchParams.q, mode: "insensitive" as const } } : {}),
  };

  const funnels = await prisma.funnel.findMany({
    where,
    include: {
      client: { select: { id: true, name: true } },
      campaigns: { select: { id: true, name: true, clientId: true }, take: 1 },
      steps: { select: { id: true } },
      _count: { select: { steps: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const funnelsWithStats = await Promise.all(
    funnels.map(async (funnel) => {
      const campaign = funnel.campaigns[0] ?? null;
      let visitors = 0;
      let conversions = 0;
      if (campaign) {
        const plays = await prisma.scratchPlay.findMany({
          where: { campaignId: campaign.id },
          select: { visitorId: true, resultType: true },
        });
        visitors = new Set(plays.map((p) => p.visitorId)).size;
        conversions = plays.filter((p) => p.resultType === "WIN").length;
      }
      return {
        ...funnel,
        campaign,
        visitors,
        conversions,
        conversionRate: visitors > 0 ? (conversions / visitors) * 100 : null,
      };
    }),
  );

  const view = searchParams.view === "cards" ? "cards" : "list";
  const isEmpty = funnelsWithStats.length === 0;
  const hasAnyFilter = Boolean(searchParams.clientId || searchParams.campaignId || searchParams.status || searchParams.q);

  return (
    <div className="space-y-6">
      <FunnelFilters clients={clients} campaigns={campaigns} />

      {isEmpty ? (
        <EmptyState
          icon={<Workflow className="h-12 w-12" />}
          title={hasAnyFilter ? "Nenhum funil encontrado" : "Crie seu primeiro funil"}
          description={
            hasAnyFilter
              ? "Nenhum funil corresponde aos filtros selecionados."
              : "Organize a jornada do seu cliente em etapas: landing page, raspadinha, oferta, checkout e muito mais."
          }
          action={
            !hasAnyFilter && (
              <Link href="/dashboard/funnels/new">
                <Button>Criar funil</Button>
              </Link>
            )
          }
        />
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funnelsWithStats.map((funnel) => (
            <Card key={funnel.id} variant="interactive" className="relative flex flex-col">
              <Link href={`/dashboard/funnels/${funnel.id}`} className="flex flex-col flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={statusVariant[funnel.status] ?? "neutral"}>{statusLabel[funnel.status] ?? funnel.status}</Badge>
                  <span className="text-xs text-foreground-muted">{formatDate(funnel.updatedAt)}</span>
                </div>
                <h3 className="font-semibold text-foreground text-lg truncate" title={funnel.name}>{funnel.name}</h3>
                <p className="text-sm text-foreground-secondary truncate">
                  {funnel.client.name}{funnel.campaign ? ` · ${funnel.campaign.name}` : ""}
                </p>
                <p className="text-sm text-foreground-secondary line-clamp-2 mt-2 flex-1">
                  {funnel.description || "Sem descrição."}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm">
                  <span className="text-foreground-secondary">{funnel._count.steps} etapa{funnel._count.steps === 1 ? "" : "s"}</span>
                  <span className="text-foreground-secondary">{funnel.conversionRate !== null ? `${funnel.conversionRate.toFixed(1)}% conv.` : "Sem dados"}</span>
                </div>
              </Link>
              <div className="absolute top-4 right-4">
                <FunnelRowMenu
                  funnelId={funnel.id}
                  status={funnel.status}
                  previewHref={funnel.campaign ? `/dashboard/clients/${funnel.client.id}/campaigns/${funnel.campaign.id}/preview` : null}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-foreground-muted">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Campanha</th>
                <th className="px-4 py-3 font-medium text-center">Etapas</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Visitantes</th>
                <th className="px-4 py-3 font-medium text-right">Conversões</th>
                <th className="px-4 py-3 font-medium text-right">Taxa</th>
                <th className="px-4 py-3 font-medium">Atualizado</th>
                <th className="px-4 py-3 font-medium w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {funnelsWithStats.map((funnel) => (
                <tr key={funnel.id} className="hover:bg-surface-elevated transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/funnels/${funnel.id}`} className="font-medium text-foreground hover:text-primary">
                      {funnel.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground-secondary">{funnel.client.name}</td>
                  <td className="px-4 py-3 text-foreground-secondary">{funnel.campaign?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-center text-foreground-secondary">{funnel._count.steps}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[funnel.status] ?? "neutral"}>{statusLabel[funnel.status] ?? funnel.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground-secondary">{funnel.visitors}</td>
                  <td className="px-4 py-3 text-right text-foreground-secondary">{funnel.conversions}</td>
                  <td className="px-4 py-3 text-right text-foreground-secondary">
                    {funnel.conversionRate !== null ? `${funnel.conversionRate.toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">{formatDate(funnel.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <FunnelRowMenu
                      funnelId={funnel.id}
                      status={funnel.status}
                      previewHref={funnel.campaign ? `/dashboard/clients/${funnel.client.id}/campaigns/${funnel.campaign.id}/preview` : null}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export default async function FunnelsPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; campaignId?: string; status?: string; q?: string; view?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funis"
        description="Crie, conecte e acompanhe toda a jornada de conversão."
        actions={
          <Link href="/dashboard/funnels/new">
            <Button><Plus className="w-4 h-4 mr-2" /> Novo funil</Button>
          </Link>
        }
      />

      <Suspense fallback={<div className="text-foreground-muted text-sm">Carregando funis...</div>}>
        <FunnelsList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}
