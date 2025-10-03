import { StateActions } from "../../../core/enums/stateActions";
import { Expense } from "../../entities/expense";

export interface StateExpense {
  action : StateActions;
  expense: Expense | null;
}