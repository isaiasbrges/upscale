"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, CheckCircle2, Circle, Link2, ExternalLink, Copy, Check } from "lucide-react";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateFunnelStepAction,
  deleteFunnelStepAction,
  setFunnelStepStatusAction,
} from "@/actions/funnel-steps";
import { FUNNEL_STEP_TYPE_LABELS, isFunnelStepPubliclyResolvable, type FunnelStepType } from "@/lib/funnel-step-types";
import { FUNNEL_STEP_TYPE_ICONS } from "./step-icons";
import type { StepMetrics } from "@/lib/funnel-metrics";

export function FunnelStepCard({
  funnelId,
  clientId,
  campaignId,
  step,
}: {
  funnelId: string;
  clientId: string;
  campaignId: string | null;
  step: {
    id: string;
    name: string;
    type: string;
    status: string;
    config: unknown;
    pageId: string | null;
    scratchCardId: string | null;
    metrics: StepMetrics;
  };
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const type = step.type as FunnelStepType;
  const Icon = FUNNEL_STEP_TYPE_ICONS[type] ?? Link2;
  const isUrlType = type === "REDIRECT" || type === "EXTERNAL_URL";
  const currentUrl = isUrlType && step.config && typeof step.config === "object" && "url" in (step.config as any)
    ? (step.config as any).url
    : "";

  async function handleCopyLink() {
    const url = `${window.location.origin}/f/${step.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function toggleStatus() {
    setPending(true);
    try {
      await setFunnelStepStatusAction(funnelId, step.id, step.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Excluir a etapa "${step.name}"? Essa ação não pode ser desfeita.`)) return;
    setPending(true);
    try {
      await deleteFunnelStepAction(funnelId, step.id);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setFieldErrors({});
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateFunnelStepAction(funnelId, step.id, {}, formData);
    if (result.fieldErrors || result.error) {
      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.error ?? null);
      setPending(false);
      return;
    }
    setPending(false);
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <Card className="p-5">
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div>
            <Label htmlFor={`name-${step.id}`}>Nome da etapa</Label>
            <Input id={`name-${step.id}`} name="name" defaultValue={step.name} required />
            {fieldErrors.name?.[0] && <p className="text-xs text-danger mt-1">{fieldErrors.name[0]}</p>}
          </div>
          {isUrlType && (
            <div>
              <Label htmlFor={`url-${step.id}`}>URL de destino</Label>
              <Input id={`url-${step.id}`} name="externalUrl" defaultValue={currentUrl} placeholder="https://..." />
              {fieldErrors.externalUrl?.[0] && <p className="text-xs text-danger mt-1">{fieldErrors.externalUrl[0]}</p>}
            </div>
          )}
          {formError && <p className="text-xs text-danger">{formError}</p>}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={pending}>{pending ? "Salvando..." : "Salvar"}</Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{step.name}</p>
            <p className="text-xs text-foreground-muted">{FUNNEL_STEP_TYPE_LABELS[type] ?? type}</p>
          </div>
        </div>
        <Badge variant={step.status === "PUBLISHED" ? "success" : "neutral"}>
          {step.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border text-sm">
        <div>
          <p className="text-xs text-foreground-muted uppercase tracking-wide">Visitas</p>
          <p className="font-semibold text-foreground">{step.metrics.visitors ?? "Sem dados"}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-muted uppercase tracking-wide">Conversão</p>
          <p className="font-semibold text-foreground">
            {step.metrics.advanceRate !== null ? `${step.metrics.advanceRate.toFixed(1)}%` : "Sem dados"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        {step.type === "PAGE" && step.pageId && campaignId && (
          <Link href={`/dashboard/clients/${clientId}/campaigns/${campaignId}/builder`}>
            <Button variant="secondary" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Editar conteúdo
            </Button>
          </Link>
        )}
        {step.type === "SCRATCH_CARD" && step.scratchCardId && (
          <Link href={`/dashboard/scratch-cards/${step.scratchCardId}/edit`}>
            <Button variant="secondary" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Editar raspadinha
            </Button>
          </Link>
        )}
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)} disabled={pending}>
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleStatus} disabled={pending}>
          {step.status === "PUBLISHED" ? <Circle className="h-3.5 w-3.5 mr-1.5" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
          {step.status === "PUBLISHED" ? "Tornar rascunho" : "Publicar"}
        </Button>
        {step.status === "PUBLISHED" && isFunnelStepPubliclyResolvable(step) && (
          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
            {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-success" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
            {copied ? "Copiado!" : "Copiar link"}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={pending} className="text-danger hover:bg-danger/10 ml-auto">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
