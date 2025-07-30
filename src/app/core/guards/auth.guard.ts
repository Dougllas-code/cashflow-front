import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authetication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.getToken()) {
      return true;
    }
    return this.router.parseUrl('/login');
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
