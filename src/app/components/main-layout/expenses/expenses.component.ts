import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditExpenseComponent } from './create-edit-expense/create-edit-expense.component';
import { ActionDialog } from '../../../core/enums/actionDialog';
import { CreateEditExpenseDialogData } from '../../../shared/models/dialogs-data/create-edit-expense';
import { ListExpensesComponent } from './list-expenses/list-expenses.component';
import { ExpenseStateService } from '../../../core/services/expenses/expense-state.service';
import { Expense } from '../../../shared/entities/expense';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StateExpense } from '../../../shared/models/stateService/expenseStateService';
import { StateActions } from '../../../core/enums/stateActions';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, MatButtonModule, ListExpensesComponent],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})

export class ExpensesComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly expenseStateService: ExpenseStateService) { }

  ngOnInit(): void {
    this.expenseStateService.notifyExpense$
      .pipe(takeUntil(this.destroy$))
      .subscribe((stateExpense: StateExpense) => {
        if (stateExpense.action === StateActions.EDIT) {
          this.openExpenseModal(ActionDialog.EDIT, stateExpense.expense);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateExpenseModal() {
    this.openExpenseModal(ActionDialog.ADD, null);
  }

  private openExpenseModal(action: ActionDialog, expense: Expense | null) {
    const dialogData: CreateEditExpenseDialogData = {
      action,
      expense
    };
    this.dialog.open(CreateEditExpenseComponent, {
      data: dialogData,
      disableClose: true
    });
  }
}