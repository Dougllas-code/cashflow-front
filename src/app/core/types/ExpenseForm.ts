import { FormControl } from '@angular/forms';
import { PaymentType } from '../enums/paymentType';

export type ExpenseForm = {
  title: FormControl<string>;
  description: FormControl<string>;
  date: FormControl<Date>;
  amount: FormControl<number>;
  paymentType: FormControl<PaymentType>;
};