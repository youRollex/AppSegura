import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  public isValidField( form:FormGroup, field:string){
    return form.controls[field].errors && form.controls[field].touched;
  }

}

export function containsNumberValidator(): ValidatorFn {
return (control: AbstractControl): { [key: string]: any } | null => {
    const containsNumber = /[0-9]/.test(control.value);
    return containsNumber ? null : { 'missingNumber': true };
};
}

export function containsUpperCaseValidator(): ValidatorFn {
return (control: AbstractControl): { [key: string]: any } | null => {
    const containsUpperCase = /[A-Z]/.test(control.value);
    return containsUpperCase ? null : { 'missingUpperCase': true };
};
}

export function nameValidator(): ValidatorFn {
const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚ\s]+$/;
return (control: AbstractControl): ValidationErrors | null => {
  if (control.value && !nameRegex.test(control.value)){
    return { invalidName: 'El nombre solo puede contener letras y espacios'};
  }
  return null;
};
}


const commonPasswords = [ '123456', 'password', '123456789', 'qwerty', 'abc123', 'password123', '12345', '1234', '111111', 'letmein'];

export function commonPasswordValidator(): ValidatorFn {
return (control: AbstractControl): ValidationErrors | null => {
  if (control.value && commonPasswords.includes(control.value.toLowerCase())) {
    return { commonPassword: true };
  }
  return null;
};
}