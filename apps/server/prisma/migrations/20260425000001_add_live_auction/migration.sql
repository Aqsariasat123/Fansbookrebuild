-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'LIVE_AUCTION_WIN';
ALTER TYPE "TransactionType" ADD VALUE 'LIVE_AUCTION_FEE';

-- CreateEnum
CREATE TYPE "LiveAuctionStatus" AS ENUM ('ACTIVE', 'ENDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "LiveAuction" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "startingBid" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "durationSec" INTEGER NOT NULL,
    "currentBid" DOUBLE PRECISION,
    "currentBidderId" TEXT,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "status" "LiveAuctionStatus" NOT NULL DEFAULT 'ACTIVE',
    "winnerId" TEXT,
    "winnerAmount" DOUBLE PRECISION,
    "platformFee" DOUBLE PRECISION,
    "purchaseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveAuction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveAuctionBid" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveAuctionBid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveAuction_purchaseId_key" ON "LiveAuction"("purchaseId");

-- AddForeignKey
ALTER TABLE "LiveAuction" ADD CONSTRAINT "LiveAuction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LiveSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAuction" ADD CONSTRAINT "LiveAuction_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "MarketplaceListing"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAuction" ADD CONSTRAINT "LiveAuction_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAuction" ADD CONSTRAINT "LiveAuction_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAuction" ADD CONSTRAINT "LiveAuction_currentBidderId_fkey" FOREIGN KEY ("currentBidderId") REFERENCES "User"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAuction" ADD CONSTRAINT "LiveAuction_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "MarketplacePurchase"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAuctionBid" ADD CONSTRAINT "LiveAuctionBid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "LiveAuction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveAuctionBid" ADD CONSTRAINT "LiveAuctionBid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "User"("id") ON UPDATE CASCADE;
