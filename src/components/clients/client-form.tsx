"use client";

import { useActionState } from "react";
import {
  createClientAction,
  updateClientAction,
  type ClientActionState,
} from "@/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, PanelContent, PanelFooter, PanelHeader } from "@/design-system/components/panel";
import { slugify } from "@/lib/utils";

type ClientFormProps = {
  mode: "create" | "edit";
  clientId?: string;
  defaultValues?: {
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
};

export function ClientForm({ mode, clientId, defaultValues }: ClientFormProps) {
  const action =
    mode === "create"
      ? createClientAction
      : updateClientAction.bind(null, clientId!);

  const [state, formAction, pending] = useActionState<
    ClientActionState,
    FormData
  >(action, {});

  return (
    <form action={formAction} className="w-full max-w-2xl">
      <Panel>
        <PanelHeader>
          <h3 className="font-semibold text-foreground">
            {mode === "create" ? "Informações do Cliente" : "Editar Informações"}
          </h3>
        </PanelHeader>
        
        <PanelContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do cliente</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={defaultValues?.name}
              placeholder="Ex: UpScale Digital"
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
              placeholder="ex-upscale-digital"
              onInput={(e) => {
                (e.target as HTMLInputElement).dataset.edited = "true";
              }}
            />
            {state.fieldErrors?.slug && (
              <p className="text-xs text-danger">{state.fieldErrors.slug[0]}</p>
            )}
            <p className="text-xs text-foreground-muted">Este identificador será usado na URL das campanhas e funis.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logotipo (URL Opcional)</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={defaultValues?.logoUrl ?? ""}
              placeholder="https://..."
            />
            {state.fieldErrors?.logoUrl && (
              <p className="text-xs text-danger">{state.fieldErrors.logoUrl[0]}</p>
            )}
          </div>

          {state.error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-md">
              <p className="text-sm text-danger font-medium">{state.error}</p>
            </div>
          )}
        </PanelContent>

        <PanelFooter className="justify-end gap-3">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Salvando..."
              : mode === "create"
                ? "Criar cliente"
                : "Salvar alterações"}
          </Button>
        </PanelFooter>
      </Panel>
    </form>
  );
}
