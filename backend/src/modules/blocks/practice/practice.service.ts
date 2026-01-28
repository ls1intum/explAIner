import { Injectable } from '@nestjs/common';

@Injectable()
export class PracticeService {
  create(data: any) {
    return 'This action creates a practice block';
  }

  submitAnswer(blockId: string, answerId: string, timeSpent: number) {
    return 'This action submits an answer';
  }
}
