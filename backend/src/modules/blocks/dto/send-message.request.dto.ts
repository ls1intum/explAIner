import { IsString } from 'class-validator';

export class SendMessageRequestDto {
  @IsString()
  message: string;
}
