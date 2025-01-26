import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Question } from '../enum/question.enum';

/**
  * DTO para la creación de un usuario.
  * Este DTO define la estructura de datos requerida para registrar un nuevo usuario.
  */

export class CreateUserDto {
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

  /**
   * Nombre del usuario.
   * Debe tener al menos 1 carácter.
   * @type {string}
   * @minLength 1
  */
  @IsString()
  @MinLength(1)
  name: string;

  /**
   * Pregunta de seguridad seleccionada por el usuario.
   * Debe ser un valor definido en el enum `Question`.
   * @type {Question}
   * @isEnum La pregunta debe ser un valor válido del enum `Question`.
  */
  @IsEnum(Question)
  question: Question;

  /**
   * Respuesta a la pregunta de seguridad.
   * Debe tener al menos 1 carácter y máximo 20 carácteres.
   * @type {string}
   * @minLength 3
   * @maxLength 20
  */
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  answer: string;
}
