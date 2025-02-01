import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { OfferCondition } from '../enum/offer-condition.enum';
/**
* DTO para la creación de una oferta.
* Define la estructura y validaciones requeridas para crear una nueva oferta.
*/
export class CreateOfferDto {
  /**
   * Identificador único de la tarjeta asociada a la oferta.
   * - Debe ser una cadena de texto.
   * - No puede estar vacío.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsNotEmpty()
  @IsString()
  cardId: string;
  /**
   * Descripción detallada de la oferta.
   * - Debe ser una cadena de texto.
   * - Debe tener al menos un carácter.
   * @example "Tarjeta coleccionable en perfecto estado."
   */
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  description: string;
  /**
   * Condición de la oferta, basada en un conjunto de valores predefinidos.
   * - Debe ser un valor válido del enum `OfferCondition`.
   * @example OfferCondition.NEW
   */
  @IsEnum(OfferCondition)
  condition: OfferCondition;
  /**
   * Precio de la oferta en valor numérico.
   * - Debe ser un número válido.
   * @example 150.00
   */ 
  @IsNumber()
  @Min(1, { message: 'El precio debe ser mayor que 0.' })
  @Max(1000000, { message: 'El precio debe ser menor o igual que que 1000000.' })
  price: number;
}