/**
 * Substitui "{{nome}}" pelo nome do comprador em todos os campos de texto de
 * um config de bloco. Usado pela página pública do funil (/f/[stepId]) para
 * personalizar o Funil Booster 110X (ou qualquer bloco) com o nome de quem
 * acabou de comprar, vindo de PurchaseEvent.
 */
export function personalizeConfig<T extends Record<string, unknown>>(
  config: T,
  buyerName: string | null,
): T {
  const name = buyerName?.trim() || "amigo(a)";
  const replaced: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    replaced[key] = typeof value === "string" ? value.replaceAll("{{nome}}", name) : value;
  }
  return replaced as T;
}
