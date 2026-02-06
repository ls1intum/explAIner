import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateEasierLearningGoalsRequestDto } from '../dto/generate-easier-learning-goals.request.dto';
import { GenerateEasierLearningGoalsResponseDto } from '../dto/generate-easier-learning-goals.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateLearningGoalsChain } from '../../ai/chains/generate-learning-goals.chain';
import { generateEasierLearningGoalsPrompt } from '../../ai/prompts/generate-easier-learning-goals.prompt';
import { BlockType } from '@prisma/client';

@Injectable()
export class GenerateEasierLearningGoalsService {
  constructor(
    private prisma: PrismaService,
    private generateLearningGoalsChain: GenerateLearningGoalsChain,
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
            informBlockMessages: true,
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
      (block) => block.type === BlockType.Inform && block.informBlockMessages,
    );
    
    const coveredContent = informBlocks
      .map((block) => 
        block.informBlockMessages
          .map((msg) => msg.message)
          .join('\n')
      )
      .join('\n\n');

    // 4. Generate prompt for easier learning goals
    const prompt = generateEasierLearningGoalsPrompt({
      topic: session.learningTopicOrQuestion,
      originalGoal: session.learningGoal,
      originalBloomsLevel: session.learningGoalBloomsLevel,
      wrongQuestions: wrongPracticeBlocks,
      coveredContent: coveredContent.substring(0, 2000), // Limit content length
    });

    // 5. Call chain to generate easier learning goals
    const learningGoals = await this.generateLearningGoalsChain.execute(
      prompt,
      'generate-easier-learning-goals.prompt.ts',
    );

    // 6. Return complete response with topic, prior knowledge keywords, and learning goals
    return {
      topic: session.learningTopicOrQuestion,
      priorKnowledgeKeywords: session.priorKnowledgeKeywords || '',
      learningGoals: learningGoals.map((goal) => ({
        learningGoal: goal.learningGoal,
        bloomsLevel: goal.bloomsLevel,
      })),
    };
  }
}
