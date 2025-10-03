import { ActionDialog } from "../../../core/enums/actionDialog";
import { Expense } from "../../entities/expense";

export interface CreateEditExpenseDialogData {
  action: ActionDialog;
  expense: Expense | null;
}