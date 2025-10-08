import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, ReactiveFormsModule, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputComponent),
      multi: true
    }
  ]
})
export class CurrencyInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;

    value: string = '';
    private rawValue: number | null = null;
  disabled = false;

  onFocus(): void {
    // Clears the field if the value is 0 or 0.00
    if (
      this.value === '0,00' ||
      this.value === '0.00' ||
      this.value === '0' ||
      this.value === '0,0' ||
      this.value === '0.0'
    ) {
      this.value = '';
      this.rawValue = null;
      this.onChange(null);
    }
  }

  onChange = (value: number | null) => { };
  onTouched = () => { };

  writeValue(value: number | null): void {
    if (value !== null && value !== undefined) {
        this.rawValue = value;
        this.value = this.formatValue(value);
    } else {
        this.rawValue = null;
        this.value = '';
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onKeyDown(event: KeyboardEvent): void {
    // Allow control keys (backspace, delete, tab, escape, enter, etc.)
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      (event.ctrlKey && (event.key === 'a' || event.key === 'c' || event.key === 'v' || event.key === 'x'))
    ) {
      return;
    }

    // Allow only numbers, comma and dot
    if (!/[\d,.]/.test(event.key)) {
      event.preventDefault();
      return;
    }

    const currentValue = (event.target as HTMLInputElement).value;
    
    // Allow only one comma or dot
    if ((event.key === ',' || event.key === '.') && (currentValue.includes(',') || currentValue.includes('.'))) {
      event.preventDefault();
    }
  }

  onInput(event: Event): void {
    let input = (event.target as HTMLInputElement).value;
    
    // Filter only valid characters (numbers, comma and dot)
    input = input.replace(/[^\d,.-]/g, '');
    
    // Ensure only one comma or decimal dot
    const commaCount = (input.match(/,/g) || []).length;
    const dotCount = (input.match(/\./g) || []).length;
    
    if (commaCount > 1) {
      input = input.replace(/,/g, (match, offset) => offset === input.lastIndexOf(',') ? match : '');
    }
    
    if (dotCount > 1) {
      input = input.replace(/\./g, (match, offset) => offset === input.lastIndexOf('.') ? match : '');
    }
    
    // Update input value if it was modified
    if ((event.target as HTMLInputElement).value !== input) {
      (event.target as HTMLInputElement).value = input;
    }
    
    const parsed = this.parseValue(input);
    this.rawValue = parsed;
    this.value = input;
    this.onChange(parsed);
  }

  onBlur(): void {
      if (this.rawValue !== null) {
        this.value = this.formatValue(this.rawValue);
      }
      this.onTouched();
  }

  private parseValue(value: string): number | null {
    if (!value) return null;
    const normalized = value.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(normalized);
    return isNaN(num) ? null : num;
  }

  private formatValue(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
