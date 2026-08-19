import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFunnelStepsWithMetrics } from "@/lib/funnel-metrics";
import { PageHeader } from "@/design-system/components/page-header";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, Settings, Signal, BarChart3 } from "lucide-react";
import { FunnelMap } from "@/components/funnels/funnel-map";
import { FunnelStepsList } from "@/components/funnels/funnel-steps-list";
import { FunnelAnalytics } from "@/components/funnels/funnel-analytics";
import { FunnelSettingsForm } from "@/components/funnels/funnel-settings-form";
import { setFunnelStatusAction } from "@/actions/funnels";

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

const TABS = [
  { key: "mapa", label: "Mapa" },
  { key: "etapas", label: "Etapas" },
  { key: "analytics", label: "Analytics" },
  { key: "configuracoes", label: "Configurações" },
] as const;

export default async function FunnelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ funnelId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { funnelId } = await params;
  const { tab: rawTab } = await searchParams;
  const user = await requireUser();

  const funnel = await prisma.funnel.findFirst({
    where: { id: funnelId, client: { members: { some: { userId: user.id } } } },
    include: {
      client: { select: { id: true, name: true } },
      campaigns: { select: { id: true, name: true }, take: 1 },
      steps: { orderBy: { order: "asc" } },
    },
  });

  if (!funnel) notFound();

  const campaign = funnel.campaigns[0] ?? null;
  const stepsWithMetrics = await getFunnelStepsWithMetrics(funnel.steps);
  const activeTab = TABS.some((t) => t.key === rawTab) ? rawTab! : "mapa";

  return (
    <div className="space-y-6">
      <PageHeader
        title={funnel.name}
        description={`${funnel.client.name}${campaign ? ` · ${campaign.name}` : " · Sem campanha vinculada"}`}
        breadcrumb={
          <Link href="/dashboard/funnels" className="flex items-center text-foreground-muted hover:text-foreground hover:underline transition-colors w-fit">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para Funis
          </Link>
        }
        actions={
          <>
            <Badge variant={statusVariant[funnel.status] ?? "neutral"} className="self-center mr-1">
              {statusLabel[funnel.status] ?? funnel.status}
            </Badge>
            {campaign && (
              <Link href={`/dashboard/clients/${funnel.client.id}/campaigns/${campaign.id}/preview`} target="_blank">
                <Button variant="secondary"><Eye className="h-4 w-4 mr-2" />Preview</Button>
              </Link>
            )}
            <Link href={`/dashboard/funnels/${funnel.id}?tab=analytics`}>
              <Button variant="secondary"><BarChart3 className="h-4 w-4 mr-2" />Analytics</Button>
            </Link>
            <Link href={`/dashboard/funnels/${funnel.id}?tab=configuracoes`}>
              <Button variant="secondary"><Settings className="h-4 w-4 mr-2" />Configurações</Button>
            </Link>
            <form action={setFunnelStatusAction.bind(null, funnel.id, funnel.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")}>
              <Button type="submit" variant={funnel.status === "PUBLISHED" ? "danger" : "primary"}>
                <Signal className="h-4 w-4 mr-2" />{funnel.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
              </Button>
            </form>
          </>
        }
      />

      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/funnels/${funnel.id}?tab=${t.key}`}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {activeTab === "mapa" && <FunnelMap funnelId={funnel.id} steps={stepsWithMetrics} />}
      {activeTab === "etapas" && <FunnelStepsList funnelId={funnel.id} steps={funnel.steps} />}
      {activeTab === "analytics" && <FunnelAnalytics steps={stepsWithMetrics} />}
      {activeTab === "configuracoes" && (
        <FunnelSettingsForm
          funnel={{
            id: funnel.id,
            name: funnel.name,
            description: funnel.description,
            clientId: funnel.clientId,
            campaignId: campaign?.id ?? null,
          }}
        />
      )}
    </div>
  );
}
