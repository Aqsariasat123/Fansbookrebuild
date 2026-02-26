-- AlterTable
ALTER TABLE "User" ADD COLUMN     "category" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "statusText" TEXT;
