-- CreateEnum
CREATE TYPE "AIClipJobStatus" AS ENUM ('QUEUED', 'EXTRACTING', 'ANALYZING', 'CUTTING', 'DONE', 'FAILED');

-- AlterTable: add aiClipJobs relation (no SQL needed, handled by FK on AIClipJob)

-- CreateTable AIClipJob
CREATE TABLE "AIClipJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalFile" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "durationSec" INTEGER,
    "status" "AIClipJobStatus" NOT NULL DEFAULT 'QUEUED',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIClipJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable AIClip
CREATE TABLE "AIClip" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "thumbnailPath" TEXT,
    "title" TEXT NOT NULL,
    "startSec" DOUBLE PRECISION NOT NULL,
    "endSec" DOUBLE PRECISION NOT NULL,
    "score" TEXT NOT NULL DEFAULT 'HIGH',
    "reason" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIClip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIClipJob_userId_idx" ON "AIClipJob"("userId");
CREATE INDEX "AIClipJob_status_idx" ON "AIClipJob"("status");
CREATE INDEX "AIClip_jobId_idx" ON "AIClip"("jobId");
CREATE INDEX "AIClip_userId_idx" ON "AIClip"("userId");
CREATE UNIQUE INDEX "AIClip_postId_key" ON "AIClip"("postId");

-- AddForeignKey
ALTER TABLE "AIClipJob" ADD CONSTRAINT "AIClipJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIClip" ADD CONSTRAINT "AIClip_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AIClipJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
