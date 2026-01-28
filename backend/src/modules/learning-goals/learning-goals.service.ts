import { Injectable } from '@nestjs/common';
import { GenerateGoalsDto } from './dto/generate-goals.dto';

@Injectable()
export class LearningGoalsService {
  generate(generateGoalsDto: GenerateGoalsDto) {
    return 'This action generates learning goals';
  }

  findOne(id: string) {
    return `This action returns a #${id} learning goal`;
  }
}
