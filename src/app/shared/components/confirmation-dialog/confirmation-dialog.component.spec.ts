import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogData } from '../../models/dialogs-data/confirmation-dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let mockDialogRef: any;
  let mockData: ConfirmationDialogData;

  beforeEach(async () => {
    mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    mockData = {
      message: 'Tem certeza que deseja excluir este item?',
      title: 'Confirmar exclusão',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(mockData.message);
  });

  it('should display the provided title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(mockData.title);
  });

  it('should display custom button texts', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(mockData.confirmText);
    expect(compiled.textContent).toContain(mockData.cancelText);
  });

  it('should use default title when not provided', () => {
    component.data.title = undefined;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Confirmação');
  });

  it('should use default button texts when not provided', () => {
    component.data.confirmText = undefined;
    component.data.cancelText = undefined;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Confirmar');
    expect(compiled.textContent).toContain('Cancelar');
  });

  it('should close dialog with true when onConfirm is called', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should call onConfirm when confirm button is clicked', () => {
    spyOn(component, 'onConfirm');
    const confirmButton = fixture.nativeElement.querySelector('button[mat-flat-button]');
    confirmButton.click();
    expect(component.onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    spyOn(component, 'onCancel');
    const cancelButton = fixture.nativeElement.querySelector('button[mat-stroked-button]');
    cancelButton.click();
    expect(component.onCancel).toHaveBeenCalled();
  });
});