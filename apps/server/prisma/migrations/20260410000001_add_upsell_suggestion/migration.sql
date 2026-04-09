-- CreateTable UpsellSuggestion (additive, non-breaking)
CREATE TABLE IF NOT EXISTS "UpsellSuggestion" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "actionLabel" TEXT,
    "actionData" JSONB,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UpsellSuggestion_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "UpsellSuggestion_creatorId_idx" ON "UpsellSuggestion"("creatorId");
CREATE INDEX IF NOT EXISTS "UpsellSuggestion_creatorId_dismissed_idx" ON "UpsellSuggestion"("creatorId", "dismissed");
ALTER TABLE "UpsellSuggestion" ADD CONSTRAINT "UpsellSuggestion_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
