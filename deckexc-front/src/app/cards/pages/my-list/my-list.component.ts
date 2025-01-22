import { Component, OnInit } from '@angular/core';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit{

  public myOffers: OffersInterface[] = [];
  public paymentForm: FormGroup;

  constructor(private cardSrv: CardsService, private fb: FormBuilder){
      // Inicialización del formulario de método de pago
      this.paymentForm = this.fb.group({
        cardNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{16}$')],
        ],
        expiryDate: [
          '',
          [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')],
        ],
        cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      });
  }

  ngOnInit(): void {
    this.cardSrv.getMyOffers()
    .subscribe(offer => {
      this.myOffers = offer
    },
    error => {
    })
  }

  onSubmitPaymentMethod(): void {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      console.log('Método de pago guardado:', paymentData);

    } else {
      console.error('Formulario inválido');
    }
  }
}
