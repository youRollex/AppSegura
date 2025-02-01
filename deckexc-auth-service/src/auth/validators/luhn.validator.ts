import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isLuhnValid', async: false })
export class IsLuhnValid implements ValidatorConstraintInterface {
  validate(cardNumber: string, args: ValidationArguments) {
    if (!/^\d{16}$/.test(cardNumber)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The card number is invalid';
  }
}