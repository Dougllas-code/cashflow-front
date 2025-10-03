import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authetication.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CheckTokenResponse } from '../../shared/models/responses/checkTokenResponse';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const token = this.authService.getToken();
    if (!token) {
      return of(this.router.parseUrl('/login'));
    }
      return this.authService.checkToken().pipe(
        map((res: CheckTokenResponse) => {
          if (res?.isValid) {
            return true;
          }
          this.authService.deleteToken();
          return this.router.parseUrl('/login');
        }),
        catchError(() => {
          this.authService.deleteToken();
          return of(this.router.parseUrl('/login'));
        })
      );
  }
}

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.getToken()) {
      return this.router.parseUrl('/home');
    }
    return true;
  }
}
