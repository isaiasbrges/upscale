"use client";

import { useState } from "react";
import { createPrize, updatePrize } from "@/actions/prize";
import { useRouter, usePathname } from "next/navigation";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";

export default function PrizeForm({ campaignId, initialData }: { campaignId: string, initialData?: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
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
    };

    if (initialData) {
      await updatePrize(initialData.id, data);
      router.push(pathname); // Removes query params
    } else {
      await createPrize(campaignId, data);
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
    router.refresh();
  }

  return (
    <form key={initialData?.id || "new"} onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-lg shadow-sm border border-border">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Nome do Prêmio *</label>
        <input required type="text" name="name" defaultValue={initialData?.name} className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-1 focus:ring-primary focus:outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Descrição</label>
        <textarea name="description" defaultValue={initialData?.description} className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-1 focus:ring-primary focus:outline-none"></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Probabilidade (0 a 1) *</label>
          <input required type="number" step="0.0001" min="0" max="1" name="probability" defaultValue={initialData?.probability ?? "0.01"} className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-1 focus:ring-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Quantidade Total *</label>
          <input required type="number" min="1" name="quantity" defaultValue={initialData?.quantity ?? "1"} className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-1 focus:ring-primary focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2 text-foreground">Ícone (Selecione)</label>
          <IconPicker name="icon" value={initialData?.icon} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1 text-foreground">URL da Imagem (Opcional)</label>
          <input type="url" name="imageUrl" defaultValue={initialData?.imageUrl} className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-1 focus:ring-primary focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Texto do Botão (CTA)</label>
          <input type="text" name="ctaText" defaultValue={initialData?.ctaText} className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-1 focus:ring-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">URL de Redirecionamento</label>
          <input type="url" name="redirectUrl" defaultValue={initialData?.redirectUrl} className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-1 focus:ring-primary focus:outline-none" />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input type="checkbox" id="active" name="active" defaultChecked={initialData ? initialData.active : true} className="w-4 h-4 rounded text-primary focus:ring-primary" />
        <label htmlFor="active" className="text-sm font-medium text-foreground">Prêmio Ativo</label>
      </div>

      <div className="pt-2 flex gap-2">
        {initialData && (
          <Button variant="secondary" type="button" onClick={() => router.push(pathname)} className="w-full">
            Cancelar
          </Button>
        )}
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Salvando..." : (initialData ? "Atualizar Prêmio" : "Salvar Prêmio")}
        </Button>
      </div>
    </form>
  );
}
