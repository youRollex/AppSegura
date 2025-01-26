import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO para el restablecimiento de contraseña de un usuario.
 * Este DTO define la estructura de datos requerida para que un usuario restablezca su contraseña.
*/

export class ResetPasswordDto {
  /**
   * Dirección de correo electrónico del usuario.
   * Debe ser una dirección válida.
   * @type {string}
   * @isEmail El valor debe tener un formato válido de correo electrónico.
  */
  @IsString()
  @IsEmail()
  email: string;

  /**
   * Respuesta a la pregunta de seguridad.
   * Debe tener al menos 1 carácter.
   * @type {string}
   * @minLength 1
  */
  @IsString()
  @MinLength(1)
  answer: string;

  /**
   * Nueva contraseña del usuario.
   * Debe tener entre 6 y 50 caracteres, contener al menos una letra mayúscula, una minúscula y un número o símbolo especial.
   * @type {string}
   * @minLength 6
   * @maxLength 50
   * @validationMessage La contraseña debe incluir al menos una letra mayúscula, una minúscula y un número o símbolo.
  */
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
