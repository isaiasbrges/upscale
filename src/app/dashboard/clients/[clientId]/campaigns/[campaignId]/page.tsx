import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { ChevronLeft, Edit2, LayoutTemplate, Eye, Calendar, Signal, Plus, Tag, Pencil, Trash2 } from "lucide-react";
import { EmptyState } from "@/design-system/components/empty-state";
import { deleteScratchCardAction } from "@/actions/scratch-cards";
import { setCampaignPublishedAction } from "@/actions/campaigns";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ clientId: string; campaignId: string }>;
}) {
  const { clientId, campaignId } = await params;
  const user = await requireUser();

  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      clientId,
      client: { members: { some: { userId: user.id } } },
    },
    include: { client: true, scratchCards: { orderBy: { createdAt: "desc" } } },
  });

  if (!campaign) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={campaign.name}
        description={`https://${campaign.client.slug}.upscale.com/${campaign.slug}`}
        breadcrumb={
          <Link href={`/dashboard/clients/${clientId}`} className="flex items-center text-foreground-muted hover:text-foreground hover:underline transition-colors w-fit">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para {campaign.client.name}
          </Link>
        }
        actions={
          <>
            <form action={setCampaignPublishedAction.bind(null, clientId, campaignId, campaign.status !== "PUBLISHED")}>
              <Button type="submit" variant={campaign.status === "PUBLISHED" ? "danger" : "secondary"}>
                <Signal className="h-4 w-4 mr-2" />{campaign.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
              </Button>
            </form>
            <Link href={`/dashboard/clients/${clientId}/campaigns/${campaignId}/edit`}>
              <Button variant="secondary">
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Link href={`/dashboard/clients/${clientId}/campaigns/${campaignId}/preview`}>
              <Button variant="secondary">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Link href={`/dashboard/clients/${clientId}/campaigns/${campaignId}/builder`}>
              <Button>
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Abrir Builder
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Status Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-muted mb-1 flex items-center">
                <Signal className="h-4 w-4 mr-1.5" /> Estado Atual
              </p>
              <h3 className="text-xl font-bold text-foreground">Status</h3>
            </div>
            <Badge variant={campaign.status === "PUBLISHED" ? "success" : "neutral"} className="mt-1">
              {campaign.status === "PUBLISHED" ? "Publicada" : "Rascunho"}
            </Badge>
          </div>
        </Card>

        {/* Date Card */}
        <Card className="p-6">
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-sm font-medium text-foreground-muted mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" /> Histórico
              </p>
              <h3 className="text-xl font-bold text-foreground">Criada em</h3>
            </div>
            <p className="text-foreground-secondary mt-2">
              {campaign.createdAt.toLocaleDateString("pt-BR", {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">Raspadinhas</h3>
        {campaign.scratchCards.length === 0 ? (
          <EmptyState
            icon={<Tag className="h-12 w-12" />}
            title="Nenhuma raspadinha"
            description="Esta campanha ainda não possui raspadinhas."
            action={
              <Link href={`/dashboard/scratch-cards/new?clientId=${clientId}&campaignId=${campaignId}`}>
                <Button>Criar raspadinha</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {campaign.scratchCards.map((card) => (
              <Card key={card.id} className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">{card.name}</h3>
                  <div className="flex gap-2 text-sm text-foreground-secondary mt-2">
                    <Badge variant={card.status === "PUBLISHED" ? "success" : "warning"}>
                      {card.status === "PUBLISHED" ? "Publicado" : card.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/scratch-cards/${card.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <form action={deleteScratchCardAction.bind(null, card.id)}>
                    <Button variant="danger" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
