import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateBlockSequenceChain } from '../../ai/llm/chains/generate-block-sequence.chain';
import { BlockSequenceMode } from '../../../domain/schemas/blocks/block-sequence.schema';
import { BlockType, SoloLevel } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import type { WrongAnswer } from '../../../domain/schemas/blocks/practice/practice-block.schema';
import { GenerateBlockSequenceResponseDto } from '../dto/response/generate-block-sequence.response.dto';
import { getSOLOLevelsForBlooms } from '../../../domain/didactical-frameworks/solo-taxonomy.util';
import { extractWrongAnswersFromLastSequence } from '../../../common/utils/block.utils';


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
    private generateBlockSequenceChain: GenerateBlockSequenceChain,
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
    const wrongAnswers: WrongAnswer[] = 
      mode === BlockSequenceMode.SUBSEQUENT
        ? extractWrongAnswersFromLastSequence(session.blocks)
        : [];

    // 5. Get prior knowledge context
    const priorKnowledge = session.priorKnowledgeKeywords || '';

    // 6. Determine appropriate SOLO levels based on Bloom's level
    const soloLevels = getSOLOLevelsForBlooms(session.learningGoalBloomsLevel);

    // 7. Call unified chain with mode parameter
    const blockSequence = await this.generateBlockSequenceChain.execute({
      mode,
      topic: session.learningTopicOrQuestion,
      learningGoal: session.learningGoal,
      bloomsLevel: session.learningGoalBloomsLevel,
      priorKnowledge,
      wrongAnswers: mode === BlockSequenceMode.SUBSEQUENT ? wrongAnswers : undefined,
      soloLevels,
    });

    // 8. Create inform block with formatted message
    const label = mode === BlockSequenceMode.INITIAL ? 'KEY FACTS' : 'KEY MISCONCEPTIONS';
    const keyPoints =
      'keyFacts' in blockSequence.informBlock
        ? blockSequence.informBlock.keyFacts
        : blockSequence.informBlock.keyMisconceptions;

    const formattedMessage = `${blockSequence.informBlock.explanation}

${label}
${keyPoints.map(item => `${item}`).join('\n')}

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

    // 11. Return all blocks mapped to block schema structure
    const mapPracticeBlock = (block: any) => ({
      id: block.id,
      sessionId: block.sessionId,
      orderIndex: block.orderIndex,
      alreadyViewed: block.alreadyViewed,
      type: 'Practice' as const,
      content: {
        blockId: block.practiceBlock.blockId,
        soloLevel: block.practiceBlock.soloLevel,
        question: block.practiceBlock.question,
        answerOptions: block.practiceBlock.answerOptions,
        correctAnswerOptionIndices: block.practiceBlock.correctAnswerOptionIndices,
        studentAnswerOptionIndices: block.practiceBlock.studentAnswerOptionIndices,
        studentAnswerIsCorrect: block.practiceBlock.studentAnswerIsCorrect,
      },
    });

    return {
      informBlock: {
        id: informBlock.id,
        sessionId: informBlock.sessionId,
        orderIndex: informBlock.orderIndex,
        alreadyViewed: informBlock.alreadyViewed,
        type: 'Inform' as const,
        content: informBlock.informBlockMessages?.map((msg) => ({
          id: msg.id,
          blockId: msg.blockId,
          message: msg.message,
          sender: msg.sender,
          timestamp: (msg.timestamp as Date).toISOString(),
        })) || [],
      },
      practiceBlocks: [
        mapPracticeBlock(practiceBlocks[0]),
        mapPracticeBlock(practiceBlocks[1]),
        mapPracticeBlock(practiceBlocks[2]),
      ],
    };
  }
}
