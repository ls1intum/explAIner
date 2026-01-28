import { Injectable } from '@nestjs/common';

@Injectable()
export class SummaryService {
  create(sessionId: string) {
    return 'This action creates a summary block';
  }
}
