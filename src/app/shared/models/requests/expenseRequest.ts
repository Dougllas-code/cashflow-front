import { PaymentType } from "../../../core/enums/paymentType";

export interface ExpenseRequest {
  title: string;
  description: string | null;
  date: Date;
  amount: number;
  paymentType: PaymentType;
}