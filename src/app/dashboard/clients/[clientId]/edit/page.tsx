import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteClientAction } from "@/actions/clients";
import { ClientForm } from "@/components/clients/client-form";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/design-system/components/page-header";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Panel, PanelContent } from "@/design-system/components/panel";

export default async function EditClientPage({
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
  });

  if (!client) notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Configurações do cliente"
        description={`Gerencie os dados e integrações da conta "${client.name}".`}
        breadcrumb={
          <Link href={`/dashboard/clients/${clientId}`} className="flex items-center text-foreground-muted hover:text-foreground hover:underline transition-colors w-fit">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para o cliente
          </Link>
        }
      />

      <ClientForm
        mode="edit"
        clientId={clientId}
        defaultValues={{
          name: client.name,
          slug: client.slug,
          logoUrl: client.logoUrl,
        }}
      />

      {/* Zona de Perigo */}
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-danger mb-4">Zona de perigo</h3>
        <Panel className="border-danger/20">
          <PanelContent className="flex items-center justify-between p-6">
            <div>
              <h4 className="font-medium text-foreground">Excluir este cliente</h4>
              <p className="text-sm text-foreground-muted mt-1">
                Uma vez excluído, você não poderá desfazer essa ação. Todas as campanhas serão perdidas.
              </p>
            </div>
            <form action={deleteClientAction.bind(null, clientId)}>
              <Button type="submit" variant="danger">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir permanentemente
              </Button>
            </form>
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
}
