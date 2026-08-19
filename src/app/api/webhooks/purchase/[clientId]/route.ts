import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractPurchaseData } from "@/lib/purchase-webhook";

/**
 * Recebe a confirmação de compra de um checkout externo (formato de
 * plataforma não fixado — ver src/lib/purchase-webhook.ts). Salva o payload
 * bruto sempre, para permitir ajustar a extração depois de ver um evento
 * real. O referenceId salvo é o que a página pública do funil usa
 * (?ref=...) para achar o nome do comprador.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> },
) {
  const { clientId } = await params;

  const secret = process.env.PURCHASE_WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get("x-webhook-secret") || request.nextUrl.searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { id: true } });
  if (!client) {
    return NextResponse.json({ error: "client not found" }, { status: 404 });
  }

  let payload: unknown;
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    } else {
      // Algumas plataformas mandam JSON sem o Content-Type correto.
      const text = await request.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text };
      }
    }
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const { referenceId, buyerName, buyerEmail } = extractPurchaseData(payload);

  if (!referenceId) {
    // Sem identificador de pedido a página pública não consegue achar esse
    // comprador depois — ainda assim salvamos o payload bruto pra debug.
    await prisma.purchaseEvent.create({
      data: {
        clientId,
        referenceId: `sem-referencia-${Date.now()}`,
        buyerName,
        buyerEmail,
        rawPayload: payload as any,
      },
    });
    return NextResponse.json(
      { warning: "Nenhum identificador de pedido encontrado no payload; evento salvo, mas sem referência utilizável na página." },
      { status: 200 },
    );
  }

  await prisma.purchaseEvent.upsert({
    where: { clientId_referenceId: { clientId, referenceId } },
    update: { buyerName, buyerEmail, rawPayload: payload as any },
    create: { clientId, referenceId, buyerName, buyerEmail, rawPayload: payload as any },
  });

  return NextResponse.json({ ok: true, referenceId, buyerName });
}
