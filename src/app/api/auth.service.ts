import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { ENDPOINTS } from '../configs/api-endpoints';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
   
  BASE_URL = environment.apiUrl;
  http: any;
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(private httpClient: HttpClient) {}
  private token: string | null = null;


  signIn(email: string, password: string): Observable<{ user: User, token: string }> {
    return this.httpClient.post<{ user: User, token: string }>(`${this.apiUrl}/signIn`, { email, password }).pipe(
      tap(response => {
        this.token = response.token;
        localStorage.setItem('access_token', response.token);
      })
    );
  }

  logOut(): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.httpClient.post<void>(`${this.apiUrl}/logOut`, {}, { headers }).pipe(
      tap(() => {
        this.token = null;
        localStorage.removeItem('access_token');
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  userByToken(): Observable<User> {
    return this.httpClient.get<User>(
      this.BASE_URL + ENDPOINTS.auth.user_by_token
    );
  }



}
