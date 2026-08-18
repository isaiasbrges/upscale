import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCampaignAction } from "@/actions/campaigns";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/design-system/components/page-header";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Panel, PanelContent } from "@/design-system/components/panel";

export default async function EditCampaignPage({
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
  });

  if (!campaign) notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Configurações da campanha"
        description={`Atualize as configurações da campanha "${campaign.name}".`}
        breadcrumb={
          <Link
            href={`/dashboard/clients/${clientId}/campaigns/${campaignId}`}
            className="flex items-center text-foreground-muted hover:text-foreground hover:underline transition-colors w-fit"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para a campanha
          </Link>
        }
      />

      <CampaignForm
        clientId={clientId}
        mode="edit"
        campaignId={campaignId}
        defaultValues={{
          name: campaign.name,
          slug: campaign.slug,
        }}
      />

      {/* Zona de Perigo */}
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-danger mb-4">Zona de perigo</h3>
        <Panel className="border-danger/20">
          <PanelContent className="flex items-center justify-between p-6">
            <div>
              <h4 className="font-medium text-foreground">Excluir esta campanha</h4>
              <p className="text-sm text-foreground-muted mt-1">
                Ação irreversível. A página será apagada e o link desativado permanentemente.
              </p>
            </div>
            <form action={deleteCampaignAction.bind(null, clientId, campaignId)}>
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
