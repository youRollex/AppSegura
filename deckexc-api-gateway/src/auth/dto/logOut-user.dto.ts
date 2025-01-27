import { IsUUID, IsString, Length, IsNotEmpty } from 'class-validator';

export class LogOutUserDto {
  /**
   * Identificador único del usuario.
   * Este campo debe ser un UUID válido y no puede estar vacío.
   *
   * @type {string}
   * @uuid El valor debe ser un UUID válido.
   * @isNotEmpty Este campo no puede estar vacío.
   */
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  /**
   * Identificador único del token.
   * Este campo es obligatorio y debe ser una cadena generada con `uuidv4()`.
   * La longitud del `jti` debe ser válida como un UUID (36 caracteres) y no puede estar vacío.
   *
   * @type {string}
   * @validationMessage El `jti` debe ser una cadena generada por uuidv4 y debe tener 36 caracteres.
   */
  @IsString()
  @Length(36, 36, { message: 'The jti must be exactly 36 characters long' })
  @IsNotEmpty()
  jti: string;
}
