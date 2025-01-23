import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

    getToken(): string | null {
    return localStorage?.getItem('token');
  }

  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    if (!payload) return null;

    try {
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return null;
    }
  }

  getUserId(): string | null {
    const payload = this.getTokenPayload();
    return payload?.id || null; 
  }
}