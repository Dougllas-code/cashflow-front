import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { PrimaryButtonComponent } from '../../../shared/components/buttons/primaryButton.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, MatButtonModule, PrimaryButtonComponent],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {

  openCreateExpenseModal() {
    // Logic to open the modal for creating a new expense
    console.log('Open create expense modal');
  }
}
