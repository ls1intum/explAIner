import { GetBlockResponseDto } from '../../blocks/dto/get-block-by-order-index.response.dto';

export class GetSessionResponseDto {
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
