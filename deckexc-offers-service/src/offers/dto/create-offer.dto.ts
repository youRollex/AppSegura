import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { OfferCondition } from '../enum/offer-condition.enum';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsString()
  cardId: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsEnum(OfferCondition)
  condition: OfferCondition;

  @IsNumber()
  price: number;
}
