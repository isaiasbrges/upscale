import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { EmptyState } from "@/design-system/components/empty-state";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Plus, Users } from "lucide-react";

export default async function ClientsPage() {
  const user = await requireUser();

  const clients = await prisma.client.findMany({
    where: { members: { some: { userId: user.id } } },
    orderBy: { createdAt: "desc" },
    include: { campaigns: { select: { id: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes e campanhas ativas."
        actions={
          <Link href="/dashboard/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo cliente
            </Button>
          </Link>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="Nenhum cliente cadastrado"
          description="Crie seu primeiro cliente para começar a organizar suas campanhas e funis de vendas."
          action={
            <Link href="/dashboard/clients/new">
              <Button>Criar primeiro cliente</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <Card variant="interactive" className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-lg mb-1">{client.name}</h3>
                  <p className="truncate text-sm text-foreground-secondary">{client.slug}</p>
                </div>
                <div className="text-left sm:text-right">
                  <Badge variant="neutral">
                    {client.campaigns.length} {client.campaigns.length === 1 ? 'campanha' : 'campanhas'}
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
