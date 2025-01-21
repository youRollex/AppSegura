import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService, commonPasswordValidator, containsNumberValidator, containsUpperCaseValidator, nameValidator } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

  public errorMessage: string = '';
  public registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorSrv.emailPattern)]],
    name: ['', [Validators.required, nameValidator()]],
    password: ['', [Validators.required, containsNumberValidator(), containsUpperCaseValidator(), Validators.minLength(6), commonPasswordValidator()]],
    question: ['', [Validators.required]],
    answer: ['', [Validators.required, Validators.minLength(4)]],
  })

  constructor(
    private validatorSrv: ValidatorsService,
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  isValidField(field: string) {
    return this.validatorSrv.isValidField(this.registerForm, field)
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid){return;}
    const email = this.registerForm.controls['email'].value;
    const name = this.registerForm.controls['name'].value;
    const password = this.registerForm.controls['password'].value;
    const question = this.registerForm.controls['question'].value;
    const answer = this.registerForm.controls['answer'].value;
    this.authSrv.register(email, name, password, question, answer)
      .subscribe(
        (data) => {
          this.snackBar.open("Cuenta creada con exito!", '', { duration: 5000 })
          this.router.navigate(['./auth/login'])
          this.errorMessage = '';
        },
        (error) => {
          if (!email || !name || !password || !question || !answer) {
            this.errorMessage = 'Complete todos los campos!'
          } else if (this.registerForm.controls['email'].errors || this.registerForm.controls['name'].errors || this.registerForm.controls['password'].errors || this.registerForm.controls['question'].errors || this.registerForm.controls['answer'].errors) {
            this.errorMessage = 'Complete todos los campos correctamente!'
          } else {
            this.errorMessage = 'Ya existe una cuenta con el correo ingresado!'
            console.log(error);
            
          }
        }
      )
  }
}
