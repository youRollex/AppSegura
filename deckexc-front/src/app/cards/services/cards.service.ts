import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { CardInterface } from '../../interfaces/card.interface';
import { OffersInterface } from '../../interfaces/oferta.interface';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private baseUrl: string = environments.deckBack;

  constructor( private http: HttpClient) { }

  getCards(): Observable<CardInterface[]>{
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    })
    return this.http.get<CardInterface[]>(`${this.baseUrl}/cards`, { headers });
  }

  getOffers(): Observable<OffersInterface[]>{
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    })
    return this.http.get<OffersInterface[]>(`${this.baseUrl}/offers`, { headers });
  }

  getMyOffers(): Observable<OffersInterface[]>{
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    })
    return this.http.get<OffersInterface[]>(`${this.baseUrl}/offers/user`, { headers });
  }

  getOfferById( id: string ): Observable<OffersInterface|undefined>{
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    })
    return this.http.get<OffersInterface>(`${this.baseUrl}/offers/${id}`, { headers })
      .pipe(
        catchError(error => of(undefined))
      )
  }

  addOffer( cardId:string, description:string, condition:string, price:number): Observable<any>{
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    })
    return this.http.post<any>(`${this.baseUrl}/offers`, {cardId, description, condition, price }, { headers })
  }

  updateOfferById(cardId:string, condition:string, price:number): Observable<any>{
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    })
    return this.http.patch<any>(`${this.baseUrl}/offers/${cardId}`,{condition, price}, { headers })
  }

  deleteOfferById( id: string):Observable<boolean>{
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    })
    return this.http.delete(`${this.baseUrl}/offers/${id}`, { headers })
      .pipe(
        map(resp => true),
        catchError( err => of(false))
      )
  }

  logout() {
    localStorage.clear();
  }

  private _isOpen = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
  }

}
