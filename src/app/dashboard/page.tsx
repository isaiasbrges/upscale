import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { EmptyState } from "@/design-system/components/empty-state";
import { ClientFilter } from "@/components/dashboard/client-filter";
import {
  Users,
  Megaphone,
  Workflow,
  Ticket,
  Eye,
  Target,
  UserPlus,
  MousePointerClick,
  Percent,
  Activity,
  Clock,
} from "lucide-react";

function formatRelativeDate(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) return "agora mesmo";
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `há ${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `há ${diffDays}d`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const campaignStatusVariant: Record<string, "success" | "neutral"> = {
  PUBLISHED: "success",
  DRAFT: "neutral",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: requestedClientId } = await searchParams;
  const user = await requireUser();

  const clients = await prisma.client.findMany({
    where: { members: { some: { userId: user.id } } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Só aceita o filtro se o cliente pedido estiver na lista de clientes que
  // o usuário realmente tem acesso — evita vazar stats de outro cliente via URL.
  const selectedClientId =
    requestedClientId && clients.some((c) => c.id === requestedClientId) ? requestedClientId : null;

  const stats = await getDashboardStats(user.id, selectedClientId);

  const performanceCards = [
    { label: "Visitantes", value: stats.performance.visitors, icon: Eye },
    { label: "Conversões", value: stats.performance.conversions, icon: Target },
    { label: "Leads", value: stats.performance.leads, icon: UserPlus },
    { label: "Cliques", value: stats.performance.clicks, icon: MousePointerClick },
    {
      label: "Taxa de conversão",
      value: stats.performance.conversionRate,
      icon: Percent,
      isPercent: true,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo de volta, ${user.name ?? user.email}`}
        actions={
          <div className="flex gap-3">
            <ClientFilter clients={clients} selectedClientId={selectedClientId} />
            <Link href="/dashboard/clients/new">
              <Button variant="secondary">Novo cliente</Button>
            </Link>
            <Link href="/dashboard/funnels">
              <Button>Ver funis</Button>
            </Link>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 text-foreground-secondary mb-3">
            <Users className="h-5 w-5" />
            <h3 className="font-medium">Clientes</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.clientCount}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 text-foreground-secondary mb-3">
            <Megaphone className="h-5 w-5" />
            <h3 className="font-medium">Campanhas ativas</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.activeCampaignCount}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 text-foreground-secondary mb-3">
            <Workflow className="h-5 w-5" />
            <h3 className="font-medium">Funis publicados</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.publishedFunnelCount}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 text-foreground-secondary mb-3">
            <Ticket className="h-5 w-5" />
            <h3 className="font-medium">Raspadinhas ativas</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.activeScratchCardCount}</p>
        </Card>
      </div>

      {/* Performance */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Performance últimos 7 dias</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {performanceCards.map((item) => (
            <Card key={item.label} className="p-5">
              <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                <item.icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
              </div>
              {item.value === null ? (
                <p className="text-lg font-semibold text-foreground-muted">Sem dados</p>
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {item.isPercent ? `${item.value.toFixed(1)}%` : item.value}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Campanhas recentes */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-foreground mb-4">Campanhas recentes</h2>
          <Card>
            {stats.recentCampaigns.length === 0 ? (
              <EmptyState
                icon={<Megaphone className="h-10 w-10" />}
                title="Nenhuma campanha ainda"
                description="Crie sua primeira campanha para começar a acompanhar resultados."
                action={
                  <Link href="/dashboard/clients">
                    <Button>Ir para clientes</Button>
                  </Link>
                }
              />
            ) : (
              <div className="divide-y divide-border">
                {stats.recentCampaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/dashboard/clients/${campaign.clientId}/campaigns/${campaign.id}`}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-surface-elevated transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{campaign.name}</p>
                      <p className="text-sm text-foreground-secondary truncate">{campaign.clientName}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <Badge variant={campaignStatusVariant[campaign.status] ?? "neutral"}>
                        {campaign.status === "PUBLISHED" ? "Publicada" : "Rascunho"}
                      </Badge>
                      <span className="text-sm text-foreground-secondary w-20 text-right">
                        {campaign.conversions} conv.
                      </span>
                      <span className="text-xs text-foreground-muted w-16 text-right hidden sm:block">
                        {formatRelativeDate(campaign.updatedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Atividade recente */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Atividade recente</h2>
          <Card>
            {stats.activity.length === 0 ? (
              <EmptyState
                icon={<Activity className="h-10 w-10" />}
                title="Nenhuma atividade ainda"
                description="As últimas ações da sua operação vão aparecer aqui."
              />
            ) : (
              <ul className="divide-y divide-border">
                {stats.activity.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 p-4 hover:bg-surface-elevated transition-colors"
                    >
                      <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground">{item.label}</p>
                        <p className="text-xs text-foreground-muted mt-0.5">{formatRelativeDate(item.at)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
