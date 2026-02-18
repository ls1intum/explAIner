import { BlockType } from '@prisma/client';
import type { WrongAnswer } from '../../domain/schemas/blocks/practice/practice-block.schema';


/**
 * Extracts wrong answers from the last sequence of practice blocks in a session
 * Used for generating subsequent block sequences that address misconceptions
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
    const informBlocks = blocks.filter((block) => block.type === BlockType.Inform);
    const blockSequenceCounter = informBlocks.length;
  
    // Get practice blocks from the last sequence (last 3 practice blocks)
    const lastSequenceStartIndex = (blockSequenceCounter - 1) * 4;
    const lastSequenceBlocks = blocks.slice(
      lastSequenceStartIndex,
      lastSequenceStartIndex + 4,
    );
    const lastSequencePracticeBlocks = lastSequenceBlocks.filter(
      (block) => block.type === BlockType.Practice && block.practiceBlock,
    );
  
    // Filter for incorrectly answered practice blocks
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
  