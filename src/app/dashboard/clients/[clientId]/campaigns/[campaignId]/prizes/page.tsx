import { prisma } from "@/lib/prisma";
import PrizeForm from "./PrizeForm";
import { deletePrize } from "@/actions/prize";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { getPrizeIcon } from "@/components/prizes/prize-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/design-system/components/badge";
import { PageHeader } from "@/design-system/components/page-header";
import { requireUser } from "@/lib/auth";
import { requireCampaignAccess } from "@/lib/access-control";

export default async function PrizesPage({ params, searchParams }: { params: Promise<{ clientId: string, campaignId: string }>, searchParams: Promise<{ edit?: string }> }) {
  const user = await requireUser();
  const { clientId, campaignId } = await params;
  const query = await searchParams;
  const campaign = await requireCampaignAccess(user.id, campaignId);
  if (campaign.clientId !== clientId) throw new Error("Campanha não encontrada");
  const prizes = await prisma.prize.findMany({
    where: { campaignId },
    orderBy: { createdAt: "desc" }
  });
  const prizeToEdit = query.edit ? prizes.find(p => p.id === query.edit) : null;

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Gerenciar Prêmios da Campanha" 
        description="Adicione, edite e acompanhe o estoque de prêmios desta campanha." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <h2 className="text-xl font-semibold mb-4 text-foreground">{prizeToEdit ? "Editar Prêmio" : "Novo Prêmio"}</h2>
          <PrizeForm campaignId={campaignId} initialData={prizeToEdit} />
        </div>
        
        <div className="lg:col-span-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Prêmios Cadastrados</h2>
          {prizes.length === 0 && <p className="text-foreground-secondary">Nenhum prêmio cadastrado nesta campanha.</p>}
          <ul className="space-y-4">
            {prizes.map((prize) => {
              const IconComponent = getPrizeIcon(prize.icon);
              
              return (
                <li key={prize.id} className="border border-border p-5 rounded-xl bg-surface shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="h-12 w-12 rounded-lg bg-[rgba(24,60,202,.1)] flex items-center justify-center shrink-0">
                        {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-foreground">{prize.name}</h3>
                          <Badge variant={prize.active ? "success" : "neutral"}>
                            {prize.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground-secondary mt-1">{prize.description || "Nenhuma descrição."}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/clients/${clientId}/campaigns/${campaignId}/prizes?edit=${prize.id}`}>
                        <Button variant="secondary" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deletePrize(prize.id);
                      }}>
                        <Button variant="danger" size="sm" type="submit">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-background border border-border p-3 rounded-lg mt-2">
                    <div><span className="text-foreground-muted block text-xs">Probabilidade</span> <b className="text-foreground">{prize.probability.toFixed(2)}%</b></div>
                    <div><span className="text-foreground-muted block text-xs">Estoque</span> <b className="text-foreground">{prize.quantity - prize.quantityUsed} rest.</b></div>
                    <div><span className="text-foreground-muted block text-xs">Qtd Inicial</span> <b className="text-foreground">{prize.quantity}</b></div>
                    <div><span className="text-foreground-muted block text-xs">Resgatados</span> <b className="text-foreground">{prize.quantityUsed}</b></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
