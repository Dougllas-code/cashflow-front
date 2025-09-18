import { CurrencyInputComponent } from '../../../../shared/components/currency-input/currency-input.component';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionDialog } from '../../../../core/enums/actionDialog';
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
import { ExpenseShortResponse } from '../../../../shared/models/responses/expenseShortResponse';
import { NotificationService } from '../../../../shared/components/notification/notification.service';

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

  data = inject<ActionDialog>(MAT_DIALOG_DATA);
  expenseForm!: FormGroup<ExpenseForm>;
  paymentTypeOptions = PAYMENT_TYPE_OPTIONS;
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateEditExpenseComponent>,
    public readonly expensesService: ExpensesService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.expenseForm = this.createExpenseForm();

    this.dialogRef.afterClosed().subscribe(() => {
      this.expenseForm.reset();
    });
  }

  private createExpenseForm(): FormGroup<ExpenseForm> {
    return this.formBuilder.group<ExpenseForm>({
      title: this.formBuilder.control<string>('', { validators: [Validators.required, StringValidators.notBlankValidator], nonNullable: true }),
      description: this.formBuilder.control<string>('', { nonNullable: true }),
      date: this.formBuilder.control<Date>(DATE_PROVIDER.getTodayDate(), { validators: [Validators.required], nonNullable: true }),
      amount: this.formBuilder.control<number>(0, { validators: [Validators.required], nonNullable: true }),
      paymentType: this.formBuilder.control<PaymentType>(PaymentType.Cash, { validators: [Validators.required], nonNullable: true })
    });
  }

  addExpense(): void {
    this.expensesService.createExpense(this.expenseForm.getRawValue()).subscribe({
      next: (response: ExpenseShortResponse) => {
        this.dialogRef.close(response);
        this.notificationService.create(`Expense (${response.title}) created successfully`);
      },
      error: (error) => {
        this.notificationService.create('Failed to create expense');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
