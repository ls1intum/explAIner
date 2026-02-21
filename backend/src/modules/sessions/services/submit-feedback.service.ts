import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SubmitFeedbackRequestDto } from '../dto/request/submit-feedback.request.dto';
import { SubmitFeedbackResponseDto } from '../dto/response/submit-feedback.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { requireSessionExists } from '../session.utils';

/** Persists user feedback (rating) for a completed session. */
@Injectable()
export class SubmitFeedbackService {
  constructor(private prisma: PrismaService) {}

  @LogService()
  async submit(
    sessionId: string,
    dto: SubmitFeedbackRequestDto,
  ): Promise<SubmitFeedbackResponseDto> {
    await requireSessionExists(this.prisma, sessionId);

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { userFeedback: dto.rating },
    });

    return { success: true as const, rating: dto.rating };
  }
}
