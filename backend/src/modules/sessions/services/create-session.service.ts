import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSessionRequestDto } from '../dto/request/create-session.request.dto';
import { GenerateBlockSequenceService } from '../../blocks/services/generate-block-sequence.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class CreateSessionService {
  constructor(
    private prisma: PrismaService,
    private generateBlockSequenceService: GenerateBlockSequenceService,
  ) {}

  /**
   * Create a new session with learning goals and initial block sequence
   * Returns session with 4 blocks (1 inform + 3 practice)
   */
  @LogService()
  async create(dto: CreateSessionRequestDto) {
    // 1. Create initial session with learning goals
    const session = await this.prisma.session.create({
      data: {
        learningTopicOrQuestion: dto.topic,
        learningGoal: dto.learningGoal,
        learningGoalBloomsLevel: dto.bloomsLevel,
        priorKnowledgeKeywords: dto.priorKnowledgeKeywords || undefined,
      },
    });

    // 2. Generate initial block sequence (1 inform + 3 practice blocks)
    // Mode is auto-detected as INITIAL since session has 0 blocks
    const { informBlock, practiceBlocks } =
      await this.generateBlockSequenceService.generate(session.id);

    // 3. Sort practice blocks by orderIndex to ensure correct order
    const sortedPracticeBlocks = practiceBlocks.sort(
      (a, b) => a.orderIndex - b.orderIndex
    );

    // 4. Return session with blocks (inform first, then practice blocks in order)
    return {
      id: session.id,
      topic: dto.topic,
      priorKnowledge: dto.priorKnowledgeKeywords || undefined,
      learningGoal: {
        learningGoal: dto.learningGoal,
        bloomsLevel: dto.bloomsLevel,
      },
      totalBlocks: 4,
      currentBlockIndex: 0,
      blocks: [informBlock, ...sortedPracticeBlocks],
    };
  }
}
