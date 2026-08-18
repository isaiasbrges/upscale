import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { ChevronLeft, Plus, Settings, Megaphone, Tag, Pencil, Trash2 } from "lucide-react";
import { EmptyState } from "@/design-system/components/empty-state";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { deleteScratchCardAction } from "@/actions/scratch-cards";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const user = await requireUser();

  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      members: { some: { userId: user.id } },
    },
    include: {
      campaigns: { orderBy: { createdAt: "desc" } },
      scratchCards: { include: { campaign: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={client.name}
        description={`Slug: /${client.slug}`}
        breadcrumb={
          <Link href="/dashboard/clients" className="flex items-center text-foreground-muted hover:text-foreground hover:underline transition-colors w-fit">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para clientes
          </Link>
        }
        actions={
          <>
            <Link href={`/dashboard/clients/${clientId}/edit`}>
              <Button variant="secondary">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </Link>
            <Link href={`/dashboard/clients/${clientId}/campaigns/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova campanha
              </Button>
            </Link>
          </>
        }
      />

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">Campanhas Ativas</h3>
        {client.campaigns.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="h-12 w-12" />}
            title="Nenhuma campanha encontrada"
            description="Este cliente ainda não possui campanhas. Crie a primeira para começar a construir landing pages e funis."
            action={
              <Link href={`/dashboard/clients/${clientId}/campaigns/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira campanha
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {client.campaigns.map((campaign) => (
              <Link key={campaign.id} href={`/dashboard/clients/${clientId}/campaigns/${campaign.id}`}>
                <Card variant="interactive" className="p-5 flex flex-col h-full relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-md">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <Badge variant={campaign.status === "PUBLISHED" ? "success" : "neutral"}>
                      {campaign.status === "PUBLISHED" ? "Publicada" : "Rascunho"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg leading-tight mb-1">{campaign.name}</h4>
                    <p className="text-sm text-foreground-muted">/{campaign.slug}</p>
                  </div>
                  {/* Faux active bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-foreground">Raspadinhas</h3>
        {client.scratchCards.length === 0 ? (
          <EmptyState
            icon={<Tag className="h-12 w-12" />}
            title="Nenhuma raspadinha"
            description="Este cliente ainda não possui raspadinhas."
            action={
              <Link href={`/dashboard/scratch-cards/new?clientId=${clientId}`}>
                <Button>Criar raspadinha</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {client.scratchCards.map((card) => (
              <Card key={card.id} className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">{card.name}</h3>
                  <div className="flex gap-2 text-sm text-foreground-secondary mt-2">
                    <Badge variant="neutral">Campanha: {card.campaign.name}</Badge>
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
