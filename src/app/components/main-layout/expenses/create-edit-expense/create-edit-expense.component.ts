import { CurrencyInputComponent } from '../../../../shared/components/currency-input/currency-input.component';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StringValidators } from '../../../../core/validators/stringValidators';
import { ExpenseForm } from '../../../../core/types/ExpenseForm';
import { PaymentType } from '../../../../core/enums/paymentType';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { PAYMENT_TYPE_OPTIONS } from '../../../../core/constants/paymentTypeOptions';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ExpensesService } from '../../../../core/services/expenses/expenses.service';
import { DATE_PROVIDER } from '../../../../core/constants/dateProvider';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { CreateEditExpenseDialogData } from '../../../../shared/models/dialogs-data/create-edit-expense';
import { Expense } from '../../../../shared/entities/expense';
import { ActionDialog } from '../../../../core/enums/actionDialog';
import { RegisterExpenseShortResponse } from '../../../../shared/models/responses/resgisterExpenseShortResponse';
import { StateExpense } from '../../../../shared/models/stateService/expenseStateService';
import { ExpenseStateService } from '../../../../core/services/expenses/expense-state.service';
import { StateActions } from '../../../../core/enums/stateActions';

@Component({
  selector: 'app-create-edit-expense',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    CurrencyInputComponent
  ],
  templateUrl: './create-edit-expense.component.html',
  styleUrl: './create-edit-expense.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class CreateEditExpenseComponent implements OnInit {

  data = inject<CreateEditExpenseDialogData>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  expenseForm!: FormGroup<ExpenseForm>;
  paymentTypeOptions = PAYMENT_TYPE_OPTIONS;

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateEditExpenseComponent>,
    public readonly expensesService: ExpensesService,
    private readonly notificationService: NotificationService,
    private readonly expenseStateService: ExpenseStateService
  ) { }

  ngOnInit(): void {
    this.expenseForm = this.createExpenseForm(this.data.expense);

    this.dialogRef.afterClosed().subscribe(() => {
      this.expenseForm.reset();
    });
  }

  private createExpenseForm(expense: Expense | null): FormGroup<ExpenseForm> {
    return this.formBuilder.group<ExpenseForm>({
      title: this.formBuilder.control<string>(
        expense ? expense.title : '',
        {
          validators:
            [Validators.required, StringValidators.notBlankValidator],
          nonNullable: true
        }
      ),
      description: this.formBuilder.control<string>(
        expense ? expense.description : '',
        { nonNullable: true }
      ),
      date: this.formBuilder.control<Date>(
        expense ? expense.date : DATE_PROVIDER.getTodayDate(),
        { validators: [Validators.required], nonNullable: true }
      ),
      amount: this.formBuilder.control<number>(
        expense ? expense.amount : 0,
        { validators: [Validators.required], nonNullable: true }
      ),
      paymentType: this.formBuilder.control<PaymentType>(
        expense ? expense.paymentType : PaymentType.Cash,
        { validators: [Validators.required], nonNullable: true }
      )
    });
  }

  submit(): void {
    if (this.data.action === ActionDialog.ADD) {
      this.addExpense();
    } else {
      this.updateExpense();
    }
  }

  private addExpense(): void {
    this.expensesService.createExpense(this.expenseForm.getRawValue()).subscribe({
      next: (response: RegisterExpenseShortResponse) => {
        this.dialogRef.close(response);

        this.expenseStateService.notifyExpensesComponents({ action: StateActions.ADDED } as StateExpense);
        this.notificationService.create(`Expense (${response.title}) created successfully`);
      },
      error: (error) => {
        this.notificationService.create('Failed to create expense');
      }
    });
  }

  private updateExpense(): void {
    this.expensesService.updateExpense(this.data.expense!.id, this.expenseForm.getRawValue()).subscribe({
      next: () => {
        this.dialogRef.close(true);

        this.expenseStateService.notifyExpensesComponents({ action: StateActions.EDITED } as StateExpense);
        this.notificationService.create(`Expense (${this.expenseForm.value.title}) updated successfully`);
      },
      error: (error) => {
        this.notificationService.create('Failed to update expense');
      }
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
