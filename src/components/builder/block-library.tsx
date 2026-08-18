"use client";

import { blockLibrary } from "@/blocks/registry";

type Props = {
  onAdd: (type: string) => void;
};

export function BuilderBlockLibrary({ onAdd }: Props) {
  const categories = [...new Set(blockLibrary.map((b) => b.category))];

  return (
    <aside className="h-full overflow-y-auto border-r border-white/10 bg-neutral-950 p-4 text-white">
      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-[.18em] text-white/35">Upscale Builder</div>
        <h2 className="mt-1 text-xl font-black">Blocos</h2>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-white/35">
              {category}
            </div>

            <div className="space-y-2">
              {blockLibrary.filter((b) => b.category === category).map((block) => (
                <button
                  key={block.type}
                  onClick={() => onAdd(block.type)}
                  className="w-full rounded-xl border border-white/10 bg-white/[.03] p-3 text-left transition hover:bg-white/[.07]"
                >
                  <div className="text-sm font-bold">{block.name}</div>
                  <div className="mt-1 text-xs leading-5 text-white/40">{block.description}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
