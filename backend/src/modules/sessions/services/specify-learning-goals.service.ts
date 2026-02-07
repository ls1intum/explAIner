import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BloomsLevel } from '@prisma/client';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class SpecifyLearningGoalsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Specify/persist learning goals for a session
   * Updates the session with topic, prior knowledge keywords, learning goal, and Bloom's level
   */
  @LogService()
  async specify(
    sessionId: string,
    topic: string,
    priorKnowledgeKeywords: string | undefined,
    learningGoal: string,
    bloomsLevel: string,
  ): Promise<void> {
    // Update session with learning goal details
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        learningTopicOrQuestion: topic,
        priorKnowledgeKeywords: priorKnowledgeKeywords,
        learningGoal: learningGoal,
        learningGoalBloomsLevel: bloomsLevel as BloomsLevel,
      },
    });
  }
}
