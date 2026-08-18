"use client";

import { useMemo, useState } from "react";
import { getBlockDefinition } from "@/blocks/registry";
import { BuilderBlockLibrary } from "./block-library";
import { BlockRenderer } from "./block-renderer";
import { BlockInspector } from "./block-inspector";

type BuilderBlock = {
  id: string;
  type: string;
  config: Record<string, any>;
};

export function BuilderShell() {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

  const selected = useMemo(
    () => blocks.find((block) => block.id === selectedId),
    [blocks, selectedId]
  );

  function addBlock(type: string) {
    const def = getBlockDefinition(type);
    if (!def) return;

    const id = crypto.randomUUID();
    setBlocks((current) => [
      ...current,
      { id, type, config: { ...def.defaultConfig } }
    ]);
    setSelectedId(id);
  }

  function updateSelected(key: string, value: any) {
    if (!selectedId) return;

    setBlocks((current) =>
      current.map((block) =>
        block.id === selectedId
          ? { ...block, config: { ...block.config, [key]: value } }
          : block
      )
    );
  }

  return (
    <div className="grid h-screen grid-cols-[280px_1fr_320px] bg-neutral-900">
      <BuilderBlockLibrary onAdd={addBlock} />

      <main className="overflow-y-auto p-7">
        <div className="mx-auto max-w-5xl space-y-4">
          {blocks.length === 0 && (
            <div className="flex min-h-[70vh] items-center justify-center rounded-[28px] border border-dashed border-white/15 text-center text-white/35">
              <div>
                <div className="text-lg font-bold text-white/70">Comece adicionando um bloco</div>
                <div className="mt-2 text-sm">Escolha um modelo na biblioteca à esquerda.</div>
              </div>
            </div>
          )}

          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => setSelectedId(block.id)}
              className={`block w-full rounded-[30px] p-1 text-left ${
                block.id === selectedId ? "ring-2 ring-violet-500" : ""
              }`}
            >
              <BlockRenderer type={block.type} config={block.config} />
            </button>
          ))}
        </div>
      </main>

      <BlockInspector
        type={selected?.type}
        config={selected?.config}
        onChange={updateSelected}
      />
    </div>
  );
}
