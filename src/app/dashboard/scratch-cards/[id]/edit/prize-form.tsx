"use client";

import { useState } from "react";
import { createPrize, updatePrize } from "@/actions/prize";
import { useRouter } from "next/navigation";
import { IconPicker } from "@/app/dashboard/clients/[clientId]/campaigns/[campaignId]/prizes/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ScratchPrizeForm({
  campaignId,
  scratchCardId,
  initialData,
  onCancel
}: {
  campaignId: string;
  scratchCardId: string;
  initialData?: any;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      icon: formData.get("icon") as string,
      value: formData.get("value") as string,
      probability: formData.get("probability") as string,
      quantity: formData.get("quantity") as string,
      active: formData.get("active") === "on",
      ctaText: formData.get("ctaText") as string,
      redirectUrl: formData.get("redirectUrl") as string,
      scratchCardId,
    };

    const result = initialData
      ? await updatePrize(initialData.id, data)
      : await createPrize(campaignId, data);

    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.error ?? (result.fieldErrors ? "Verifique os dados informados e tente novamente." : null));
      setLoading(false);
      return;
    }

    if (initialData) {
      if (onCancel) onCancel();
    } else {
      (e.target as HTMLFormElement).reset();
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <form key={initialData?.id || "new"} onSubmit={handleSubmit} className="space-y-4 bg-surface p-4 rounded-lg shadow-sm border border-border">
      <h3 className="text-md font-semibold">{initialData ? "Editar Prêmio" : "Novo Prêmio"}</h3>
      <div>
        <Label htmlFor="name">Nome do Prêmio *</Label>
        <Input required type="text" id="name" name="name" defaultValue={initialData?.name} />
        {fieldErrors.name?.[0] && <p className="text-xs text-danger mt-1">{fieldErrors.name[0]}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" defaultValue={initialData?.description} />
        {fieldErrors.description?.[0] && <p className="text-xs text-danger mt-1">{fieldErrors.description[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="probability">Probabilidade (0 a 1) *</Label>
          <Input required type="number" step="0.0001" min="0" max="1" id="probability" name="probability" defaultValue={initialData?.probability ?? "0.01"} />
          {fieldErrors.probability?.[0] && <p className="text-xs text-danger mt-1">{fieldErrors.probability[0]}</p>}
        </div>
        <div>
          <Label htmlFor="quantity">Quantidade Total *</Label>
          <Input required type="number" min="1" id="quantity" name="quantity" defaultValue={initialData?.quantity ?? "1"} />
          {fieldErrors.quantity?.[0] && <p className="text-xs text-danger mt-1">{fieldErrors.quantity[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Ícone (Selecione)</Label>
          <IconPicker name="icon" value={initialData?.icon} />
        </div>
        <div className="col-span-2">
          <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
          <Input type="url" id="imageUrl" name="imageUrl" defaultValue={initialData?.imageUrl} />
          {fieldErrors.imageUrl?.[0] && <p className="text-xs text-danger mt-1">{fieldErrors.imageUrl[0]}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input type="checkbox" id="active" name="active" defaultChecked={initialData ? initialData.active : true} className="w-4 h-4 rounded text-primary focus:ring-primary" />
        <Label htmlFor="active" className="mb-0">Prêmio Ativo</Label>
      </div>

      {formError && (
        <div className="p-3 bg-danger/10 border border-danger/20 rounded-md">
          <p className="text-sm text-danger font-medium">{formError}</p>
        </div>
      )}

      <div className="pt-2 flex gap-2">
        {initialData && (
          <Button variant="secondary" type="button" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
        )}
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Salvando..." : (initialData ? "Atualizar Prêmio" : "Criar Prêmio")}
        </Button>
      </div>
    </form>
  );
}
