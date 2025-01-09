import { Component, OnInit } from '@angular/core';
import { CardInterface } from '../../../interfaces/card.interface';
import { CardsService } from '../../services/cards.service';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {

  public offers: OffersInterface[] = [];

  constructor(
    private cardSrv: CardsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cardSrv.getOffers()
      .subscribe(offer => {
        this.offers = offer
      },
        error => {
        })
  }

  get isOpen(): boolean {
    return this.cardSrv.isOpen
  }

  openChat(): void {
    this.cardSrv.isOpen = true;
  }

  closeChat(): void {
    this.cardSrv.isOpen = false;
  }

  onDeleteCard(id: string) {
    this.cardSrv.deleteOfferById(id)
      .subscribe(result => {
        this.snackBar.open('Compra exitosa!', '', { duration: 5000 })
        this.cardSrv.getOffers()
          .subscribe(offer => {
            this.offers = offer
          })
      })
  }
}
