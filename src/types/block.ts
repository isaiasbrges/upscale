export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "url"
  | "color"
  | "number"
  | "toggle"
  | "select";

export type BlockField = {
  key: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
};

export type BlockDefinition<T = Record<string, unknown>> = {
  type: string;
  name: string;
  category: string;
  version: number;
  description?: string;
  defaultConfig: T;
  fields: BlockField[];
  component: React.ComponentType<T>;
};
