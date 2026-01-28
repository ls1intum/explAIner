import { Injectable } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';

@Injectable()
export class BlocksService {
  create(createBlockDto: CreateBlockDto) {
    return 'This action adds a new block';
  }

  findOne(id: string) {
    return `This action returns a #${id} block`;
  }
}
