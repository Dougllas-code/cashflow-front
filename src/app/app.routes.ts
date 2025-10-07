
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AuthGuard, LoginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./components/main-layout/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./components/main-layout/expenses/expenses.component').then(m => m.ExpensesComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/main-layout/reports/reports.component').then(m => m.ReportsComponent)
      }
    ]
  }
];
