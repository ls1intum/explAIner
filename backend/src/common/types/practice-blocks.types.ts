/**
 * Practice Block Types
 *
 * Shared types used across AI chains and prompts for practice block generation.
 */

export interface WrongAnswer {
  question: string;
  correctAnswerOptions: string[];
  wrongStudentAnswerOptions: string[];
}
