import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSessionRequestDto } from '../dto/request/create-session.request.dto';
import { GenerateBlockSequenceService } from '../../blocks/services/generate-block-sequence.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapSessionToCreateResponse } from '../session.utils';

@Injectable()
export class CreateSessionService {
  constructor(
    private prisma: PrismaService,
    private generateBlockSequenceService: GenerateBlockSequenceService,
  ) {}

  /** Create session with learning goal and initial block sequence (1 inform + 3 practice). */
  @LogService()
  async create(dto: CreateSessionRequestDto) {
    const session = await this.prisma.session.create({
      data: {
        topic: dto.topic,
        learningGoal: dto.learningGoal.learningGoal,
        learningGoalBloomsLevel: dto.learningGoal.bloomsLevel,
        priorKnowledge: dto.priorKnowledge ?? undefined,
      },
    });
    const { informBlock, practiceBlocks } =
      await this.generateBlockSequenceService.generate(session.id);
    const sortedPracticeBlocks = practiceBlocks.sort(
      (a, b) => a.orderIndex - b.orderIndex,
    );
    return mapSessionToCreateResponse(session, dto, [
      informBlock,
      ...sortedPracticeBlocks,
    ]);
  }
}
