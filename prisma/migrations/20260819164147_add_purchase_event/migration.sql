-- CreateTable
CREATE TABLE "PurchaseEvent" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "buyerName" TEXT,
    "buyerEmail" TEXT,
    "rawPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PurchaseEvent_clientId_idx" ON "PurchaseEvent"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseEvent_clientId_referenceId_key" ON "PurchaseEvent"("clientId", "referenceId");

-- AddForeignKey
ALTER TABLE "PurchaseEvent" ADD CONSTRAINT "PurchaseEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
