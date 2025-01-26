import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50) // Máximo de 50 caracteres para el nombre
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200) // Máximo de 200 caracteres para la URL de la imagen
  imageUrl: string;
}
