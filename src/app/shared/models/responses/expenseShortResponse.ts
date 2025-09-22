export interface ExpenseShortResponse {
  expenses: ShortResponse[];
}

export interface ShortResponse {
  id: number;
  title: string;
  amount: number;
}