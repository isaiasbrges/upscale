import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Users, Megaphone, Activity } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();

  const clientCount = await prisma.clientMember.count({
    where: { userId: user.id },
  });

  const campaignCount = await prisma.campaign.count({
    where: {
      client: {
        members: { some: { userId: user.id } },
      },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo de volta, ${user.name ?? user.email}`}
        actions={
          <div className="flex gap-3">
            <Link href="/dashboard/clients/new">
              <Button variant="secondary">Novo cliente</Button>
            </Link>
            <Link href="/dashboard/clients">
              <Button>Ver clientes</Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 text-foreground-secondary mb-3">
            <Users className="h-5 w-5" />
            <h3 className="font-medium">Clientes</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{clientCount}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 text-foreground-secondary mb-3">
            <Megaphone className="h-5 w-5" />
            <h3 className="font-medium">Campanhas Ativas</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{campaignCount}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 text-foreground-secondary mb-3">
            <Activity className="h-5 w-5" />
            <h3 className="font-medium">Status do Sistema</h3>
          </div>
          <div className="mt-1">
            <Badge variant="info">Operacional</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
