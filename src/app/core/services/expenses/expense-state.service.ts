import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StateExpense } from '../../../shared/models/stateService/expenseStateService';

@Injectable({
  providedIn: 'root'
})
export class ExpenseStateService {
  private readonly notifyExpenseSubject = new Subject<StateExpense>();
  notifyExpense$ = this.notifyExpenseSubject.asObservable();

  notifyExpensesComponents(stateExpense: StateExpense) {
    this.notifyExpenseSubject.next(stateExpense);
  }
}