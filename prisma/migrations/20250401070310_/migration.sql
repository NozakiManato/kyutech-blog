-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "description" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "isCheckedIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "x" TEXT;
