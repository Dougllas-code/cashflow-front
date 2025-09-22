import { BrlCurrencyPipe } from '../../../../shared/pipes/brl-currency.pipe';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExpensesService } from '../../../../core/services/expenses/expenses.service';
import { ExpenseShortResponse } from '../../../../shared/models/responses/expenseShortResponse';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '../../../../shared/components/notification/notification.service';

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

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'title', 'amount', 'actions'];
  dataSource!: MatTableDataSource<any>;

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAllExpenses();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getAllExpenses() {
    this.expensesService.getAllExpenses().subscribe({
      next: (response: ExpenseShortResponse) => {
        this.dataSource = new MatTableDataSource(response.expenses);
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.notificationService.create('Erro ao carregar despesas');
      }
    });
  }
}
