import { Injectable } from '@nestjs/common';
import { GenerateSummaryDto } from '../dto/generate-summary.dto';

@Injectable()
export class GenerateSummaryBlockService {
  async generate(dto: GenerateSummaryDto) {
    // Implementation:
    // 1. Call AI service: generate-summary-block.service.ts
    // 2. Persist summary block to database
    // 3. Return the summary
    return { sessionSummary: '' };
  }
}
