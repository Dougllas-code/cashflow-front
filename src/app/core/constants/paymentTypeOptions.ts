/**
 * This file defines the available payment type options for use in UI components such as dropdowns.
 *
 * The PaymentType enum represents the business logic values for payment methods.
 * The PAYMENT_TYPE_OPTIONS array maps each enum value to a user-friendly label for display purposes.
 *
 * Usage:
 *   Import PAYMENT_TYPE_OPTIONS to populate select/dropdown components in forms.
 *   The PaymentTypeOption interface ensures type safety for each option.
 */
import { PaymentType } from '../enums/paymentType';

export interface PaymentTypeOption {
  value: PaymentType;
  label: string;
}

export const PAYMENT_TYPE_OPTIONS: PaymentTypeOption[] = [
  { value: PaymentType.Cash, label: 'Dinheiro' },
  { value: PaymentType.CreditCard, label: 'Cartão de Crédito' },
  { value: PaymentType.DebitCard, label: 'Cartão de Débito' },
  { value: PaymentType.EletronicTransfer, label: 'Transferência Eletrônica' },
];
