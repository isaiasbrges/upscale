"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Panel, PanelContent, PanelFooter, PanelHeader } from "@/design-system/components/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateFunnelAction, deleteFunnelAction, type FunnelActionState } from "@/actions/funnels";
import { getCampaignsByClient } from "@/app/dashboard/scratch-cards/actions";

const initialState: FunnelActionState = {};

export function FunnelSettingsForm({
  funnel,
}: {
  funnel: {
    id: string;
    name: string;
    description: string | null;
    clientId: string;
    campaignId: string | null;
  };
}) {
  const router = useRouter();
  const updateAction = updateFunnelAction.bind(null, funnel.id);
  const [state, formAction, pending] = useActionState<FunnelActionState, FormData>(updateAction, initialState);
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getCampaignsByClient(funnel.clientId).then(setCampaigns);
  }, [funnel.clientId]);

  async function handleDelete() {
    if (!window.confirm(`Excluir o funil "${funnel.name}"? Todas as etapas serão removidas. Essa ação não pode ser desfeita.`)) return;
    setDeleting(true);
    try {
      await deleteFunnelAction(funnel.id);
      router.push("/dashboard/funnels");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <form action={formAction}>
        <Panel>
          <PanelHeader>
            <h3 className="font-semibold text-foreground">Informações do funil</h3>
          </PanelHeader>
          <PanelContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do funil</Label>
              <Input id="name" name="name" defaultValue={funnel.name} required />
              {state.fieldErrors?.name && <p className="text-xs text-danger">{state.fieldErrors.name[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" defaultValue={funnel.description ?? ""} />
              {state.fieldErrors?.description && <p className="text-xs text-danger">{state.fieldErrors.description[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignId">Campanha vinculada</Label>
              <select
                id="campaignId"
                name="campaignId"
                defaultValue={funnel.campaignId ?? ""}
                className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(24,60,202,.15)]"
              >
                <option value="">Nenhuma</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {state.error && <p className="text-xs text-danger">{state.error}</p>}
            </div>
          </PanelContent>
          <PanelFooter className="justify-end">
            <Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Salvar alterações"}</Button>
          </PanelFooter>
        </Panel>
      </form>

      <Panel>
        <PanelHeader>
          <h3 className="font-semibold text-danger">Zona de risco</h3>
        </PanelHeader>
        <PanelContent className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground">Excluir este funil</p>
            <p className="text-xs text-foreground-muted">Remove o funil e todas as suas etapas permanentemente.</p>
          </div>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Excluindo..." : "Excluir funil"}
          </Button>
        </PanelContent>
      </Panel>
    </div>
  );
}
