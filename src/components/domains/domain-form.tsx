"use client";
import { useActionState } from "react";
import { createDomainAction, type DomainActionState } from "@/actions/domains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type ClientOption = { id: string; name: string; campaigns: { id: string; name: string }[] };
export function DomainForm({ clients }: { clients: ClientOption[] }) {
  const [state, action, pending] = useActionState<DomainActionState, FormData>(createDomainAction, {});
  return <form action={action} className="grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end">
    <div className="space-y-2"><Label htmlFor="hostname">Domínio personalizado</Label><Input id="hostname" name="hostname" placeholder="oferta.seucliente.com.br" required /></div>
    <div className="space-y-2"><Label htmlFor="clientId">Cliente</Label><select id="clientId" name="clientId" required className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"><option value="">Selecione</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
    <div className="space-y-2"><Label htmlFor="campaignId">Campanha inicial</Label><select id="campaignId" name="campaignId" className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"><option value="">Primeira publicada</option>{clients.map(c=><optgroup key={c.id} label={c.name}>{c.campaigns.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</optgroup>)}</select></div>
    <Button type="submit" disabled={pending}>{pending ? "Conectando..." : "Conectar domínio"}</Button>
    {(state.error || state.success) && <p className={`text-sm sm:col-span-2 lg:col-span-4 ${state.error ? "text-danger" : "text-success"}`}>{state.error || state.success}</p>}
  </form>;
}
