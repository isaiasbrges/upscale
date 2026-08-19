"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Card } from "@/design-system/components/card";
import { Badge } from "@/design-system/components/badge";
import { EmptyState } from "@/design-system/components/empty-state";
import { Workflow } from "lucide-react";
import { AddStepMenu } from "./add-step-menu";
import { deleteFunnelStepAction, reorderFunnelStepsAction } from "@/actions/funnel-steps";
import { FUNNEL_STEP_TYPE_LABELS, type FunnelStepType } from "@/lib/funnel-step-types";
import { FUNNEL_STEP_TYPE_ICONS } from "./step-icons";

type Step = { id: string; name: string; type: string; status: string };

export function FunnelStepsList({ funnelId, steps }: { funnelId: string; steps: Step[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const reordered = [...steps];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setPendingId(steps[index].id);
    try {
      await reorderFunnelStepsAction(funnelId, reordered.map((s) => s.id));
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(step: Step) {
    if (!window.confirm(`Excluir a etapa "${step.name}"? Essa ação não pode ser desfeita.`)) return;
    setPendingId(step.id);
    try {
      await deleteFunnelStepAction(funnelId, step.id);
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddStepMenu funnelId={funnelId} />
      </div>

      {steps.length === 0 ? (
        <EmptyState
          icon={<Workflow className="h-12 w-12" />}
          title="Nenhuma etapa neste funil ainda"
          description="Adicione a primeira etapa para começar a montar a jornada de conversão."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {steps.map((step, index) => {
              const Icon = FUNNEL_STEP_TYPE_ICONS[step.type as FunnelStepType];
              return (
                <li key={step.id} className="flex items-center gap-4 p-4">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0 || pendingId !== null}
                      className="h-5 w-5 flex items-center justify-center text-foreground-muted hover:text-foreground disabled:opacity-30"
                      aria-label="Mover para cima"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === steps.length - 1 || pendingId !== null}
                      className="h-5 w-5 flex items-center justify-center text-foreground-muted hover:text-foreground disabled:opacity-30"
                      aria-label="Mover para baixo"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-foreground-muted w-6 text-center">{index + 1}</span>
                  <div className="h-8 w-8 shrink-0 rounded-md bg-primary/10 flex items-center justify-center">
                    {Icon && <Icon className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{step.name}</p>
                    <p className="text-xs text-foreground-muted">{FUNNEL_STEP_TYPE_LABELS[step.type as FunnelStepType] ?? step.type}</p>
                  </div>
                  <Badge variant={step.status === "PUBLISHED" ? "success" : "neutral"}>
                    {step.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleDelete(step)}
                    disabled={pendingId !== null}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-foreground-muted hover:bg-danger/10 hover:text-danger transition-colors disabled:opacity-30"
                    aria-label="Excluir etapa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
