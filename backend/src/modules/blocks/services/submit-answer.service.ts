import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubmitAnswerRequestDto } from '../dto/request/submit-answer.request.dto';
import { SubmitAnswerResponseDto } from '../dto/response/submit-answer.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import {
  isStudentAnswerCorrect,
  mapSubmitAnswerResponse,
} from '../block.utils';

/** Saves student answer for a practice block and computes correctness. */
@Injectable()
export class SubmitAnswerService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async submit(
    sessionId: string,
    orderIndex: string,
    dto: SubmitAnswerRequestDto,
  ): Promise<SubmitAnswerResponseDto> {
    const orderIndexNum = parseInt(orderIndex, 10);

    // Get the block with practice block data
    const block = await this.prisma.block.findUnique({
      where: {
        sessionId_orderIndex: { sessionId, orderIndex: orderIndexNum },
      },
      include: { practiceBlock: true },
    });
    if (!block?.practiceBlock) {
      throw new NotFoundException('Practice block not found');
    }

    // Calculate correctness (compare student indices to correct indices)
    const studentAnswerIsCorrect = isStudentAnswerCorrect(
      block.practiceBlock.correctAnswerOptionIndices,
      dto.studentAnswerOptionIndices,
    );

    // Update practice block with student answer and correctness
    await this.prisma.practiceBlock.update({
      where: { blockId: block.id },
      data: {
        studentAnswerOptionIndices: dto.studentAnswerOptionIndices,
        studentAnswerIsCorrect,
      },
    });

    return mapSubmitAnswerResponse(dto.studentAnswerOptionIndices);
  }
}
