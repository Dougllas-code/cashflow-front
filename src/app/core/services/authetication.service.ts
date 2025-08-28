import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../shared/models/requests/loginRequest';
import { Observable, of, Subscription, tap } from 'rxjs';
import { LoginResponse } from '../../shared/models/responses/loginResponse';
import { environment } from '../../../environments/environment';
import { SessionSignalRService } from './session-websocket/session-websocket.service';
import { Router } from '@angular/router';
import { CheckTokenResponse } from '../../shared/models/responses/checkTokenResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private readonly TOKEN_KEY = 'authToken';
  private logoutSub?: Subscription;

  constructor(
    private readonly http: HttpClient,
    private sessionSignalR: SessionSignalRService,
    private readonly router: Router
  ) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Login`, request).pipe(
      tap((response: LoginResponse) => {
        this.setToken(response.token);
        this.startSessionHub(response.token);
      })
    );
  }

  logout(): void {
    this.deleteToken();
    this.sessionSignalR.disconnect();
    this.logoutSub?.unsubscribe();
    this.router.navigate(['/login']);
  }

  checkToken(): Observable<CheckTokenResponse> {
    const token = this.getToken();
    if (!token) {
      return of({ isValid: false } as CheckTokenResponse);
    }
    return this.http.get<CheckTokenResponse>(`${environment.apiUrl}/Auth/validate-token`);
  }

  private startSessionHub(token: string): void {
    this.sessionSignalR.connect(token);

    this.logoutSub = this.sessionSignalR.onLogout().subscribe(() => {
      this.logout();
    });
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public deleteToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}