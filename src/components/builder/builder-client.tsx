"use client";

import { useState } from "react";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { BlockEditor } from "./block-editor";
import { AddBlockPanel } from "./add-block-panel";
import { blockRegistry, type BlockType } from "@/lib/blocks/registry";
import { cn } from "@/lib/utils";
import { Layers, Plus, Monitor, Smartphone, Settings2 } from "lucide-react";

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
};

export function BuilderClient({ clientId, campaignId, pageId, blocks }: BuilderClientProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    blocks.length > 0 ? blocks[0].id : null
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [leftTab, setLeftTab] = useState<"layers" | "add">("layers");

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

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

                return (
                  <button
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors border",
                      isSelected 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-surface-elevated border-transparent text-foreground-secondary hover:bg-surface-elevated hover:text-foreground"
                    )}
                  >
                    <span className="flex-shrink-0">{entry.icon}</span>
                    <span className="truncate">{entry.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <AddBlockPanel clientId={clientId} campaignId={campaignId} pageId={pageId} />
          )}
        </div>
      </div>

      {/* Center Panel: Live Preview Canvas */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0C0F12]">
        {/* Toolbar superior para evitar sobreposição no conteúdo */}
        <div className="w-full h-14 bg-surface border-b border-border flex items-center justify-center z-20 shadow-sm">
          <div className="flex bg-surface-elevated border border-border p-1 rounded-lg">
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
              onUpdate={() => {}} // We rely on Server Action reloads, or we can just let it reload
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
