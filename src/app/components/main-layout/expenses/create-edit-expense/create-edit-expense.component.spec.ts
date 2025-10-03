import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { CreateEditExpenseComponent } from './create-edit-expense.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNgxMask } from 'ngx-mask';
import { provideHttpClient } from '@angular/common/http';
import { DATE_PROVIDER } from '../../../../core/constants/dateProvider';
import { dateWithZeroSeconds } from '../../../../shared/test-utils/test-utils';
import { PaymentType } from '../../../../core/enums/paymentType';
import { ActionDialog } from '../../../../core/enums/actionDialog';
import { ExpensesService } from '../../../../core/services/expenses/expenses.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { RegisterExpenseShortResponse } from '../../../../shared/models/responses/resgisterExpenseShortResponse';

describe('CreateEditExpenseComponent', () => {
  let component: CreateEditExpenseComponent;
  let fixture: ComponentFixture<CreateEditExpenseComponent>;

  let mockExpensesService: any;
  let mockNotificationService: any;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockExpensesService = {
      createExpense: jasmine.createSpy('createExpense'),
      updateExpense: jasmine.createSpy('updateExpense')
    };
    mockNotificationService = {
      create: jasmine.createSpy('create')
    };
    mockDialogRef = {
      close: jasmine.createSpy('close'),
      afterClosed: () => ({ subscribe: () => { } })
    };

    await TestBed.configureTestingModule({
      imports: [CreateEditExpenseComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: NotificationService, useValue: mockNotificationService },
        provideNgxMask(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEditExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct title for create action', () => {
    // Arrange
    component.data.action = ActionDialog.ADD;

    // Act
    fixture.detectChanges();

    // Assert
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Adicionar Despesa');
  });

  it('should display correct title for edit action', () => {
    // Arrange
    component.data.action = ActionDialog.EDIT;

    // Act
    fixture.detectChanges();

    // Assert
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Editar Despesa');
  });

  it('should create expense form with default values when no expense is provided', () => {
    // Arrange
    component.data.expense = null;

    // Act
    component.ngOnInit();

    // Assert
    const todayDate = dateWithZeroSeconds(DATE_PROVIDER.getTodayDate());
    const formDate = dateWithZeroSeconds(component.expenseForm.value.date);

    expect(component.expenseForm.value.title).toEqual('');
    expect(formDate?.getTime()).toEqual(todayDate?.getTime());
    expect(component.expenseForm.value.description).toEqual('');
    expect(component.expenseForm.value.amount).toEqual(0);
    expect(component.expenseForm.value.paymentType).toEqual(PaymentType.Cash);
  });

  it('should create expense form with provided expense values', () => {
    // Arrange
    const expense = {
      id: 1,
      title: 'Test Expense',
      description: 'This is a test expense',
      date: new Date('2023-10-01'),
      amount: 100,
      paymentType: PaymentType.CreditCard
    };
    component.data.expense = expense;

    // Act
    component.ngOnInit();

    // Assert
    const expenseDate = dateWithZeroSeconds(expense.date);
    const formDate = dateWithZeroSeconds(component.expenseForm.value.date);

    expect(component.expenseForm.value.title).toEqual(expense.title);
    expect(formDate?.getTime()).toEqual(expenseDate?.getTime());
    expect(component.expenseForm.value.description).toEqual(expense.description);
    expect(component.expenseForm.value.amount).toEqual(expense.amount);
    expect(component.expenseForm.value.paymentType).toEqual(expense.paymentType);
  });

  it('should reset form after dialog is closed', () => {
    // Arrange
    component.data.expense = null;

    let afterClosedSubj: any;
    afterClosedSubj = new Subject();
    component.dialogRef.afterClosed = () => afterClosedSubj.asObservable();

    // Act
    component.ngOnInit();

    component.expenseForm.setValue({
      title: 'Modified Title',
      description: 'Modified Description',
      date: new Date('2023-11-01'),
      amount: 200,
      paymentType: PaymentType.DebitCard
    });

    afterClosedSubj.next();

    // Assert
    expect(component.expenseForm.value.title).toEqual('');

    const formDate = dateWithZeroSeconds(component.expenseForm.value.date);
    const todayDate = dateWithZeroSeconds(DATE_PROVIDER.getTodayDate());

    expect(formDate?.getTime()).toEqual(todayDate?.getTime());
    expect(component.expenseForm.value.description).toEqual('');
    expect(component.expenseForm.value.amount).toEqual(0);
    expect(component.expenseForm.value.paymentType).toEqual(PaymentType.Cash);
  });

  it('should call addExpense, close dialog and show notification on success', () => {
    // Arrange
    component.data.action = ActionDialog.ADD;

    const expenseData = {
      title: 'Nova Despesa',
      description: 'Descrição',
      date: new Date('2025-09-22'),
      amount: 123,
      paymentType: PaymentType.Cash
    };
    component.expenseForm.setValue(expenseData);

    const response: RegisterExpenseShortResponse = { title: expenseData.title };
    
    mockExpensesService.createExpense.and.returnValue({
      subscribe: ({ next, error }: any) => { next(response); }
    });

    // Act
    component['addExpense']();

    // Assert
    expect(mockExpensesService.createExpense).toHaveBeenCalledWith(expenseData);
    expect(mockDialogRef.close).toHaveBeenCalledWith(response);
    expect(mockNotificationService.create).toHaveBeenCalledWith(`Expense (${response.title}) created successfully`);
  });

  it('should call updateExpense, close dialog and show notification on success', () => {
    // Arrange
    component.data.action = ActionDialog.EDIT;
    component.data.expense = {
      id: 2,
      title: 'Despesa Criada',
      description: 'Descrição Criada',
      date: new Date('2025-09-20T10:20:30'),
      amount: 456,
      paymentType: PaymentType.DebitCard
    };

    const updatedExpenseData = {
      title: 'Despesa Editada',
      description: 'Descrição Editada',
      date: new Date('2025-09-21T10:20:30'),
      amount: 456,
      paymentType: PaymentType.DebitCard
    };
    component.expenseForm.setValue(updatedExpenseData);

    mockExpensesService.updateExpense.and.returnValue({
      subscribe: ({ next, error }: any) => { next(); }
    });

    // Act
    component['updateExpense']();

    // Assert
    expect(mockExpensesService.updateExpense).toHaveBeenCalledWith(2, updatedExpenseData);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    expect(mockNotificationService.create).toHaveBeenCalledWith(`Expense (${updatedExpenseData.title}) updated successfully`);
  });

  it('should close the dialog when onCancel is called', () => {
    // Act
    component.onCancel();

    // Assert
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});