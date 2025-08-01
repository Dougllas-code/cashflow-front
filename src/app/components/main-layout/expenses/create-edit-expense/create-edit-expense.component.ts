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
    MatButtonModule
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
    public dialogRef: MatDialogRef<CreateEditExpenseComponent>
  ) { }

  ngOnInit(): void {
    this.expenseForm = this.createExpenseForm();

    this.dialogRef.afterClosed().subscribe(() => {
      this.expenseForm.reset();
    });
  }

  private createExpenseForm(): FormGroup<ExpenseForm> {
    return this.formBuilder.group<ExpenseForm>({
      title: this.formBuilder.control<string | null>(null, [Validators.required, StringValidators.notBlankValidator]),
      description: this.formBuilder.control<string | null>(null),
      date: this.formBuilder.control<Date | null>(null, Validators.required),
      amount: this.formBuilder.control<number | null>(null, Validators.required),
      paymentType: this.formBuilder.control<PaymentType | null>(null, Validators.required)
    });
  }

  addExpense(): void {

  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
