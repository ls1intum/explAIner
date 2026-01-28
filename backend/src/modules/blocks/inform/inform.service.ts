import { Injectable } from '@nestjs/common';

@Injectable()
export class InformService {
  create(data: any) {
    return 'This action creates an inform block';
  }

  handleFollowUpQuestion(blockId: string, question: string) {
    return 'This action handles a follow-up question';
  }
}
