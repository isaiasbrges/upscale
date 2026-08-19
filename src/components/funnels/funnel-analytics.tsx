import { Card } from "@/design-system/components/card";
import { EmptyState } from "@/design-system/components/empty-state";
import { BarChart3 } from "lucide-react";
import { FUNNEL_STEP_TYPE_LABELS, type FunnelStepType } from "@/actions/funnel-steps";
import type { StepMetrics } from "@/lib/funnel-metrics";

type StepWithMetrics = { id: string; name: string; type: string; metrics: StepMetrics };

function formatMetric(value: number | null, suffix = "") {
  return value === null ? "Sem dados" : `${value.toLocaleString("pt-BR")}${suffix}`;
}

function formatPercent(value: number | null) {
  return value === null ? "Sem dados" : `${value.toFixed(1)}%`;
}

export function FunnelAnalytics({ steps }: { steps: StepWithMetrics[] }) {
  if (steps.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="h-12 w-12" />}
        title="Sem etapas para analisar"
        description="Adicione etapas ao funil na aba Mapa para acompanhar o desempenho aqui."
      />
    );
  }

  const hasAnyRealData = steps.some((step) => step.metrics.visitors !== null);

  return (
    <div className="space-y-4">
      {!hasAnyRealData && (
        <div className="p-4 rounded-md border border-border bg-surface text-sm text-foreground-secondary">
          Ainda não há eventos reais registrados para as etapas deste funil. Os números aparecem aqui assim que houver
          interações reais (hoje, apenas etapas do tipo Raspadinha têm rastreamento implementado).
        </div>
      )}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-foreground-muted">
              <th className="px-4 py-3 font-medium">Etapa</th>
              <th className="px-4 py-3 font-medium text-right">Usuários únicos</th>
              <th className="px-4 py-3 font-medium text-right">Conversões</th>
              <th className="px-4 py-3 font-medium text-right">Taxa de avanço</th>
              <th className="px-4 py-3 font-medium text-right">Abandono</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {steps.map((step) => (
              <tr key={step.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{step.name}</p>
                  <p className="text-xs text-foreground-muted">{FUNNEL_STEP_TYPE_LABELS[step.type as FunnelStepType] ?? step.type}</p>
                </td>
                <td className="px-4 py-3 text-right text-foreground-secondary">{formatMetric(step.metrics.visitors)}</td>
                <td className="px-4 py-3 text-right text-foreground-secondary">{formatMetric(step.metrics.conversions)}</td>
                <td className="px-4 py-3 text-right text-foreground-secondary">{formatPercent(step.metrics.advanceRate)}</td>
                <td className="px-4 py-3 text-right text-foreground-secondary">{formatPercent(step.metrics.abandonment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
