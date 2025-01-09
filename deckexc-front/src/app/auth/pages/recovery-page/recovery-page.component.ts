import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

const preguntas = {
  pais: 'C&uacute;al es tu pa&iacute;s favorito?',
  comida: 'C&uacute;al es tu comida favorita?',
  cantante: 'C&uacute;al es tu cantante favorito?'
}

@Component({
  selector: 'app-recovery-page',
  templateUrl: './recovery-page.component.html',
  styleUrls: ['./recovery-page.component.css']
})
export class RecoveryPageComponent implements OnInit {

  public recoveryControl: boolean = false;
  public question!: string;
  public errorMessage: string = '';
  public errorMessageControl: string = '';
  public emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorSrv.emailPattern)]],
  })
  public recoveryForm: FormGroup = this.fb.group({
    answer: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
  })

  constructor(
    private validatorSrv: ValidatorsService,
    private fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.recoveryControl = false
  }

  isValidField(field: string) {
    return this.validatorSrv.isValidField(this.recoveryForm, field)
  }

  isValidFieldEmail(field: string) {
    return this.validatorSrv.isValidField(this.emailForm, field)
  }

  emailControl(email: string) {
    this.emailForm.markAllAsTouched();
    this.authSrv.getQuestion(email)
      .subscribe((res: any) => {
        this.errorMessageControl = ''
        this.recoveryControl = true;
        switch (res.question) {
          case 'comida':
            return this.question = '¿Cuál es tu comida favorita?';
          case 'pais':
            return this.question = '¿Cuál es tu país favorito?';
          case 'cantante':
            return this.question = '¿Quién es tu cantante favorito?';
          default:
            return this.question = '';
        }
      },
        (err: any) => {
          this.errorMessageControl = 'Correo no encontrado, intente otra vez'
        })
  }

  onSubmit() {
    this.recoveryForm.markAllAsTouched();
    const email = this.emailForm.controls['email'].value;
    const answer = this.recoveryForm.controls['answer'].value;
    const newPassword = this.recoveryForm.controls['newPassword'].value;

    this.authSrv.recoveryPassword(email, answer, newPassword)
    .subscribe(
      (data) => {
        this.snackBar.open("Contraseña restablecida con éxito!", '', {duration:5000})
        this.router.navigate(['./auth/login'])
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Credenciales incorrectas. Intentalo de nuevo'
      }
    )
  }
}
