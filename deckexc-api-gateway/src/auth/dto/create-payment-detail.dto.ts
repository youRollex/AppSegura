import { IsUUID, IsString, IsDateString, Length, IsNotEmpty } from 'class-validator';

export class CreatePaymentDetailDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @Length(16, 16, { message: 'Card number must be exactly 16 characters long' })
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @Length(3, 4, { message: 'CVC must be 3 or 4 characters long' })
  @IsNotEmpty()
  cvc: string;

  @IsString()
  @IsNotEmpty()
  expirationDate: string;
}