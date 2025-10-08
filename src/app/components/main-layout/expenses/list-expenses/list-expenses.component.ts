import { BrlCurrencyPipe } from '../../../../shared/pipes/brl-currency.pipe';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExpensesService } from '../../../../core/services/expenses/expenses.service';
import { ExpenseShortResponse, ShortResponse } from '../../../../shared/models/responses/expenseShortResponse';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { ExpenseStateService } from '../../../../core/services/expenses/expense-state.service';
import { Expense } from '../../../../shared/entities/expense';
import { StateExpense } from '../../../../shared/models/stateService/expenseStateService';
import { StateActions } from '../../../../core/enums/stateActions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../../shared/models/dialogs-data/confirmation-dialog';

@Component({
  selector: 'app-list-expenses',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    BrlCurrencyPipe,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './list-expenses.component.html',
  styleUrl: './list-expenses.component.scss'
})
export class ListExpensesComponent implements OnInit {
  selectedRow!: ShortResponse;

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'title', 'amount', 'actions'];
  dataSource!: MatTableDataSource<ShortResponse>;

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly notificationService: NotificationService,
    private readonly expenseStateService: ExpenseStateService,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAllExpenses();

    this.expenseStateService.notifyExpense$.subscribe((stateExpense: StateExpense) => {
      if (stateExpense.action === StateActions.ADDED || stateExpense.action === StateActions.EDITED || stateExpense.action === StateActions.DELETED) {
        this.getAllExpenses();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getAllExpenses() {
    this.expensesService.getAllExpenses().subscribe({
      next: (response: ExpenseShortResponse) => {
        this.dataSource = new MatTableDataSource(response?.expenses);
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.notificationService.create('Erro ao carregar despesas');
      }
    });
  }

  editExpense(row: ShortResponse) {
    this.expensesService.getExpenseById(row.id).subscribe({
      next: (expense: Expense) => {
        const stateExpense: StateExpense = { expense, action: StateActions.EDIT };
        this.expenseStateService.notifyExpensesComponents(stateExpense);
      }
    });
  }

  deleteExpense(row: ShortResponse) {
    const dialogData: ConfirmationDialogData = {
      title: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir a despesa "${row.title}"?`,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: dialogData,
      disableClose: true,
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.expensesService.deleteExpense(row.id).subscribe({
          next: () => {
            this.notificationService.create('Despesa excluída com sucesso!');

            const stateExpense: StateExpense = { expense: null, action: StateActions.DELETED };
            this.expenseStateService.notifyExpensesComponents(stateExpense);
          },
          error: (err) => {
            this.notificationService.create('Erro ao excluir despesa');
          }
        });
      }
    });
  }
}
