import { Component, Input, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { OffersInterface } from '../../../interfaces/oferta.interface';

@Component({
  selector: 'app-my-card',
  templateUrl: './my-card.component.html',
  styleUrls: ['./my-card.component.css']
})
export class MyCardComponent  implements OnInit{

  public imagenRuta: string = 'assets/cards/';

  constructor(private cardSrv: CardsService){}

  @Input()
  public offers!: OffersInterface;

  ngOnInit(): void {
    this.imagenRuta = this.imagenRuta + this.offers.card.imageUrl
  }
}
