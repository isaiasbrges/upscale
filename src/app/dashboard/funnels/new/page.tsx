"use client";

import { useActionState, useEffect, useState } from "react";
import { PageHeader } from "@/design-system/components/page-header";
import { Panel, PanelContent, PanelFooter, PanelHeader } from "@/design-system/components/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFunnelAction, type FunnelActionState } from "@/actions/funnels";
import { getClients, getCampaignsByClient } from "../../scratch-cards/actions";

const initialState: FunnelActionState = {};

export default function NewFunnelPage() {
  const [state, formAction, pending] = useActionState<FunnelActionState, FormData>(createFunnelAction, initialState);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  useEffect(() => {
    if (clientId) {
      getCampaignsByClient(clientId).then(setCampaigns);
    } else {
      setCampaigns([]);
    }
  }, [clientId]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-8">
      <PageHeader
        title="Novo funil"
        description="Crie um funil e conecte-o a um cliente e, opcionalmente, a uma campanha."
      />

      <form action={formAction}>
        <Panel>
          <PanelHeader>
            <h3 className="font-semibold text-foreground">Informações do funil</h3>
          </PanelHeader>

          <PanelContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do funil</Label>
              <Input id="name" name="name" required placeholder="Ex: Funil Black Friday" />
              {state.fieldErrors?.name && (
                <p className="text-xs text-danger">{state.fieldErrors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea id="description" name="description" placeholder="Sobre o que é esse funil?" />
              {state.fieldErrors?.description && (
                <p className="text-xs text-danger">{state.fieldErrors.description[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <select
                id="clientId"
                name="clientId"
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(24,60,202,.15)]"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {state.fieldErrors?.clientId && (
                <p className="text-xs text-danger">{state.fieldErrors.clientId[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignId">Campanha (opcional)</Label>
              <select
                id="campaignId"
                name="campaignId"
                disabled={!clientId}
                className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(24,60,202,.15)] disabled:opacity-50"
              >
                <option value="">Sem campanha vinculada por enquanto</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <p className="text-xs text-foreground-muted">Você pode conectar uma campanha depois, nas configurações do funil.</p>
            </div>

            {state.error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-md">
                <p className="text-sm text-danger font-medium">{state.error}</p>
              </div>
            )}
          </PanelContent>

          <PanelFooter className="justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Criando..." : "Criar funil"}
            </Button>
          </PanelFooter>
        </Panel>
      </form>
    </div>
  );
}
