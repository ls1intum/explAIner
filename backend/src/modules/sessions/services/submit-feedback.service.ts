import { Injectable } from '@nestjs/common';
import { SubmitFeedbackRequestDto } from '../dto/request/submit-feedback.request.dto';
import { SubmitFeedbackResponseDto } from '../dto/response/submit-feedback.response.dto';
import { LogService } from '../../../common/decorators/service-logging.decorator';
import { SessionsRepository } from '../../shared/database/repositories/sessions.repository';

/** Service persisting user feedback (rating) for a completed session */
@Injectable()
export class SubmitFeedbackService {
  constructor(private sessionsRepository: SessionsRepository) {}

  @LogService()
  async submit(
    sessionId: string,
    dto: SubmitFeedbackRequestDto,
  ): Promise<SubmitFeedbackResponseDto> {

    // Ensure session exists
    await this.sessionsRepository.requireSessionExists(sessionId);

    // Persist rating in database
    await this.sessionsRepository.update(sessionId, { userFeedback: dto.rating });

    // Return response
    return { success: true as const, rating: dto.rating };
  }
}
