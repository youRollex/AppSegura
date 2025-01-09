import { Component, OnInit } from '@angular/core';
import { OffersInterface } from '../../../interfaces/oferta.interface';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit{

  public myOffers: OffersInterface[] = [];

  constructor(private cardSrv: CardsService){}

  ngOnInit(): void {
    this.cardSrv.getMyOffers()
    .subscribe(offer => {
      this.myOffers = offer
    },
    error => {
    })
  }
}
