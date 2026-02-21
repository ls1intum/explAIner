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
import { getSessionWithInformContent } from '../../sessions/session.utils';

@Injectable()
export class GenerateEasierLearningGoalsService {
  constructor(
    private prisma: PrismaService,
    private generateEasierLearningGoalsChain: GenerateEasierLearningGoalsChain,
  ) {}

  @LogService()
  async generate(dto: GenerateEasierLearningGoalsRequestDto): Promise<GenerateEasierLearningGoalsResponseDto> {
    // Fetch session with blocks + inform messages
    const session = await getSessionWithInformContent(this.prisma, dto.sessionId);
    // Build prompt context: wrong answers + covered content
    const wrongQuestions = formatWrongAnswersForPrompt(
      extractWrongAnswersFromBlocks(session.blocks),
    );
    const coveredContent = getCoveredContentFromInformBlocks(session.blocks);

    // Call LLM chain and return response
    const learningGoals = await this.generateEasierLearningGoalsChain.execute({
      topic: session.topic,
      originalGoal: session.learningGoal,
      originalBloomsLevel: session.learningGoalBloomsLevel,
      wrongQuestions,
      coveredContent,
    });

    return {
      topic: session.topic,
      priorKnowledge: session.priorKnowledge ?? undefined,
      learningGoals,
    };
  }
}
