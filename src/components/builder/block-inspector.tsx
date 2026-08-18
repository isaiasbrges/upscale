"use client";

import { getBlockDefinition } from "@/blocks/registry";

type Props = {
  type?: string;
  config?: Record<string, any>;
  onChange: (key: string, value: any) => void;
};

export function BlockInspector({ type, config = {}, onChange }: Props) {
  if (!type) {
    return (
      <aside className="border-l border-white/10 bg-neutral-950 p-5 text-sm text-white/40">
        Selecione um bloco para editar.
      </aside>
    );
  }

  const definition = getBlockDefinition(type);
  if (!definition) return null;

  return (
    <aside className="h-full overflow-y-auto border-l border-white/10 bg-neutral-950 p-5 text-white">
      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-[.18em] text-white/35">Configurações</div>
        <h2 className="mt-1 text-lg font-black">{definition.name}</h2>
      </div>

      <div className="space-y-4">
        {definition.fields.map((field) => {
          const value = config[field.key] ?? definition.defaultConfig[field.key];

          if (field.type === "textarea") {
            return (
              <label key={field.key} className="block">
                <span className="mb-2 block text-xs font-bold text-white/55">{field.label}</span>
                <textarea
                  value={value ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="min-h-24 w-full rounded-xl border border-white/10 bg-white/[.04] p-3 text-sm outline-none"
                />
              </label>
            );
          }

          if (field.type === "toggle") {
            return (
              <label key={field.key} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                <span className="text-sm font-bold">{field.label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                />
              </label>
            );
          }

          return (
            <label key={field.key} className="block">
              <span className="mb-2 block text-xs font-bold text-white/55">{field.label}</span>
              <input
                type={field.type === "color" ? "color" : field.type === "number" ? "number" : "text"}
                value={value ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-3 text-sm outline-none"
              />
            </label>
          );
        })}
      </div>
    </aside>
  );
}
