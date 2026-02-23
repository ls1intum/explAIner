import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSessionRequestDto } from '../dto/request/create-session.request.dto';
import { GenerateBlockSequenceService } from '../../blocks/services/generate-block-sequence.service';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { mapToCreateSessionResponseDto } from '../session.utils';

/** Service creating a new session including the initial block sequence */
@Injectable()
export class CreateSessionService {
  constructor(
    private prisma: PrismaService,
    private generateBlockSequenceService: GenerateBlockSequenceService,
  ) {}

  @LogService()
  async create(dto: CreateSessionRequestDto) {

    // Atomic: session + block sequence commit together or roll back on any failure
    return this.prisma.$transaction(async (tx) => {

      // Create session
      const session = await tx.session.create({
        data: {
          topic: dto.topic,
          learningGoal: dto.learningGoal.learningGoal,
          learningGoalBloomsLevel: dto.learningGoal.bloomsLevel,
          priorKnowledge: dto.priorKnowledge ?? undefined,
        },
      });

      // Generate block sequence
      const { informBlock, practiceBlocks } =
        await this.generateBlockSequenceService.generate(session.id, tx);

      // Return response
      return mapToCreateSessionResponseDto(session, dto, [
        informBlock,
        ...practiceBlocks,
      ]);
    }, { timeout: 30_000 });
  }
}
