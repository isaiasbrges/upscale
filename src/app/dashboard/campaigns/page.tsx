import { PageHeader } from "@/design-system/components/page-header";
import { EmptyState } from "@/design-system/components/empty-state";
import { Megaphone, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export default async function CampanhasPage() {
  const user = await requireUser();
  const campaigns = await prisma.campaign.findMany({
    where: { client: { members: { some: { userId: user.id } } } },
    include: { client: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campanhas"
        actions={<Button><Plus className="w-4 h-4 mr-2" /> Nova Campanha</Button>}
      />
      
      {campaigns.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-12 w-12" />}
          title="Nenhuma campanha encontrada"
          description="Você ainda não possui nenhuma campanha cadastrada."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant={
                      campaign.status === "PUBLISHED" ? "success" : 
                      campaign.status === "DRAFT" ? "neutral" : 
                      "danger"
                    }
                  >
                    {campaign.status}
                  </Badge>
                  <span className="text-xs text-foreground-secondary">
                    {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <CardTitle className="truncate" title={campaign.name}>{campaign.name}</CardTitle>
                <CardDescription className="truncate" title={campaign.client.name}>
                  Cliente: {campaign.client.name}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
