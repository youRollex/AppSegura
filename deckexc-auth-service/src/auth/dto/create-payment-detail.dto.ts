import { IsUUID, IsString, IsDateString, Length, IsNotEmpty } from 'class-validator';

/**
  * DTO para la creación de un nuevo detalle de pago
  * Contiene información del usuario y los datos de la tarjeta de crédito
  */

export class CreatePaymentDetailDto {
  /**
   * Identificador único del usuario
   * @type {string}
   * @uuid
   * @isNotEmpty Este campo no puede estar vacío
  */
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  /**
   * Número de tarjeta de crédito
   * Debe tener exactamente 16 caracteres de longitud.
   * @type {string}
   * @length 16
   * @isNotEmpty Este campo no puede estar vacío
   * @validationMessage El número de la tarjeta debe tener exactamente 16 caracteres.
  */

  @IsString()
  @Length(16, 16, { message: 'Card number must be exactly 16 characters long' })
  @IsNotEmpty()
  cardNumber: string;

  /**
   * Código de verificación (CVC) de la tarjeta de crédito.
   * Debe tener entre 3 y 4 caracteres.
   * @type {string}
   * @length 3-4
   * @isNotEmpty Este campo no puede estar vacío.
   * @validationMessage El CVC debe tener entre 3 y 4 caracteres.
  */

  @IsString()
  @Length(3, 4, { message: 'CVC must be 3 or 4 characters long' })
  @IsNotEmpty()
  cvc: string;

  /**
   * Fecha de expiración de la tarjeta de crédito.
   * @type {string}
   * @format MM/YY
   * @isNotEmpty Este campo no puede estar vacío.
  */
  @IsString()
  @IsNotEmpty()
  expirationDate: string;
}