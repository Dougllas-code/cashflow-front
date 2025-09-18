import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditExpenseComponent } from './create-edit-expense/create-edit-expense.component';
import { ActionDialog } from '../../../core/enums/actionDialog';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, MatButtonModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {

  readonly dialog = inject(MatDialog);

  openCreateExpenseModal() {
    this.dialog.open(CreateEditExpenseComponent, {
      data: ActionDialog.ADD,
      disableClose: true
    });
  }
}