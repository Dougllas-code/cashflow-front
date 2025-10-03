import { PaymentType } from "../../core/enums/paymentType";

export class Expense {
  id!: number;
  title!: string;
  description!: string;
  date!: Date;
  amount!: number;
  paymentType!: PaymentType;
}