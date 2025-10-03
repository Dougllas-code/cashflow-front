import { Injectable } from '@angular/core';
import { ExpenseRequest } from '../../../shared/models/requests/expenseRequest';
import { Observable } from 'rxjs';
import { RegisterExpenseShortResponse } from '../../../shared/models/responses/resgisterExpenseShortResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ExpenseShortResponse } from '../../../shared/models/responses/expenseShortResponse';
import { Expense } from '../../../shared/entities/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  constructor(private readonly http: HttpClient) { }

  getAllExpenses(): Observable<ExpenseShortResponse> {
    return this.http.get<ExpenseShortResponse>(`${environment.apiUrl}/Expenses`);
  }
  
  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${environment.apiUrl}/Expenses/${id}`);
  }

  createExpense(request: ExpenseRequest): Observable<RegisterExpenseShortResponse> {
    return this.http.post<RegisterExpenseShortResponse>(`${environment.apiUrl}/Expenses`, request);
  }

  updateExpense(id: number, request: ExpenseRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Expenses/${id}`, request);
  }
}