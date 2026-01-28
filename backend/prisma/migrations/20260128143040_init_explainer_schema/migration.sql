-- CreateEnum
CREATE TYPE "BloomsLevel" AS ENUM ('Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('Inform', 'Practice', 'Summary');

-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('User', 'Owlbert');

-- CreateEnum
CREATE TYPE "SoloLevel" AS ENUM ('Unistructural', 'Multistructural', 'Relational', 'ExtendedAbstract');

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "learning_topic_or_question" TEXT NOT NULL,
    "learning_goal" TEXT NOT NULL,
    "learning_goal_blooms_level" "BloomsLevel" NOT NULL,
    "prior_knowledge_keywords" TEXT,
    "total_blocks" INTEGER NOT NULL DEFAULT 1,
    "current_block_index" INTEGER NOT NULL DEFAULT 0,
    "user_feedback" SMALLINT,
    "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocks" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "order_index" INTEGER NOT NULL,
    "already_viewed" BOOLEAN NOT NULL DEFAULT false,
    "type" "BlockType" NOT NULL,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inform_block_messages" (
    "id" UUID NOT NULL,
    "block_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "sender" "MessageSender" NOT NULL,
    "timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inform_block_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_blocks" (
    "block_id" UUID NOT NULL,
    "solo_level" "SoloLevel" NOT NULL,
    "question" TEXT NOT NULL,
    "answer_options" TEXT[],
    "correct_answer_option_indices" INTEGER[],
    "student_answer_option_indices" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "student_answer_is_correct" BOOLEAN,

    CONSTRAINT "practice_blocks_pkey" PRIMARY KEY ("block_id")
);

-- CreateTable
CREATE TABLE "summary_blocks" (
    "block_id" UUID NOT NULL,
    "session_summary" TEXT NOT NULL,

    CONSTRAINT "summary_blocks_pkey" PRIMARY KEY ("block_id")
);

-- CreateIndex
CREATE INDEX "blocks_session_id_order_index_idx" ON "blocks"("session_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_session_id_order_index_key" ON "blocks"("session_id", "order_index");

-- CreateIndex
CREATE INDEX "inform_block_messages_block_id_timestamp_idx" ON "inform_block_messages"("block_id", "timestamp");

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inform_block_messages" ADD CONSTRAINT "inform_block_messages_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_blocks" ADD CONSTRAINT "practice_blocks_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_blocks" ADD CONSTRAINT "summary_blocks_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
