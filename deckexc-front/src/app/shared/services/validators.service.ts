import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

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
