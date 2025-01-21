import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService, containsNumberValidator, containsUpperCaseValidator } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit{

  public errorMessage: string = '';
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorSrv.emailPattern)]],
    password: ['', [Validators.required, containsNumberValidator(), containsUpperCaseValidator(), Validators.minLength(6) ]]
  })

  constructor(
    private fb: FormBuilder,
    private validatorSrv: ValidatorsService,
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage?.getItem('token');
      if (token !== null) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }}
  }


  isValidField(field: string): string | null {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    } else if (control?.hasError('pattern')) {
      return 'Formato de correo inválido.';
    } else if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    } else if (control?.hasError('containsNumber')) {
      return 'La contraseña debe incluir al menos un número.';
    } else if (control?.hasError('containsUpperCase')) {
      return 'La contraseña debe incluir al menos una letra mayúscula.';
    }
    return null;
  }

  onSubmit(){
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.authService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
      .subscribe(
        (data) => {
          this.router.navigate(['/cards'])
          this.errorMessage = '';
        },
      (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Correo o contraseña incorrectos.';
          } else {
            this.errorMessage = 'Error inesperado. Intenta más tarde.';
          }
        }
      )
  }

}

