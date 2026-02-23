import { Injectable } from '@nestjs/common';
import { GenerateEasierLearningGoalsRequestDto } from '../dto/request/generate-easier-learning-goals.request.dto';
import { GenerateEasierLearningGoalsResponseDto } from '../dto/response/generate-easier-learning-goals.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateEasierLearningGoalsChain } from '../../ai/llm/chains/generate-easier-learning-goals.chain';
import {
  extractWrongAnswersFromBlocks,
  formatWrongAnswersForPrompt,
  getCoveredContentFromInformBlocks,
} from '../../blocks/block.utils';
import { getSessionWithAllBlocks } from '../../sessions/session.utils';


/** Service generating 3 easier learning goals for a new session based on previous session content & wrong answers to previous practice questions */
@Injectable()
export class GenerateEasierLearningGoalsService {
  constructor(
    private prisma: PrismaService,
    private generateEasierLearningGoalsChain: GenerateEasierLearningGoalsChain,
  ) {}

  @LogService()
  async generate(
    dto: GenerateEasierLearningGoalsRequestDto,
  ): Promise<GenerateEasierLearningGoalsResponseDto> {

    // Fetch session
    const session = await getSessionWithAllBlocks(
      this.prisma,
      dto.sessionId,
    );

    // Create context for prompt
    const wrongQuestions = formatWrongAnswersForPrompt(
      extractWrongAnswersFromBlocks(session.blocks),
    );
    const coveredContent = getCoveredContentFromInformBlocks(session.blocks);
    
    // Call chain
    const learningGoals =
      await this.generateEasierLearningGoalsChain.execute({
        topic: session.topic,
        originalGoal: session.learningGoal,
        originalBloomsLevel: session.learningGoalBloomsLevel,
        wrongQuestions,
        coveredContent,
      });

    // Return response
    return {
      topic: session.topic,
      priorKnowledge: session.priorKnowledge ?? undefined,
      learningGoals,
    };
  }
}
