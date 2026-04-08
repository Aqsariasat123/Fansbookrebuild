-- AddColumn moderationStatus to PostMedia (default PENDING, non-breaking)
ALTER TABLE "PostMedia" ADD COLUMN IF NOT EXISTS "moderationStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "PostMedia" ADD COLUMN IF NOT EXISTS "moderationLabels" JSONB;
ALTER TABLE "PostMedia" ADD COLUMN IF NOT EXISTS "moderationScore" DOUBLE PRECISION;
CREATE INDEX IF NOT EXISTS "PostMedia_moderationStatus_idx" ON "PostMedia"("moderationStatus");
