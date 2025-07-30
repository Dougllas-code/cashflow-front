import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {}
