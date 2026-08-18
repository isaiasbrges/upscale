import { PageHeader } from "@/design-system/components/page-header";
import { EmptyState } from "@/design-system/components/empty-state";
import { Filter, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/design-system/components/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export default async function FunnelsPage() {
  const user = await requireUser();
  const funnels = await prisma.funnel.findMany({
    where: { client: { members: { some: { userId: user.id } } } },
    include: { client: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Funis"
        actions={<Button><Plus className="w-4 h-4 mr-2" /> Novo Funil</Button>}
      />

      {funnels.length === 0 ? (
        <EmptyState
          icon={<Filter className="h-12 w-12" />}
          title="Nenhum funil encontrado"
          description="Nenhum funil foi cadastrado no sistema ainda."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funnels.map((funnel) => (
            <Card key={funnel.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-foreground-secondary">
                    {new Date(funnel.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <CardTitle className="truncate" title={funnel.name}>{funnel.name}</CardTitle>
                <CardDescription className="truncate" title={funnel.client.name}>
                  Cliente: {funnel.client.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-secondary line-clamp-2">
                  {funnel.description || "Sem descrição."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
