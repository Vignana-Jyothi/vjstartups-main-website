-- AlterTable
-- Column names are unquoted-camelCase to match this schema's convention of
-- having no per-field @map() - the Prisma field name IS the column name.
ALTER TABLE "problems"
ADD COLUMN "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "verifiedBy" TEXT,
ADD COLUMN "verifiedAt" TIMESTAMP(3),
ADD COLUMN "verificationNotes" TEXT;

-- CreateIndex
CREATE INDEX "problems_verified_idx" ON "problems"("verified");
