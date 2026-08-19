"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { updateBlockAction, deleteBlockAction } from "@/actions/blocks";
import { getFunnelStepsForCampaign } from "@/actions/funnel-steps";
import { FUNNEL_STEP_TYPE_LABELS, type FunnelStepType } from "@/lib/funnel-step-types";
import { blockRegistry, type BlockType } from "@/lib/blocks/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FunnelStepOption = { id: string; name: string; type: string };

/** Campo de link que alterna entre "URL externa" e "Etapa do funil" (grava sempre uma string em config). */
function LinkField({
  value,
  onChange,
  funnelSteps,
}: {
  value: string;
  onChange: (value: string) => void;
  funnelSteps: FunnelStepOption[];
}) {
  const [mode, setMode] = useState<"url" | "funnel-step">(value.startsWith("/f/") ? "funnel-step" : "url");

  return (
    <div className="space-y-2">
      {funnelSteps.length > 0 && (
        <div className="flex gap-1 rounded-md bg-background p-1 border border-border w-fit">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 text-xs rounded ${mode === "url" ? "bg-primary text-primary-foreground" : "text-foreground-muted"}`}
          >
            URL externa
          </button>
          <button
            type="button"
            onClick={() => setMode("funnel-step")}
            className={`px-2.5 py-1 text-xs rounded ${mode === "funnel-step" ? "bg-primary text-primary-foreground" : "text-foreground-muted"}`}
          >
            Etapa do funil
          </button>
        </div>
      )}

      {mode === "funnel-step" && funnelSteps.length > 0 ? (
        <select
          value={value.startsWith("/f/") ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Selecione uma etapa</option>
          {funnelSteps.map((step) => (
            <option key={step.id} value={`/f/${step.id}`}>
              {step.name} — {FUNNEL_STEP_TYPE_LABELS[step.type as FunnelStepType] ?? step.type}
            </option>
          ))}
        </select>
      ) : (
        // type="text" (não "url"): alguns links legítimos aqui são âncoras
        // internas como "#oferta", que a validação nativa de <input type="url">
        // rejeita como inválidas e travaria o salvamento do formulário.
        <Input type="text" placeholder="https:// ou #ancora" value={value} onChange={(e) => onChange(e.target.value)} className="bg-background" />
      )}
    </div>
  );
}

// Sub-component for FAQ items
function FaqItemsEditor({ items, onChange }: { items: any[], onChange: (items: any[]) => void }) {
  const addItem = () => onChange([...items, { question: "", answer: "" }]);
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
  const updateItem = (index: number, key: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="p-3 border border-border bg-background rounded-lg relative shadow-sm">
          <button 
            type="button" 
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 text-foreground-muted hover:text-danger"
          >
            &times;
          </button>
          <div className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Pergunta</Label>
              <Input value={item.question} onChange={e => updateItem(index, "question", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Resposta</Label>
              <Textarea value={item.answer} onChange={e => updateItem(index, "answer", e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={addItem} className="w-full text-xs">
        + Adicionar Item FAQ
      </Button>
    </div>
  );
}

// Sub-component for Prize items
function PrizeItemsEditor({ items, onChange }: { items: any[], onChange: (items: any[]) => void }) {
  const addItem = () => onChange([...items, { title: "", description: "", imageUrl: "" }]);
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
  const updateItem = (index: number, key: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="p-3 border border-border bg-background rounded-lg relative shadow-sm">
          <button 
            type="button" 
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 text-foreground-muted hover:text-danger"
          >
            &times;
          </button>
          <div className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Título do Prêmio</Label>
              <Input value={item.title} onChange={e => updateItem(index, "title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição</Label>
              <Textarea value={item.description} onChange={e => updateItem(index, "description", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL da Imagem (opcional)</Label>
              <Input type="url" value={item.imageUrl} onChange={e => updateItem(index, "imageUrl", e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={addItem} className="w-full text-xs">
        + Adicionar Prêmio
      </Button>
    </div>
  );
}

type BlockEditorProps = {
  blockId: string;
  blockType: BlockType;
  clientId: string;
  campaignId: string;
  config: Record<string, unknown>;
  onConfigChange?: (config: Record<string, unknown>) => void;
  onDeleted?: () => void;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function BlockEditor({ blockId, blockType, clientId, campaignId, config, onConfigChange, onDeleted }: BlockEditorProps) {
  const [currentConfig, setCurrentConfig] = useState<Record<string, unknown>>(config);
  const [funnelSteps, setFunnelSteps] = useState<FunnelStepOption[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getFunnelStepsForCampaign(campaignId).then(setFunnelSteps).catch(() => setFunnelSteps([]));
  }, [campaignId]);

  // Limpa o debounce pendente ao trocar/desmontar, pra não disparar save
  // de um bloco que já saiu de tela.
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const persist = useCallback(
    async (nextConfig: Record<string, unknown>) => {
      setSaveStatus("saving");
      setSaveError(null);
      const formData = new FormData();
      formData.set("blockId", blockId);
      formData.set("blockType", blockType);
      formData.set("config", JSON.stringify(nextConfig));
      try {
        const result = await updateBlockAction(clientId, campaignId, null, formData);
        if (result.error) {
          setSaveStatus("error");
          setSaveError(result.error);
          return;
        }
        setSaveStatus("saved");
      } catch (err: any) {
        setSaveStatus("error");
        setSaveError(err?.message ?? "Não foi possível salvar");
      }
    },
    [blockId, blockType, clientId, campaignId],
  );

  // Edição dinâmica: cada alteração já aparece no preview instantaneamente
  // (onConfigChange) e é salva sozinha após uma pequena pausa de digitação
  // (debounce), sem precisar clicar em "Salvar".
  const handleFieldChange = (key: string, value: unknown) => {
    const next = { ...currentConfig, [key]: value };
    setCurrentConfig(next);
    onConfigChange?.(next);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => persist(next), 700);
  };

  const handleItemsChange = (items: unknown[]) => {
    const next = { ...currentConfig, items };
    setCurrentConfig(next);
    onConfigChange?.(next);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => persist(next), 700);
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja remover este bloco?")) return;
    try {
      await deleteBlockAction(clientId, campaignId, blockId);
      onDeleted?.();
    } catch (err) {
      console.error(err);
    }
  };

  const registryEntry = blockRegistry[blockType];
  if (!registryEntry) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        {registryEntry.fields.map((field, index) => {
          const value = currentConfig[field.key];
          const showGroupHeader = field.group !== registryEntry.fields[index - 1]?.group;

          return (
            <div key={field.key}>
              {showGroupHeader && field.group && (
                <h4 className="text-sm font-bold text-foreground pt-2 pb-1 border-b border-border mb-3">{field.group}</h4>
              )}
              <div className="space-y-2 mb-5">
              <Label className="text-xs uppercase tracking-wide text-foreground-muted font-bold">{field.label}</Label>

              {field.type === "text" && (
                <Input
                  value={value as string || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="bg-background"
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  value={value as string || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="bg-background min-h-[100px]"
                />
              )}
              {field.type === "url" && (
                <LinkField
                  value={(value as string) || ""}
                  onChange={(next) => handleFieldChange(field.key, next)}
                  funnelSteps={funnelSteps}
                />
              )}
              {field.type === "color" && (
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border shadow-sm">
                    <input
                      type="color"
                      value={value as string || "#000000"}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="absolute -top-2 -left-2 h-16 w-16 cursor-pointer"
                    />
                  </div>
                  <Input
                    value={value as string || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="flex-1 bg-background uppercase font-mono"
                  />
                </div>
              )}
              {field.type === "number" && (
                <Input
                  type="number"
                  value={value as number || 0}
                  onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value))}
                  className="bg-background"
                />
              )}
              {field.type === "toggle" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value as boolean || false}
                    onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground">Ativado</span>
                </div>
              )}
              {field.type === "select" && field.options && (
                <select
                  value={value as string || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
              {(field.type as string) === "datetime" && (
                <Input
                  type="datetime-local"
                  value={value as string || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="bg-background"
                />
              )}
              </div>
            </div>
          );
        })}

        {blockType === "faq" && (
          <div className="space-y-2 mt-4 pt-4 border-t border-border">
            <Label className="text-xs uppercase tracking-wide text-foreground-muted font-bold">Itens de FAQ</Label>
            <FaqItemsEditor
              items={currentConfig.items as any[] || []}
              onChange={handleItemsChange}
            />
          </div>
        )}

        {blockType === "prizes" && (
          <div className="space-y-2 mt-4 pt-4 border-t border-border">
            <Label className="text-xs uppercase tracking-wide text-foreground-muted font-bold">Lista de Prêmios</Label>
            <PrizeItemsEditor
              items={currentConfig.items as any[] || []}
              onChange={handleItemsChange}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs mt-2">
        {saveStatus === "saving" && (
          <span className="flex items-center gap-1.5 text-foreground-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground-muted animate-pulse" />
            Salvando...
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="flex items-center gap-1.5 text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Salvo
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-danger">{saveError ?? "Erro ao salvar"}</span>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={() => persist(currentConfig)} className="w-full">
          Salvar agora
        </Button>
        <Button type="button" variant="danger" onClick={handleDelete} className="w-full">
          Remover bloco
        </Button>
      </div>
    </div>
  );
}
