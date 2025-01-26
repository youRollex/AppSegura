import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO para el inicio de sesión de un usuario.
 * Este DTO define la estructura de datos requerida para autenticar a un usuario existente.
*/

export class LoginUserDto {
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
   * Contraseña del usuario.
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

  /*@IsString()
  captchaToken?: string|null;*/
}
