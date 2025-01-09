import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  public imagenRuta: string = 'assets/cards/';

  constructor(
    private cardSrv: CardsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  @Input()
  public offers!: OffersInterface;
  @Output() cardDeleted = new EventEmitter<string>();

  ngOnInit(): void {
    this.imagenRuta = this.imagenRuta + this.offers.card.imageUrl
  }

  buyCard(id: string) {
    this.cardDeleted.emit(id);
    // this.cardSrv.deleteOfferById(id)
    //   .subscribe(result => {
    //     this.snackBar.open('Compra exitosa!', '', { duration: 5000 })
    //   })
  }
}
