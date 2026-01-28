import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  create(createSessionDto: CreateSessionDto) {
    return 'This action adds a new session';
  }

  findOne(id: string) {
    return `This action returns a #${id} session`;
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: string) {
    return `This action removes a #${id} session`;
  }
}
