"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Ticket, CreditCard, Link2, PartyPopper, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/design-system/components/card";
import { addFunnelStepAction } from "@/actions/funnel-steps";
import type { FunnelStepType } from "@/lib/funnel-step-types";

const STEP_OPTIONS: { type: FunnelStepType; label: string; icon: typeof FileText; needsUrl?: boolean }[] = [
  { type: "PAGE", label: "Criar página", icon: FileText },
  { type: "SCRATCH_CARD", label: "Adicionar raspadinha", icon: Ticket },
  { type: "CHECKOUT", label: "Adicionar checkout", icon: CreditCard },
  { type: "EXTERNAL_URL", label: "Adicionar URL externa", icon: Link2, needsUrl: true },
  { type: "THANK_YOU", label: "Página de obrigado", icon: PartyPopper },
  { type: "REDIRECT", label: "Redirecionamento", icon: ArrowRightCircle, needsUrl: true },
];

export function AddStepMenu({ funnelId }: { funnelId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof STEP_OPTIONS[number] | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function reset() {
    setSelected(null);
    setName("");
    setUrl("");
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setPending(true);
    setError(null);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("type", selected.type);
    formData.set("externalUrl", url);
    const result = await addFunnelStepAction(funnelId, {}, formData);
    setPending(false);
    if (result.error || result.fieldErrors) {
      setError(result.error ?? result.fieldErrors?.name?.[0] ?? result.fieldErrors?.externalUrl?.[0] ?? "Não foi possível adicionar a etapa.");
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <Button type="button" onClick={() => setOpen((v) => !v)}>
        <Plus className="w-4 h-4 mr-2" /> Adicionar etapa
      </Button>

      {open && !selected && (
        <div className="absolute right-0 z-20 mt-1 w-64 rounded-md border border-border bg-surface-elevated shadow-floating py-1">
          {STEP_OPTIONS.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => setSelected(option)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-surface text-left"
            >
              <option.icon className="h-4 w-4 text-foreground-secondary" /> {option.label}
            </button>
          ))}
        </div>
      )}

      {open && selected && (
        <Card className="absolute right-0 z-20 mt-1 w-80 p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm font-medium text-foreground">{selected.label}</p>
            <div>
              <Label htmlFor="new-step-name">Nome da etapa</Label>
              <Input
                id="new-step-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selected.label}
                autoFocus
                required
              />
            </div>
            {selected.needsUrl && (
              <div>
                <Label htmlFor="new-step-url">URL de destino</Label>
                <Input
                  id="new-step-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>
            )}
            {error && <p className="text-xs text-danger">{error}</p>}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={reset}>Cancelar</Button>
              <Button type="submit" size="sm" disabled={pending || !name.trim()}>
                {pending ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
