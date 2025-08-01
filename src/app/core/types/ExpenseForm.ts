import { FormControl } from '@angular/forms';
import { PaymentType } from '../enums/paymentType';

export type ExpenseForm = {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  date: FormControl<Date | null>;
  amount: FormControl<number | null>;
  paymentType: FormControl<PaymentType | null>;
};