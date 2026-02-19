import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateEasierLearningGoalsRequestDto } from '../dto/request/generate-easier-learning-goals.request.dto';
import { GenerateEasierLearningGoalsResponseDto } from '../dto/response/generate-easier-learning-goals.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateEasierLearningGoalsChain } from '../../ai/llm/chains/generate-easier-learning-goals.chain';
import { BlockType } from '@prisma/client';

@Injectable()
export class GenerateEasierLearningGoalsService {
  constructor(
    private prisma: PrismaService,
    private generateEasierLearningGoalsChain: GenerateEasierLearningGoalsChain,
  ) {}

  @LogService()
  async generate(dto: GenerateEasierLearningGoalsRequestDto): Promise<GenerateEasierLearningGoalsResponseDto> {
    // 1. Fetch session data with all blocks
    const session = await this.prisma.session.findUnique({
      where: { id: dto.sessionId },
      include: {
        blocks: {
          include: {
            practiceBlock: true,
            informBlock: { include: { messages: true } },
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

    // 2. Extract all wrong practice blocks
    const allPracticeBlocks = session.blocks.filter(
      (block) => block.type === BlockType.Practice && block.practiceBlock,
    );

    const wrongPracticeBlocks = allPracticeBlocks
      .filter((block) => block.practiceBlock?.studentAnswerIsCorrect === false)
      .map((block) => {
        const pb = block.practiceBlock!;
        const correctAnswers = pb.correctAnswerOptionIndices
          .map((idx) => pb.answerOptions[idx])
          .join(', ');
        const wrongAnswers = pb.studentAnswerOptionIndices
          .map((idx) => pb.answerOptions[idx])
          .join(', ');
        
        return `Question: ${pb.question}\nCorrect Answer(s): ${correctAnswers}\nStudent's Answer(s): ${wrongAnswers}`;
      });

    // 3. Extract covered content from inform blocks
    const informBlocks = session.blocks.filter(
      (block) => block.type === BlockType.Inform && block.informBlock,
    );

    const coveredContent = informBlocks
      .map((block) =>
        block.informBlock!.messages
          .map((msg) => msg.message)
          .join('\n'),
      )
      .join('\n\n');

    // 4. Call chain with structured params (chain handles prompt generation)
    const learningGoals = await this.generateEasierLearningGoalsChain.execute({
      topic: session.topic,
      originalGoal: session.learningGoal,
      originalBloomsLevel: session.learningGoalBloomsLevel,
      wrongQuestions: wrongPracticeBlocks,
      coveredContent: coveredContent.substring(0, 2000), // Limit content length
    });

    // 5. Return complete response (chain already returns correct tuple structure)
    return {
      topic: session.topic,
      priorKnowledge: session.priorKnowledge ?? undefined,
      learningGoals: learningGoals,
    };
  }
}
