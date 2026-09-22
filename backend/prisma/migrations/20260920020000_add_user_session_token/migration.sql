-- AlterTable
ALTER TABLE "users"
ADD COLUMN "sessionToken" TEXT,
ADD COLUMN "sessionTokenCreatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_sessionToken_key" ON "users"("sessionToken");
