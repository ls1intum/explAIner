import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubmitAnswerRequestDto } from '../dto/request/submit-answer.request.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';

@Injectable()
export class SubmitAnswerService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async submit(
    sessionId: string,
    orderIndex: string,
    dto: SubmitAnswerRequestDto,
  ): Promise<void> {
    const orderIndexNum = parseInt(orderIndex, 10);

    // Get the block with practice block data
    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: {
          sessionId,
          orderIndex: orderIndexNum,
        },
      },
      include: {
        practiceBlock: true,
      },
    });

    if (!block || !block.practiceBlock) {
      throw new NotFoundException('Practice block not found');
    }

    const { correctAnswerOptionIndices } = block.practiceBlock;
    const { studentAnswerOptionIndices } = dto;

    // Calculate correctness for analytics/record-keeping
    const studentAnswerIsCorrect =
      studentAnswerOptionIndices.length ===
        correctAnswerOptionIndices.length &&
      studentAnswerOptionIndices.every((idx) =>
        correctAnswerOptionIndices.includes(idx),
      );

    // Update practice block with student answer and correctness
    await this.prisma.practiceBlock.update({
      where: { blockId: block.id },
      data: {
        studentAnswerOptionIndices,
        studentAnswerIsCorrect,
      },
    });

    // No return - HTTP 204 No Content
  }
}
