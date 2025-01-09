import { IsString, MinLength } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  imageUrl: string;
}
