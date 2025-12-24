-- CreateEnum
CREATE TYPE "ResourceTypeEnum" AS ENUM ('wood', 'stone', 'food', 'currency', 'metal', 'livestock');

-- CreateTable
CREATE TABLE "TradeOffer" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "realmId" TEXT NOT NULL,
    "givingResource" "ResourceTypeEnum" NOT NULL,
    "givingAmount" DOUBLE PRECISION NOT NULL,
    "receivingResource" "ResourceTypeEnum" NOT NULL,
    "receivingAmount" DOUBLE PRECISION NOT NULL,
    "maxUses" INTEGER NOT NULL,
    "usesRemaining" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TradeOffer_realmId_idx" ON "TradeOffer"("realmId");

-- CreateIndex
CREATE INDEX "TradeOffer_creatorId_idx" ON "TradeOffer"("creatorId");

-- CreateIndex
CREATE INDEX "TradeOffer_isActive_idx" ON "TradeOffer"("isActive");

-- AddForeignKey
ALTER TABLE "TradeOffer" ADD CONSTRAINT "TradeOffer_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeOffer" ADD CONSTRAINT "TradeOffer_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

