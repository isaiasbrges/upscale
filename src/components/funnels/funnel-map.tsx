import { ArrowDown, Workflow } from "lucide-react";
import { EmptyState } from "@/design-system/components/empty-state";
import { AddStepMenu } from "./add-step-menu";
import { FunnelStepCard } from "./funnel-step-card";
import type { StepMetrics } from "@/lib/funnel-metrics";

type StepWithMetrics = {
  id: string;
  name: string;
  type: string;
  status: string;
  config: unknown;
  metrics: StepMetrics;
};

export function FunnelMap({ funnelId, steps }: { funnelId: string; steps: StepWithMetrics[] }) {
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
        <div className="flex flex-col items-center gap-2 max-w-xl mx-auto">
          {steps.map((step, index) => {
            const previous = index > 0 ? steps[index - 1] : null;
            const passThroughRate =
              previous && previous.metrics.visitors && previous.metrics.visitors > 0 && step.metrics.visitors !== null
                ? (step.metrics.visitors / previous.metrics.visitors) * 100
                : null;

            return (
              <div key={step.id} className="w-full flex flex-col items-center">
                {index > 0 && (
                  <div className="flex flex-col items-center py-2 text-foreground-muted">
                    <ArrowDown className="h-4 w-4" />
                    <span className="text-xs mt-1">
                      {passThroughRate !== null ? `${passThroughRate.toFixed(1)}% avançou` : "Sem dados de avanço"}
                    </span>
                  </div>
                )}
                <div className="w-full">
                  <FunnelStepCard funnelId={funnelId} step={step} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
