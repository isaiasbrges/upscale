"use client";

import { useState } from "react";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { BlockEditor } from "./block-editor";
import { AddBlockPanel } from "./add-block-panel";
import { blockRegistry, type BlockType } from "@/lib/blocks/registry";
import { cn } from "@/lib/utils";
import { Layers, Plus, Monitor, Smartphone, Copy, Check, Settings2, GripVertical } from "lucide-react";
import { setCampaignPublishedAction } from "@/actions/campaigns";
import { reorderBlocksAction, type CreatedBlock } from "@/actions/blocks";

type Block = {
  id: string;
  type: string;
  config: Record<string, unknown>;
};

type BuilderClientProps = {
  clientId: string;
  campaignId: string;
  pageId: string;
  blocks: Block[];
  campaignStatus: string;
  campaignSlug: string;
  clientSlug: string;
};

export function BuilderClient({ clientId, campaignId, pageId, blocks: initialBlocks, campaignStatus, campaignSlug, clientSlug }: BuilderClientProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    initialBlocks.length > 0 ? initialBlocks[0].id : null
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [leftTab, setLeftTab] = useState<"layers" | "add">("layers");
  const [status, setStatus] = useState(campaignStatus);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  function handleConfigChange(blockId: string, config: Record<string, unknown>) {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, config } : b)));
  }

  function handleBlockAdded(block: CreatedBlock) {
    setBlocks((prev) => [...prev, block]);
    setSelectedBlockId(block.id);
    setLeftTab("layers");
  }

  function handleBlockDeleted(blockId: string) {
    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== blockId);
      setSelectedBlockId(next.length > 0 ? next[0].id : null);
      return next;
    });
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    setBlocks((prev) => {
      const fromIndex = prev.findIndex((b) => b.id === draggedId);
      const toIndex = prev.findIndex((b) => b.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      reorderBlocksAction(clientId, campaignId, pageId, next.map((b) => b.id)).catch((err) => console.error(err));
      return next;
    });
    setDraggedId(null);
    setDragOverId(null);
  }

  async function handleTogglePublish() {
    const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setIsToggling(true);
    try {
      await setCampaignPublishedAction(clientId, campaignId, next === "PUBLISHED");
      setStatus(next);
    } finally {
      setIsToggling(false);
    }
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/p/${clientSlug}/${campaignSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-full min-w-0 w-full overflow-hidden bg-background">
      
      {/* Left Panel: Library & Layers */}
      <div className="flex w-[250px] flex-shrink-0 flex-col border-r border-border bg-surface xl:w-[280px]">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <button
            onClick={() => setLeftTab("layers")}
            className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors", leftTab === "layers" ? "bg-surface-elevated text-foreground" : "text-foreground-muted hover:text-foreground")}
          >
            <Layers className="h-4 w-4 mx-auto mb-1" />
            Camadas
          </button>
          <button
            onClick={() => setLeftTab("add")}
            className={cn("flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors", leftTab === "add" ? "bg-surface-elevated text-foreground" : "text-foreground-muted hover:text-foreground")}
          >
            <Plus className="h-4 w-4 mx-auto mb-1" />
            Adicionar
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 xl:p-4">
          {leftTab === "layers" ? (
            <div className="space-y-2">
              {blocks.length === 0 && (
                <p className="text-sm text-foreground-muted text-center py-8">Nenhum bloco adicionado.</p>
              )}
              {blocks.map((block) => {
                const entry = blockRegistry[block.type as BlockType];
                if (!entry) return null;
                const isSelected = selectedBlockId === block.id;
                const isDragOver = dragOverId === block.id && draggedId !== block.id;

                return (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => setDraggedId(block.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverId !== block.id) setDragOverId(block.id);
                    }}
                    onDragLeave={() => setDragOverId((prev) => (prev === block.id ? null : prev))}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(block.id);
                    }}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setDragOverId(null);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-md border transition-colors",
                      isSelected
                        ? "bg-primary/10 border-primary/20"
                        : "bg-surface-elevated border-transparent hover:bg-surface-elevated",
                      isDragOver && "ring-2 ring-primary/60",
                      draggedId === block.id && "opacity-40"
                    )}
                  >
                    <span className="pl-2 text-foreground-muted cursor-grab active:cursor-grabbing shrink-0">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedBlockId(block.id)}
                      className={cn(
                        "flex-1 min-w-0 flex items-center gap-3 pr-3 py-2.5 text-sm font-medium transition-colors",
                        isSelected
                          ? "text-primary"
                          : "text-foreground-secondary hover:text-foreground"
                      )}
                    >
                      <span className="flex-shrink-0">{entry.icon}</span>
                      <span className="truncate">{entry.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <AddBlockPanel clientId={clientId} campaignId={campaignId} pageId={pageId} onAdded={handleBlockAdded} />
          )}
        </div>
      </div>

      {/* Center Panel: Live Preview Canvas */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0C0F12]">
        {/* Toolbar superior para evitar sobreposição no conteúdo */}
        <div className="w-full h-14 bg-surface border-b border-border flex items-center justify-between gap-3 px-3 z-20 shadow-sm">
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              status === "PUBLISHED" ? "bg-success/15 text-success" : "bg-surface-elevated text-foreground-muted"
            )}>
              {status === "PUBLISHED" ? "Publicado" : "Rascunho"}
            </span>
            <button
              onClick={handleTogglePublish}
              disabled={isToggling}
              className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border bg-surface-elevated text-foreground hover:bg-background transition-colors disabled:opacity-50"
            >
              {isToggling ? "Aguarde..." : status === "PUBLISHED" ? "Despublicar" : "Publicar"}
            </button>
            {status === "PUBLISHED" && (
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-border bg-surface-elevated text-foreground hover:bg-background transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copiado!" : "Copiar link"}
              </button>
            )}
          </div>

          <div className="flex bg-surface-elevated border border-border p-1 rounded-lg shrink-0">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={cn("p-1.5 rounded-md transition-colors", previewMode === "desktop" ? "bg-background text-primary shadow-sm" : "text-foreground-muted hover:text-foreground")}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={cn("p-1.5 rounded-md transition-colors", previewMode === "mobile" ? "bg-background text-primary shadow-sm" : "text-foreground-muted hover:text-foreground")}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <div className="w-[220px] shrink-0" aria-hidden />
        </div>

        <div className={cn("custom-scrollbar flex flex-1 justify-center overflow-auto p-3 xl:p-6", previewMode === "desktop" ? "items-start" : "items-center")}> 
          <div className={cn(
            "bg-[#0a0a0a] transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative ring-1 ring-border",
            previewMode === "mobile" 
              ? "w-[375px] h-[812px] rounded-[40px] overflow-y-auto overflow-x-hidden border-[12px] border-[#171717] custom-scrollbar" 
              : "w-full max-w-6xl min-h-full rounded-md overflow-hidden"
          )}>
            {blocks.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-400 p-12 text-center">
                <p>Seu canvas está vazio. Adicione um bloco pelo painel esquerdo.</p>
              </div>
            ) : (
              blocks.map((block) => (
                <div 
                  key={block.id}
                  className={cn(
                    "relative group ring-inset",
                    selectedBlockId === block.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(block.id);
                  }}
                >
                  <BlockRenderer type={block.type as BlockType} config={block.config} preview={true} />
                  {selectedBlockId === block.id && (
                    <div className="absolute top-2 right-2 bg-primary text-background text-xs font-bold px-2 py-1 rounded shadow-md pointer-events-none">
                      Editando
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Properties/Settings */}
      <div className="flex w-[280px] flex-shrink-0 flex-col overflow-y-auto border-l border-border bg-surface 2xl:w-[320px]">
        <div className="flex items-center gap-2 p-4 border-b border-border sticky top-0 bg-surface z-10">
          <Settings2 className="h-4 w-4 text-foreground-muted" />
          <h3 className="text-sm font-semibold text-foreground">Propriedades</h3>
        </div>
        <div className="p-4">
          {selectedBlock ? (
            <BlockEditor
              key={selectedBlock.id} // Force re-mount when block changes
              clientId={clientId}
              campaignId={campaignId}
              blockId={selectedBlock.id}
              blockType={selectedBlock.type as BlockType}
              config={selectedBlock.config}
              onConfigChange={(config) => handleConfigChange(selectedBlock.id, config)}
              onDeleted={() => handleBlockDeleted(selectedBlock.id)}
            />
          ) : (
            <div className="text-center py-12 px-4 border border-dashed border-border rounded-lg bg-surface-elevated">
              <p className="text-sm text-foreground-muted">Selecione um bloco no canvas ou nas camadas para editar suas propriedades.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
