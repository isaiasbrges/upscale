// Extrai nome do comprador, e-mail e um identificador de referência (pedido/
// transação) de um payload de webhook de checkout com formato desconhecido.
//
// Como não sabemos o formato exato de toda plataforma de pagamento, testamos
// os nomes de campo mais comuns entre as plataformas brasileiras/internacionais
// mais usadas. Se a extração falhar para uma plataforma específica, o payload
// bruto sempre fica salvo em PurchaseEvent.rawPayload para ajustar depois.

const NAME_KEYS = [
  "name",
  "nome",
  "buyer_name",
  "buyerName",
  "customer_name",
  "customerName",
  "client_name",
  "cliente_nome",
  "full_name",
  "fullName",
];

const EMAIL_KEYS = [
  "email",
  "buyer_email",
  "buyerEmail",
  "customer_email",
  "customerEmail",
  "cliente_email",
];

const REFERENCE_KEYS = [
  "reference_id",
  "referenceId",
  "order_id",
  "orderId",
  "transaction_id",
  "transactionId",
  "transaction",
  "id_pedido",
  "pedido_id",
  "codigo",
  "code",
  "id",
];

/** Procura um valor em qualquer nível (até 2 de profundidade) de um objeto, testando várias chaves candidatas. */
function findValue(obj: unknown, keys: string[], depth = 0): string | null {
  if (!obj || typeof obj !== "object" || depth > 2) return null;
  const record = obj as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  // Estruturas aninhadas comuns: { buyer: { name: ... } }, { customer: {...} }, { data: {...} }
  for (const nestedKey of ["buyer", "customer", "cliente", "comprador", "data", "purchase", "order"]) {
    const nested = record[nestedKey];
    if (nested && typeof nested === "object") {
      const found = findValue(nested, keys, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

export function extractPurchaseData(payload: unknown): {
  referenceId: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
} {
  return {
    referenceId: findValue(payload, REFERENCE_KEYS),
    buyerName: findValue(payload, NAME_KEYS),
    buyerEmail: findValue(payload, EMAIL_KEYS),
  };
}
