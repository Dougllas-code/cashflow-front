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

  onInput(event: Event): void {
    let input = (event.target as HTMLInputElement).value;
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
