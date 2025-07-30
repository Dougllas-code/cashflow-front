
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/main-layout/home/home.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AuthGuard, LoginGuard } from './core/guards/auth.guard';
import { ExpensesComponent } from './components/main-layout/expenses/expenses.component';
import { ReportsComponent } from './components/main-layout/reports/reports.component';

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
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  }
];
