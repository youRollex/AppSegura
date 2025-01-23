import { Component, OnInit } from '@angular/core';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardsService } from '../../services/cards.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css'],
})
export class MyListComponent implements OnInit {
  public myOffers: OffersInterface[] = [];
  public paymentForm: FormGroup;
  public paymentDetails: any = null;
  public isEditing: boolean = false;

  constructor(
    private cardSrv: CardsService,
    private fb: FormBuilder,
    private tokenService: TokenService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, this.validateCardNumber]],
      expirationDate: ['', [Validators.required, this.validateExpirationDate]],
      cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    });
  }

  loadOffers(): void {
    this.cardSrv.getMyOffers().subscribe(
      (offer) => {
        this.myOffers = offer;
      },
      (error) => {}
    );
  }

  loadPaymentDetails(): void {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      return;
    }

    this.cardSrv.getPaymentDetails(userId).subscribe(
      (data) => {
        this.paymentDetails = data;
      },
      (error) => {
      }
    );
  }
  ngOnInit(): void {
    this.loadOffers();
    this.loadPaymentDetails();
  }

  enableEditing(): void {
    this.isEditing = true;
    this.paymentForm.patchValue({
      cardNumber: this.paymentDetails.cardNumber,
      expirationDate: this.paymentDetails.expirationDate,
      cvc: this.paymentDetails.cvc,
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.paymentForm.reset();
  }

  onSubmitPaymentMethod(): void {
    if (this.paymentForm.valid) {
      const userId = this.tokenService.getUserId();
      if (!userId) {
        return;
      }

      const paymentData = {
        userId: userId,
        cardNumber: this.paymentForm.get('cardNumber')?.value,
        cvc: this.paymentForm.get('cvc')?.value,
        expirationDate: `${this.paymentForm.get('expirationDate')?.value}`,
      };
      this.cardSrv.savePaymentMethod(paymentData).subscribe(
        (response) => {
          this.paymentDetails = response;
        },
        (error) => {
        }
      );
    } else {
      console.error('Formulario inválido');
    }
  }

  private validateCardNumber(control: any): { [key: string]: boolean } | null {
    const cardNumber = control.value;
    if (!/^\d{16}$/.test(cardNumber)) {
      return { invalidCardNumber: true };
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

    return sum % 10 === 0 ? null : { invalidCardNumber: true };
  }

  private validateExpirationDate(
    control: any
  ): { [key: string]: boolean } | null {
    const expirationDate = control.value;
    if (!/^\d{4}\/(0[1-9]|1[0-2])$/.test(expirationDate)) {
      return { invalidExpirationDate: true };
    }

    const [year, month] = expirationDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiredCard: true };
    }

    return null;
  }

  onUpdatePaymentMethod(): void {
    if (this.paymentForm.valid) {
      const userId = this.tokenService.getUserId();
      if (!userId) {
        return;
      }

      const updatedPaymentData = {
        userId: userId,
        cardNumber: this.paymentForm.get('cardNumber')?.value,
        cvc: this.paymentForm.get('cvc')?.value,
        expirationDate: this.paymentForm.get('expirationDate')?.value,
      };

      this.cardSrv.updatePaymentMethod(updatedPaymentData).subscribe(
        (response) => {
          this.paymentDetails = response;
          this.isEditing = false;
        },
        (error) => {
        }
      );
    }
  }
}
