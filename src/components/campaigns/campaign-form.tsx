"use client";

import Link from "next/link";

import { useActionState } from "react";
import {
  createCampaignAction,
  updateCampaignAction,
  type CampaignActionState,
} from "@/actions/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, PanelContent, PanelFooter, PanelHeader } from "@/design-system/components/panel";
import { slugify } from "@/lib/utils";

type CampaignFormProps = {
  clientId: string;
  mode: "create" | "edit";
  campaignId?: string;
  defaultValues?: {
    name: string;
    slug: string;
  };
};

export function CampaignForm({
  clientId,
  mode,
  campaignId,
  defaultValues,
}: CampaignFormProps) {
  const action =
    mode === "create"
      ? createCampaignAction.bind(null, clientId)
      : updateCampaignAction.bind(null, clientId, campaignId!);

  const [state, formAction, pending] = useActionState<
    CampaignActionState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="w-full max-w-2xl">
      <Panel>
        <PanelHeader>
          <h3 className="font-semibold text-foreground">
            {mode === "create" ? "Detalhes da Campanha" : "Editar Campanha"}
          </h3>
        </PanelHeader>

        <PanelContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da campanha</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={defaultValues?.name}
              placeholder="Ex: Oferta Especial Black Friday"
              onChange={(e) => {
                if (mode === "create") {
                  const slugInput = document.getElementById("slug") as HTMLInputElement;
                  if (slugInput && !slugInput.dataset.edited) {
                    slugInput.value = slugify(e.target.value);
                  }
                }
              }}
            />
            {state.fieldErrors?.name && (
              <p className="text-xs text-danger">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Identificador URL (Slug)</Label>
            <Input
              id="slug"
              name="slug"
              required
              defaultValue={defaultValues?.slug}
              placeholder="oferta-black-friday"
              onInput={(e) => {
                (e.target as HTMLInputElement).dataset.edited = "true";
              }}
            />
            {state.fieldErrors?.slug && (
              <p className="text-xs text-danger">{state.fieldErrors.slug[0]}</p>
            )}
            <p className="text-xs text-foreground-muted">Este identificador será o caminho da URL final da sua landing page.</p>
          </div>

          {state.error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-md">
              <p className="text-sm text-danger font-medium">{state.error}</p>
            </div>
          )}
        </PanelContent>

        <PanelFooter className="justify-end">
          {mode === "edit" && (
            <Link className="w-full sm:w-auto" href={`/dashboard/clients/${clientId}/campaigns/${campaignId}/prizes`}>
              <Button className="w-full" type="button" variant="secondary">Configurar prêmios</Button>
            </Link>
          )}
          <Button type="submit" disabled={pending}>
            {pending
              ? "Salvando..."
              : mode === "create"
                ? "Criar campanha"
                : "Salvar alterações"}
          </Button>
        </PanelFooter>
      </Panel>
    </form>
  );
}
