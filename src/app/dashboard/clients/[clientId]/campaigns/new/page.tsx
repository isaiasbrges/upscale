import Link from "next/link";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/design-system/components/page-header";
import { ChevronLeft } from "lucide-react";

export default async function NewCampaignPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Nova campanha"
        description="Configure os detalhes básicos da sua nova campanha gamificada."
        breadcrumb={
          <Link href={`/dashboard/clients/${clientId}`} className="flex items-center text-foreground-muted hover:text-foreground hover:underline transition-colors w-fit">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para o cliente
          </Link>
        }
      />
      <CampaignForm clientId={clientId} mode="create" />
    </div>
  );
}
