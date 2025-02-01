import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'isValidExpirationDate', async: false })
export class IsValidExpirationDate implements ValidatorConstraintInterface {
  validate(expirationDate: string, args: ValidationArguments) {
    if (!/^\d{4}\/(0[1-9]|1[0-2])$/.test(expirationDate)) {
      return false;
    }

    const [year, month] = expirationDate.split('/').map(Number);
    const currentYear = moment().year();
    const currentMonth = moment().month() + 1; 

    return year > currentYear || (year === currentYear && month >= currentMonth);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The expiration date is invalid or expired';
  }
}