import { Injectable } from '@angular/core';
import { ExpenseRequest } from '../../../shared/models/requests/expenseRequest';
import { Observable } from 'rxjs';
import { ExpenseShortResponse } from '../../../shared/models/responses/expenseShortResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  constructor(private readonly http: HttpClient) { }

  createExpense(request: ExpenseRequest): Observable<ExpenseShortResponse> {
    return this.http.post<ExpenseShortResponse>(`${environment.apiUrl}/Expenses`, request);
  }

  updateExpense(id: number, request: ExpenseRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/Expenses/${id}`, request);
  }
}