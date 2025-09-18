
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEditExpenseComponent } from './create-edit-expense.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNgxMask } from 'ngx-mask';
import { provideHttpClient } from '@angular/common/http';

describe('CreateEditExpenseComponent', () => {
  let component: CreateEditExpenseComponent;
  let fixture: ComponentFixture<CreateEditExpenseComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CreateEditExpenseComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { afterClosed: () => ({ subscribe: () => {} }) } },
        provideNgxMask(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
