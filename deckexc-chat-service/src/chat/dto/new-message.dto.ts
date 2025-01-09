import { IsString, MinLength, IsUUID } from 'class-validator';

export class NewMessageDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsUUID()
  userId: string;

  @IsString()
  @MinLength(1)
  userName: string;
}
