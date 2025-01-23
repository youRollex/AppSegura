import {
  IsUUID,
  IsString,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class UpdatePaymentDetailDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @Length(16, 16, { message: 'Card number must be exactly 16 characters long' })
  cardNumber?: string | null;

  @IsString()
  @Length(3, 4, { message: 'CVC must be 3 or 4 characters long' })
  cvc?: string | null;

  @IsString()
  expirationDate?: string | null;
}
