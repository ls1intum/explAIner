-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "sosci_case" VARCHAR(16);

-- CreateIndex
CREATE INDEX "sessions_sosci_case_idx" ON "sessions"("sosci_case");
