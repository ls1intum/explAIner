import { BlockType } from '@prisma/client';
import type { WrongAnswer } from '../../../domain/schemas/blocks/practice/practice-block.schema';
import {
  getCurrentBlockSequenceBlocks,
  getPracticeBlocks,
} from '../../sessions/utils/session.utils';

/**
 * Extracts wrong answers from the last sequence of practice blocks in a session.
 * Used for generating subsequent block sequences that address misconceptions.
 */
export function extractWrongAnswersFromLastSequence(
  blocks: Array<{
    type: BlockType;
    practiceBlock?: {
      question: string;
      answerOptions: string[];
      correctAnswerOptionIndices: number[];
      studentAnswerOptionIndices: number[];
      studentAnswerIsCorrect: boolean | null;
    } | null;
  }>,
): WrongAnswer[] {
  const lastSequenceBlocks = getCurrentBlockSequenceBlocks(blocks);
  const lastSequencePracticeBlocks = getPracticeBlocks(lastSequenceBlocks);

  return lastSequencePracticeBlocks
    .filter((block) => block.practiceBlock?.studentAnswerIsCorrect === false)
    .map((block) => {
      const pb = block.practiceBlock!;
      return {
        question: pb.question,
        correctAnswerOptions: pb.correctAnswerOptionIndices.map(
          (idx) => pb.answerOptions[idx],
        ),
        wrongStudentAnswerOptions: pb.studentAnswerOptionIndices.map(
          (idx) => pb.answerOptions[idx],
        ),
      };
    });
}
