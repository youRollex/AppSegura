import {
  IsUUID,
  IsString,
  Length,
  IsNotEmpty,
} from 'class-validator';

/**
 * DTO para la actualización de los detalles de pago.
 * Este DTO define la estructura de datos requerida para actualizar los detalles de pago de un usuario.
*/

export class UpdatePaymentDetailDto {
  /**
   * Identificador único del usuario.
   * Este campo no puede estar vacío.
   * @type {string}
   * @uuid El valor debe ser un UUID válido.
   * @isNotEmpty Este campo no puede estar vacío.
  */
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  /**
   * Número de tarjeta de crédito.
   * Este campo es opcional. Si se proporciona, debe tener exactamente 16 caracteres de longitud.
   * @type {string | null}
   * @length 16
   * @validationMessage El número de la tarjeta debe tener exactamente 16 caracteres.
  */
  @IsString()
  @Length(16, 16, { message: 'Card number must be exactly 16 characters long' })
  cardNumber?: string | null;

  /**
   * Código de verificación (CVC) de la tarjeta de crédito.
   * Este campo es opcional. Si se proporciona, debe tener entre 3 y 4 caracteres de longitud.
   * @type {string | null}
   * @length 3-4
   * @validationMessage El CVC debe tener entre 3 y 4 caracteres.
  */
  @IsString()
  @Length(3, 4, { message: 'CVC must be 3 or 4 characters long' })
  cvc?: string | null;

  /**
   * Fecha de expiración de la tarjeta de crédito.
   * Este campo es opcional. Si se proporciona, debe ser una cadena de caracteres que represente la fecha de expiración.
   * @type {string | null}
  */
  @IsString()
  expirationDate?: string | null;
}
