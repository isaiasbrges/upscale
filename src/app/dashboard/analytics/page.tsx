import { PageHeader } from "@/design-system/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/design-system/components/card";
import { Users, LayoutTemplate, BarChart3, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function AnalyticsPage() {
  const user = await requireUser();
  const accessible = { client: { members: { some: { userId: user.id } } } };
  const [totalClients, totalCampaigns] = await Promise.all([
    prisma.client.count({ where: { members: { some: { userId: user.id } } } }),
    prisma.campaign.count({ where: accessible })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Visão geral do desempenho e conversão da sua operação."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">
              Total de Clientes
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClients}</div>
            <p className="text-xs text-foreground-secondary mt-1">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">
              Total de Campanhas
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutTemplate className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-foreground-secondary mt-1">
              Campanhas ativas e inativas
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">
              Visualizações
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.5K</div>
            <p className="text-xs text-foreground-secondary mt-1">
              +14% neste mês
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground-secondary">
              Taxa de Conversão
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2%</div>
            <p className="text-xs text-foreground-secondary mt-1">
              Média geral do sistema
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4" variant="default">
          <CardHeader>
            <CardTitle>Desempenho Geral</CardTitle>
            <CardDescription>Gráfico de visualizações vs. conversões nos últimos 30 dias.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-[350px] items-center justify-center text-foreground-secondary border-t border-border mt-2 pt-6">
            [Gráfico Mockado - Área de Visualização]
          </CardContent>
        </Card>

        <Card className="col-span-3" variant="default">
          <CardHeader>
            <CardTitle>Campanhas Recentes</CardTitle>
            <CardDescription>Atividade mais recente nas suas campanhas.</CardDescription>
          </CardHeader>
          <CardContent className="border-t border-border mt-2 pt-6 flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
                  <LayoutTemplate className="h-5 w-5 text-foreground-secondary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Campanha de Vendas {i}</p>
                  <p className="text-sm text-foreground-secondary">Atualizada há {i * 2} horas</p>
                </div>
                <div className="font-medium text-sm text-primary">+{(i * 123)} views</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
