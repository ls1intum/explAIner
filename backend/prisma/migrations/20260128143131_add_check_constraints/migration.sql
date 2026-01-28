-- Add CHECK constraints to sessions table
-- Ensure total_blocks is at least 1 (this is a count, not an index)
ALTER TABLE sessions
  ADD CONSTRAINT total_blocks_positive CHECK (total_blocks >= 1);

-- Ensure current_block_index starts from 0
ALTER TABLE sessions
  ADD CONSTRAINT current_block_index_non_negative CHECK (current_block_index >= 0);

-- Ensure current_block_index is less than total_blocks (0-based indexing)
ALTER TABLE sessions
  ADD CONSTRAINT current_block_index_within_total CHECK (current_block_index < total_blocks);

-- Ensure user_feedback is between 1 and 5 if provided
ALTER TABLE sessions
  ADD CONSTRAINT user_feedback_range CHECK (user_feedback IS NULL OR (user_feedback BETWEEN 1 AND 5));

-- Add CHECK constraints to blocks table
-- Ensure block ordering starts from 0
ALTER TABLE blocks
  ADD CONSTRAINT order_index_non_negative CHECK (order_index >= 0);

-- Add CHECK constraints to practice_blocks table
-- Ensure practice blocks have exactly 4 answer options
ALTER TABLE practice_blocks
  ADD CONSTRAINT answer_options_exactly_four
    CHECK (array_length(answer_options, 1) = 4);

-- Ensure correct answer indices are valid (0-3) and at least one exists
ALTER TABLE practice_blocks
  ADD CONSTRAINT correct_answer_indices_valid CHECK (
    correct_answer_option_indices <@ ARRAY[0, 1, 2, 3] AND
    array_length(correct_answer_option_indices, 1) >= 1
  );

-- Ensure student answer indices are valid (0-3) if provided
ALTER TABLE practice_blocks
  ADD CONSTRAINT student_answer_indices_valid CHECK (
    student_answer_option_indices <@ ARRAY[0, 1, 2, 3]
  );