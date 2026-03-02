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
    "topic" TEXT NOT NULL,
    "learning_goal" TEXT NOT NULL,
    "learning_goal_blooms_level" "BloomsLevel" NOT NULL,
    "prior_knowledge" TEXT,
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
CREATE TABLE "inform_blocks" (
    "block_id" UUID NOT NULL,

    CONSTRAINT "inform_blocks_pkey" PRIMARY KEY ("block_id")
);

-- CreateTable
CREATE TABLE "inform_block_messages" (
    "id" UUID NOT NULL,
    "inform_block_id" UUID NOT NULL,
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
CREATE INDEX "inform_block_messages_inform_block_id_timestamp_idx" ON "inform_block_messages"("inform_block_id", "timestamp");

-- AddForeignKey
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inform_blocks" ADD CONSTRAINT "inform_blocks_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inform_block_messages" ADD CONSTRAINT "inform_block_messages_inform_block_id_fkey" FOREIGN KEY ("inform_block_id") REFERENCES "inform_blocks"("block_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_blocks" ADD CONSTRAINT "practice_blocks_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_blocks" ADD CONSTRAINT "summary_blocks_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add CHECK constraints to sessions table
ALTER TABLE "sessions"
  ADD CONSTRAINT "total_blocks_positive" CHECK (total_blocks >= 1);

ALTER TABLE "sessions"
  ADD CONSTRAINT "current_block_index_non_negative" CHECK (current_block_index >= 0);

ALTER TABLE "sessions"
  ADD CONSTRAINT "current_block_index_within_total" CHECK (current_block_index < total_blocks);

ALTER TABLE "sessions"
  ADD CONSTRAINT "user_feedback_range" CHECK (user_feedback IS NULL OR (user_feedback BETWEEN 1 AND 5));

-- Add CHECK constraints to blocks table
ALTER TABLE "blocks"
  ADD CONSTRAINT "order_index_non_negative" CHECK (order_index >= 0);

-- Add CHECK constraints to practice_blocks table
ALTER TABLE "practice_blocks"
  ADD CONSTRAINT "answer_options_exactly_four"
    CHECK (array_length(answer_options, 1) = 4);

ALTER TABLE "practice_blocks"
  ADD CONSTRAINT "correct_answer_indices_valid" CHECK (
    correct_answer_option_indices <@ ARRAY[0, 1, 2, 3] AND
    array_length(correct_answer_option_indices, 1) >= 1
  );

ALTER TABLE "practice_blocks"
  ADD CONSTRAINT "student_answer_indices_valid" CHECK (
    student_answer_option_indices <@ ARRAY[0, 1, 2, 3]
  );
