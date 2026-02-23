import { Injectable } from '@nestjs/common';
import { GenerateEasierLearningGoalsRequestDto } from '../dto/request/generate-easier-learning-goals.request.dto';
import { GenerateEasierLearningGoalsResponseDto } from '../dto/response/generate-easier-learning-goals.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { GenerateEasierLearningGoalsChain } from '../../shared/llm/chains/generate-easier-learning-goals.chain';
import {
  formatWrongAnswersForPrompt,
  extractCoveredContentFromInformBlocks,
} from '../learning-goals.utils';
import { extractWrongAnswersFromPracticeBlocks } from '../../shared/shared.utils';
import { SessionsRepository } from '../../shared/database/sessions.repository';

/** Service generating 3 easier learning goals for a new session based on previous session content & wrong answers to previous practice questions */
@Injectable()
export class GenerateEasierLearningGoalsService {
  constructor(
    private sessionsRepository: SessionsRepository,
    private generateEasierLearningGoalsChain: GenerateEasierLearningGoalsChain,
  ) {}

  @LogService()
  async generate(
    dto: GenerateEasierLearningGoalsRequestDto,
  ): Promise<GenerateEasierLearningGoalsResponseDto> {

    // Fetch session
    const session = await this.sessionsRepository.getSessionWithAllBlocks(
      dto.sessionId,
    );

    // Create context for prompt
    const wrongQuestions = formatWrongAnswersForPrompt(
      extractWrongAnswersFromPracticeBlocks(session.blocks, 'all'),
    );
    const coveredContent = extractCoveredContentFromInformBlocks(session.blocks);
    
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
