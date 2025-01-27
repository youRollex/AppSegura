import { IsString, MinLength, IsUUID } from 'class-validator';

/**
 * DTO para la creación de un nuevo mensaje en el sistema de chat.
 * Contiene información sobre el contenido del mensaje, el usuario que lo envió y su nombre.
 */
export class NewMessageDto {
  /**
   * Contenido del mensaje.
   * Debe ser una cadena de texto con al menos un carácter.
   * @type {string}
   * @isString El contenido debe ser una cadena de texto.
   * @minLength 1 El contenido debe tener al menos un carácter.
   */
  @IsString()
  @MinLength(1)
  message: string;

  /**
   * Identificador único del usuario que envía el mensaje.
   * Debe ser un UUID válido.
   * @type {string}
   * @isUUID El identificador debe ser un UUID válido.
   */
  @IsUUID()
  userId: string;

  /**
   * Nombre del usuario que envía el mensaje.
   * Debe ser una cadena de texto con al menos un carácter.
   * @type {string}
   * @isString El nombre debe ser una cadena de texto.
   * @minLength 1 El nombre debe tener al menos un carácter.
   */
  @IsString()
  @MinLength(1)
  userName: string;
}
