"use client";

import { useState } from "react";
import { addBlockAction, type CreatedBlock } from "@/actions/blocks";
import { blockRegistry, type BlockType } from "@/lib/blocks/registry";

type AddBlockPanelProps = {
  clientId: string;
  campaignId: string;
  pageId: string;
  onAdded: (block: CreatedBlock) => void;
};

export function AddBlockPanel({ clientId, campaignId, pageId, onAdded }: AddBlockPanelProps) {
  const [loadingType, setLoadingType] = useState<BlockType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddBlock = async (type: BlockType) => {
    setLoadingType(type);
    setError(null);
    try {
      const result = await addBlockAction(clientId, campaignId, pageId, type);
      if (result.error || !result.block) {
        setError(result.error || "Não foi possível adicionar o bloco");
        return;
      }
      onAdded(result.block);
    } catch (err: any) {
      setError(err.message || "Failed to add block");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      {error && <p className="text-danger text-sm">{error}</p>}

      <div className="flex flex-col gap-2">
        {Object.entries(blockRegistry).map(([type, block]) => (
          <div
            key={type}
            onClick={() => !loadingType && handleAddBlock(type as BlockType)}
            className={`flex items-start gap-3 rounded-lg border border-border bg-background p-3 transition-all ${
              loadingType ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50 hover:bg-surface-elevated hover:shadow-sm"
            }`}
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface text-foreground shadow-sm">
              {loadingType === type ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : (
                block.icon
              )}
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm leading-none mb-1">{block.label}</h4>
              <p className="text-xs text-foreground-muted line-clamp-2">{block.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
