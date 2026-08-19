-- AlterTable
ALTER TABLE "Funnel" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "FunnelStep" (
    "id" TEXT NOT NULL,
    "funnelId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "pageId" TEXT,
    "scratchCardId" TEXT,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FunnelStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FunnelStep_funnelId_order_idx" ON "FunnelStep"("funnelId", "order");

-- CreateIndex
CREATE INDEX "FunnelStep_pageId_idx" ON "FunnelStep"("pageId");

-- CreateIndex
CREATE INDEX "FunnelStep_scratchCardId_idx" ON "FunnelStep"("scratchCardId");

-- AddForeignKey
ALTER TABLE "FunnelStep" ADD CONSTRAINT "FunnelStep_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunnelStep" ADD CONSTRAINT "FunnelStep_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunnelStep" ADD CONSTRAINT "FunnelStep_scratchCardId_fkey" FOREIGN KEY ("scratchCardId") REFERENCES "ScratchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
