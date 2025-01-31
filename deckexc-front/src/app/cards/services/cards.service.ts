import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { CardInterface } from '../../interfaces/card.interface';
import { OffersInterface } from '../../interfaces/oferta.interface';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private baseUrl: string = environments.deckBack;

  constructor(private http: HttpClient) {}

  getCards(): Observable<CardInterface[]> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<CardInterface[]>(`${this.baseUrl}/cards`, { headers });
  }

  getOffers(): Observable<OffersInterface[]> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<OffersInterface[]>(`${this.baseUrl}/offers`, {
      headers,
    });
  }

  getMyOffers(): Observable<OffersInterface[]> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<OffersInterface[]>(`${this.baseUrl}/offers/user`, {
      headers,
    });
  }

  getOfferById(id: string): Observable<OffersInterface | undefined> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<OffersInterface>(`${this.baseUrl}/offers/${id}`, { headers })
      .pipe(catchError((error) => of(undefined)));
  }

  addOffer(
    cardId: string,
    description: string,
    condition: string,
    price: number
  ): Observable<any> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      `${this.baseUrl}/offers`,
      { cardId, description, condition, price },
      { headers }
    );
  }

  updateOfferById(
    cardId: string,
    condition: string,
    price: number
  ): Observable<any> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<any>(
      `${this.baseUrl}/offers/${cardId}`,
      { condition, price },
      { headers }
    );
  }

  deleteOfferById(id: string): Observable<boolean> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.baseUrl}/offers/${id}`, { headers }).pipe(
      map((resp) => true),
      catchError((err) => of(false))
    );
  }

  getPaymentDetails(): Observable<any> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<any>(`${this.baseUrl}/auth/payment`, { headers })
      .pipe(catchError((err) => of(false)));
  }

  savePaymentMethod(paymentData: any): Observable<any> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.baseUrl}/auth/payment`, paymentData, {
      headers,
    });
  }

  updatePaymentMethod(updatedPaymentData: any): Observable<any> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch(`${this.baseUrl}/auth/payment`, updatedPaymentData, {
      headers,
    });
  }

  deletePaymentDetail(): Observable<Boolean> {
    const token = localStorage?.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const response = this.http
      .delete<string>(`${this.baseUrl}/auth/payment`, { headers })
      .pipe(catchError((err) => of(false)));

    return response.pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout() {
    const token = localStorage?.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
  
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
  
        const { jti, id } = payload;
  
        const data = {
          userId: id,  
          jti: jti,
        };
        
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
  
        this.http.post(`${this.baseUrl}/auth/logout`, data, { headers })
          .subscribe(
            (response) => {
              localStorage.clear();  
            },
            (error) => {
              localStorage.clear();  
            }
          );
      }
    } else {
      localStorage.clear();
    }
  }

  private _isOpen = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
  }
}
