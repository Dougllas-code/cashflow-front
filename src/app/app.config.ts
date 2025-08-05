import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideNgxMask } from 'ngx-mask';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { AuthenticationInterceptor } from './core/interceptors/authentication.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideNgxMask()
    ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ]
};
