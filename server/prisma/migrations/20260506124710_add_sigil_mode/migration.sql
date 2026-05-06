-- CreateEnum
CREATE TYPE "SigilMode" AS ENUM ('Elements', 'Details', 'Analysis', 'Chat');

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "sigil_mode" "SigilMode";
