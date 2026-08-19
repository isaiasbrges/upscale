"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ClientOption = { id: string; name: string };
type CampaignOption = { id: string; name: string; clientId: string };

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "DRAFT", label: "Rascunho" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "ARCHIVED", label: "Arquivado" },
];

export function FunnelFilters({
  clients,
  campaigns,
}: {
  clients: ClientOption[];
  campaigns: CampaignOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const clientId = searchParams.get("clientId") ?? "";
  const campaignId = searchParams.get("campaignId") ?? "";
  const status = searchParams.get("status") ?? "";
  const view = searchParams.get("view") ?? "list";

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const filteredCampaigns = clientId ? campaigns.filter((c) => c.clientId === clientId) : campaigns;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative w-full sm:w-56">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParams({ q: search });
          }}
          onBlur={() => updateParams({ q: search })}
          placeholder="Buscar funil..."
          className="pl-9"
        />
      </div>

      <select
        value={clientId}
        onChange={(e) => updateParams({ clientId: e.target.value, campaignId: "" })}
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(24,60,202,.15)]"
      >
        <option value="">Todos os clientes</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={campaignId}
        onChange={(e) => updateParams({ campaignId: e.target.value })}
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(24,60,202,.15)]"
      >
        <option value="">Todas as campanhas</option>
        {filteredCampaigns.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => updateParams({ status: e.target.value })}
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[rgba(24,60,202,.15)]"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1 ml-auto">
        <button
          type="button"
          onClick={() => updateParams({ view: "list" })}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === "list" ? "bg-primary text-background" : "text-foreground-secondary hover:text-foreground"}`}
        >
          Lista
        </button>
        <button
          type="button"
          onClick={() => updateParams({ view: "cards" })}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${view === "cards" ? "bg-primary text-background" : "text-foreground-secondary hover:text-foreground"}`}
        >
          Cards
        </button>
      </div>
    </div>
  );
}
