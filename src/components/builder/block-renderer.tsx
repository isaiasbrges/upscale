import { getBlockDefinition } from "@/blocks/registry";

type Props = {
  type: string;
  config: Record<string, any>;
};

export function BlockRenderer({ type, config }: Props) {
  const definition = getBlockDefinition(type);

  if (!definition) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
        Bloco não registrado: {type}
      </div>
    );
  }

  const Component = definition.component;
  return <Component {...definition.defaultConfig} {...config} />;
}
