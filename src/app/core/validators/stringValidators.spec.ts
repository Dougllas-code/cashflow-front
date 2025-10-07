import { FormControl, FormGroup } from '@angular/forms';
import { StringValidators } from './stringValidators';

describe('StringValidators', () => {

  describe('notBlankValidator', () => {
    it('should return null for non-empty string', () => {
      const control = new FormControl('test');
      const result = StringValidators.notBlankValidator(control);
      expect(result).toBeNull();
    });

    it('should return error for empty string', () => {
      const control = new FormControl('');
      const result = StringValidators.notBlankValidator(control);
      expect(result).toEqual({ notBlank: true });
    });

    it('should return error for whitespace only string', () => {
      const control = new FormControl('   ');
      const result = StringValidators.notBlankValidator(control);
      expect(result).toEqual({ notBlank: true });
    });
  });

  describe('passwordValidator', () => {
    it('should return null for valid password', () => {
      const control = new FormControl('ValidPass123!');
      const result = StringValidators.passwordValidator(control);
      expect(result).toBeNull();
    });

    it('should return error for password without uppercase', () => {
      const control = new FormControl('validpass123!');
      const result = StringValidators.passwordValidator(control);
      expect(result).toEqual({ uppercase: true });
    });

    it('should return error for password without lowercase', () => {
      const control = new FormControl('VALIDPASS123!');
      const result = StringValidators.passwordValidator(control);
      expect(result).toEqual({ lowercase: true });
    });

    it('should return error for password without number', () => {
      const control = new FormControl('ValidPass!');
      const result = StringValidators.passwordValidator(control);
      expect(result).toEqual({ number: true });
    });

    it('should return error for password without special character', () => {
      const control = new FormControl('ValidPass123');
      const result = StringValidators.passwordValidator(control);
      expect(result).toEqual({ specialChar: true });
    });

    it('should return error for short password', () => {
      const control = new FormControl('Val1!');
      const result = StringValidators.passwordValidator(control);
      expect(result).toEqual({ minLength: true });
    });

    it('should return multiple errors for invalid password', () => {
      const control = new FormControl('123');
      const result = StringValidators.passwordValidator(control);
      expect(result).toEqual({
        minLength: true,
        uppercase: true,
        lowercase: true,
        specialChar: true
      });
    });

    it('should return error for null/undefined password', () => {
      const control = new FormControl(null);
      const result = StringValidators.passwordValidator(control);
      expect(result).toEqual({ passwordInvalid: true });
    });
  });

  describe('passwordMatchValidator', () => {
    it('should return null when passwords match', () => {
      const form = new FormGroup({
        password: new FormControl('ValidPass123!'),
        confirmPassword: new FormControl('ValidPass123!')
      });
      
      const validator = StringValidators.passwordMatchValidator();
      const result = validator(form);
      expect(result).toBeNull();
    });

    it('should return error when passwords do not match', () => {
      const form = new FormGroup({
        password: new FormControl('ValidPass123!'),
        confirmPassword: new FormControl('DifferentPass123!')
      });
      
      const validator = StringValidators.passwordMatchValidator();
      const result = validator(form);
      expect(result).toEqual({ passwordMismatch: true });
      expect(form.get('confirmPassword')?.errors).toEqual({ passwordMismatch: true });
    });

    it('should work with custom field names', () => {
      const form = new FormGroup({
        newPassword: new FormControl('ValidPass123!'),
        confirmNewPassword: new FormControl('DifferentPass123!')
      });
      
      const validator = StringValidators.passwordMatchValidator('newPassword', 'confirmNewPassword');
      const result = validator(form);
      expect(result).toEqual({ passwordMismatch: true });
    });
  });

  describe('PasswordCriteria', () => {
    describe('hasMinLength', () => {
      it('should return true for password with minimum length', () => {
        expect(StringValidators.PasswordCriteria.hasMinLength('12345678')).toBe(true);
      });

      it('should return false for short password', () => {
        expect(StringValidators.PasswordCriteria.hasMinLength('1234567')).toBe(false);
      });

      it('should work with custom minimum length', () => {
        expect(StringValidators.PasswordCriteria.hasMinLength('123456', 6)).toBe(true);
        expect(StringValidators.PasswordCriteria.hasMinLength('12345', 6)).toBe(false);
      });
    });

    describe('hasUppercase', () => {
      it('should return true for password with uppercase letter', () => {
        expect(StringValidators.PasswordCriteria.hasUppercase('Password')).toBe(true);
      });

      it('should return false for password without uppercase letter', () => {
        expect(StringValidators.PasswordCriteria.hasUppercase('password')).toBe(false);
      });
    });

    describe('hasLowercase', () => {
      it('should return true for password with lowercase letter', () => {
        expect(StringValidators.PasswordCriteria.hasLowercase('Password')).toBe(true);
      });

      it('should return false for password without lowercase letter', () => {
        expect(StringValidators.PasswordCriteria.hasLowercase('PASSWORD')).toBe(false);
      });
    });

    describe('hasNumber', () => {
      it('should return true for password with number', () => {
        expect(StringValidators.PasswordCriteria.hasNumber('Password1')).toBe(true);
      });

      it('should return false for password without number', () => {
        expect(StringValidators.PasswordCriteria.hasNumber('Password')).toBe(false);
      });
    });

    describe('hasSpecialChar', () => {
      it('should return true for password with special character', () => {
        expect(StringValidators.PasswordCriteria.hasSpecialChar('Password!')).toBe(true);
        expect(StringValidators.PasswordCriteria.hasSpecialChar('Password?')).toBe(true);
        expect(StringValidators.PasswordCriteria.hasSpecialChar('Password*')).toBe(true);
        expect(StringValidators.PasswordCriteria.hasSpecialChar('Password.')).toBe(true);
      });

      it('should return false for password without special character', () => {
        expect(StringValidators.PasswordCriteria.hasSpecialChar('Password123')).toBe(false);
      });
    });

    describe('meetsAllCriteria', () => {
      it('should return true for password that meets all criteria', () => {
        expect(StringValidators.PasswordCriteria.meetsAllCriteria('ValidPass123!')).toBe(true);
      });

      it('should return false for password that does not meet all criteria', () => {
        expect(StringValidators.PasswordCriteria.meetsAllCriteria('invalidpass')).toBe(false);
      });
    });
  });

});