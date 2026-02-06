export class ContinueSessionResponseDto {
  action: 'navigate' | 'next-sequence' | 'summary' | 'prompt-user';
  nextOrderIndex?: number; // For 'navigate' action only
}
