import { BloomsLevel } from '../../../common/types/blooms-level.enum';

export class LearningGoalResponseDto {
  learningGoal: string;
  bloomsLevel: BloomsLevel;
  actionVerb: string;
}
