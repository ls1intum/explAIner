import { GetBlockResponseDto } from '../../blocks/dto/get-block-by-order-index.response.dto';

export class CreateSessionResponseDto {
  session: {
    id: string;
    topic: string;
    learningGoal: string;
    bloomsLevel: string;
    totalBlocks: number;
    currentBlockIndex: number;
  };
  blocks: GetBlockResponseDto[];
}
