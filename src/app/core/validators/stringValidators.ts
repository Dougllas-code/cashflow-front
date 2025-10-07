
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

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

  /**
   * Comprehensive password validator that checks multiple criteria.
   * Returns validation errors for each unmet criteria or null if valid.
   * @param control The form control to validate
   */
  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    
    if (!password) {
      return { passwordInvalid: true };
    }

    const errors: any = {};

    if (password.length < 8) {
      errors.minLength = true;
    }

    if (!/[A-Z]+/.test(password)) {
      errors.uppercase = true;
    }

    if (!/[a-z]+/.test(password)) {
      errors.lowercase = true;
    }

    if (!/\d+/.test(password)) {
      errors.number = true;
    }

    if (!/[!?*.]+/.test(password)) {
      errors.specialChar = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  /**
   * Validator that ensures password and confirm password fields match.
   * Should be used as a form-level validator.
   * @param passwordField Name of the password field (default: 'password')
   * @param confirmPasswordField Name of the confirm password field (default: 'confirmPassword')
   */
  static passwordMatchValidator(
    passwordField: string = 'password',
    confirmPasswordField: string = 'confirmPassword'
  ) {
    return (form: FormGroup): ValidationErrors | null => {
      const password = form.get(passwordField);
      const confirmPassword = form.get(confirmPasswordField);

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  /**
   * Utility methods to check individual password criteria.
   * Useful for UI feedback and password strength indicators.
   */
  static readonly PasswordCriteria = {
    hasMinLength: (password: string, minLength: number = 8): boolean => {
      return password?.length >= minLength;
    },

    hasUppercase: (password: string): boolean => {
      return /[A-Z]+/.test(password);
    },

    hasLowercase: (password: string): boolean => {
      return /[a-z]+/.test(password);
    },

    hasNumber: (password: string): boolean => {
      return /\d+/.test(password);
    },

    hasSpecialChar: (password: string): boolean => {
      return /[!?*.]+/.test(password);
    },

    meetsAllCriteria: (password: string): boolean => {
      return StringValidators.PasswordCriteria.hasMinLength(password) &&
             StringValidators.PasswordCriteria.hasUppercase(password) &&
             StringValidators.PasswordCriteria.hasLowercase(password) &&
             StringValidators.PasswordCriteria.hasNumber(password) &&
             StringValidators.PasswordCriteria.hasSpecialChar(password);
    }
  };
}
