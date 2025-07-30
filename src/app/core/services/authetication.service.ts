import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../shared/models/requests/loginRequest';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../shared/models/responses/loginResponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly TOKEN_KEY = 'authToken';

  constructor(
    private readonly http: HttpClient
  ) { }

  login(request: LoginRequest): Observable<LoginResponse> {

    return new Observable<LoginResponse>(observer => {

      this.http.post<LoginResponse>(`${environment.apiUrl}/Login`, request).subscribe({
        next: (response: LoginResponse) => {
          this.setToken(response.token);
          observer.next(response);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        }
      });

    })

  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}