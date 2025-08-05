
import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Utility class for string validators to be used in Angular Reactive Forms.
 */
export class StringValidators {
  /**
   * Validator that checks if the value is an empty string or contains only whitespace.
   * Returns { notBlank: true } if invalid, or null if valid.
   * @param control The form control to validate
   */
  static notBlankValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value === 'string' && value.trim().length === 0) {
      return { notBlank: true };
    }
    return null;
  }
}
