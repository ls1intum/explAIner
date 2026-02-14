import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateInitialBlockSequenceChain } from '../../ai/chains/generate-initial-block-sequence.chain';
import { GenerateSubsequentBlockSequenceChain } from '../../ai/chains/generate-subsequent-block-sequence.chain';
import { BlockSequenceMode } from '../../../common/enums/block-sequence-mode.enum';
import { BlockType, SoloLevel } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import type { WrongAnswer } from '../../../common/types/practice-blocks.types';
import { GenerateBlockSequenceResponseDto } from '../dto/response/generate-block-sequence.response.dto';
import { getSOLOLevelsForBlooms } from '../../../common/utils/didactical-frameworks/solo-taxonomy.util';

/**
 * Unified service for generating block sequences (initial or subsequent)
 * Automatically detects mode based on session state:
 * - 0 blocks → INITIAL mode (keyFacts)
 * - Has blocks → SUBSEQUENT mode (keyMisconceptions addressing wrong answers)
 */
@Injectable()
export class GenerateBlockSequenceService {
  constructor(
    private prisma: PrismaService,
    private generateInitialBlockSequenceChain: GenerateInitialBlockSequenceChain,
    private generateSubsequentBlockSequenceChain: GenerateSubsequentBlockSequenceChain,
  ) {}

  @LogService()
  async generate(sessionId: string): Promise<GenerateBlockSequenceResponseDto> {
    // 1. Fetch session with all blocks
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        blocks: {
          include: {
            practiceBlock: true,
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // 2. Auto-detect mode based on existing blocks
    const mode = session.blocks.length === 0 
      ? BlockSequenceMode.INITIAL 
      : BlockSequenceMode.SUBSEQUENT;

    // 3. Calculate starting order index
    const nextOrderIndexStart = mode === BlockSequenceMode.INITIAL 
      ? 0 
      : session.blocks.length;

    // 4. Extract wrong answers (only for SUBSEQUENT mode)
    let wrongAnswers: WrongAnswer[] = [];
    if (mode === BlockSequenceMode.SUBSEQUENT) {
      const informBlocks = session.blocks.filter(
        (block) => block.type === BlockType.Inform,
      );
      const blockSequenceCounter = informBlocks.length;

      // Get practice blocks from the last sequence (last 3 practice blocks)
      const lastSequenceStartIndex = (blockSequenceCounter - 1) * 4;
      const lastSequenceBlocks = session.blocks.slice(
        lastSequenceStartIndex,
        lastSequenceStartIndex + 4,
      );
      const lastSequencePracticeBlocks = lastSequenceBlocks.filter(
        (block) => block.type === BlockType.Practice && block.practiceBlock,
      );

      // Filter for incorrectly answered practice blocks
      wrongAnswers = lastSequencePracticeBlocks
        .filter(
          (block) => block.practiceBlock?.studentAnswerIsCorrect === false,
        )
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

    // 5. Get prior knowledge context
    const priorKnowledge = session.priorKnowledgeKeywords || '';

    // 6. Determine appropriate SOLO levels based on Bloom's level
    const soloLevels = getSOLOLevelsForBlooms(session.learningGoalBloomsLevel);

    // 7. Call appropriate chain based on mode
    const blockSequence = mode === BlockSequenceMode.INITIAL
      ? await this.generateInitialBlockSequenceChain.execute({
          topic: session.learningTopicOrQuestion,
          learningGoal: session.learningGoal,
          bloomsLevel: session.learningGoalBloomsLevel,
          priorKnowledge,
          soloLevels,
        })
      : await this.generateSubsequentBlockSequenceChain.execute({
          topic: session.learningTopicOrQuestion,
          learningGoal: session.learningGoal,
          bloomsLevel: session.learningGoalBloomsLevel,
          priorKnowledge,
          wrongAnswers,
          soloLevels,
        });

    // 8. Create inform block with formatted message
    let content: string[];
    let label: string;
    
    if (mode === BlockSequenceMode.INITIAL) {
      content = 'keyFacts' in blockSequence.informBlock ? blockSequence.informBlock.keyFacts : [];
      label = 'KEY FACTS';
    } else {
      content = 'keyMisconceptions' in blockSequence.informBlock ? blockSequence.informBlock.keyMisconceptions : [];
      label = 'KEY MISCONCEPTIONS';
    }
    
    const formattedMessage = `${blockSequence.informBlock.explanation}

${label}
${content.map(item => `${item}`).join('\n')}

SUMMARY
${blockSequence.informBlock.summary}`;

    const informBlock = await this.prisma.block.create({
      data: {
        sessionId,
        orderIndex: nextOrderIndexStart,
        type: BlockType.Inform,
        alreadyViewed: mode === BlockSequenceMode.INITIAL, // Only initial block is pre-viewed
        informBlockMessages: {
          create: [
            {
              message: formattedMessage,
              sender: 'Owlbert',
            },
          ],
        },
      },
      include: {
        informBlockMessages: true,
      },
    });

    // 9. Create 3 practice blocks
    const practiceBlocks = await Promise.all(
      blockSequence.practiceBlocks.map(async (practiceBlock, index) => {
        return this.prisma.block.create({
          data: {
            sessionId,
            orderIndex: nextOrderIndexStart + index + 1,
            type: BlockType.Practice,
            practiceBlock: {
              create: {
                soloLevel: practiceBlock.soloLevel as SoloLevel,
                question: practiceBlock.question,
                answerOptions: practiceBlock.answerOptions,
                correctAnswerOptionIndices: practiceBlock.correctAnswerOptionIndices,
              },
            },
          },
          include: {
            practiceBlock: true,
          },
        });
      }),
    );

    // 10. Update session total blocks count
    const newTotal = mode === BlockSequenceMode.INITIAL 
      ? 4 
      : session.totalBlocks + 4;
    
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { totalBlocks: newTotal },
    });

    // 11. Return all blocks (inform + practice) mapped to DTOs
    return {
      informBlock: {
        id: informBlock.id,
        sessionId: informBlock.sessionId,
        orderIndex: informBlock.orderIndex,
        alreadyViewed: informBlock.alreadyViewed,
        type: informBlock.type,
        informBlockMessages: informBlock.informBlockMessages?.map((msg) => ({
          id: msg.id,
          blockId: msg.blockId,
          message: msg.message,
          sender: msg.sender,
          timestamp: msg.timestamp.toISOString(),
        })),
      },
      practiceBlocks: practiceBlocks.map((block) => ({
        id: block.id,
        sessionId: block.sessionId,
        orderIndex: block.orderIndex,
        alreadyViewed: block.alreadyViewed,
        type: block.type,
        practiceBlock: block.practiceBlock ?? undefined,
      })),
    };
  }
}
