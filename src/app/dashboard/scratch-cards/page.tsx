import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { EmptyState } from "@/design-system/components/empty-state";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";
import { deleteScratchCardAction } from "@/actions/scratch-cards";

export default async function ScratchCardsPage() {
  const user = await requireUser();

  const scratchCards = await prisma.scratchCard.findMany({
    where: {
      client: {
        members: {
          some: { userId: user.id }
        }
      }
    },
    include: {
      client: true,
      campaign: true
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raspadinhas"
        description="Gerencie as raspadinhas globais das suas campanhas."
        actions={
          <Link href="/dashboard/scratch-cards/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Raspadinha
            </Button>
          </Link>
        }
      />

      {scratchCards.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-12 w-12" />}
          title="Nenhuma raspadinha encontrada"
          description="Crie sua primeira raspadinha para engajar seus clientes."
          action={
            <Link href="/dashboard/scratch-cards/new">
              <Button>Criar primeira raspadinha</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {scratchCards.map((card) => (
            <Card key={card.id} className="flex flex-col items-stretch justify-between gap-5 p-4 sm:p-6 lg:flex-row lg:items-center">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-lg mb-1">{card.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-foreground-secondary">
                  <Badge variant="neutral">Cliente: {card.client.name}</Badge>
                  <Badge variant="neutral">Campanha: {card.campaign.name}</Badge>
                  <Badge variant={card.status === "PUBLISHED" ? "success" : "warning"}>
                    {card.status === "PUBLISHED" ? "Publicado" : card.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <Link className="w-full" href={`/dashboard/scratch-cards/${card.id}/edit`}>
                  <Button className="w-full" variant="secondary" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <form action={deleteScratchCardAction.bind(null, card.id)}>
                  <Button className="w-full" variant="danger" size="sm">
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
  );
}
