import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlOptions, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../shared/components/notification/notification.service';
import { StringValidators } from '../../core/validators/stringValidators';
import { UserService } from '../../core/services/users/user.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  passwordRules = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  };

  showPasswordRules = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, StringValidators.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: StringValidators.passwordMatchValidator() } as AbstractControlOptions);

    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordRules(password || '');
    });
  }

  onPasswordFocus() {
    this.showPasswordRules = true;
  }

  onPasswordBlur() {
    if (this.areAllPasswordRulesMet()) {
      this.showPasswordRules = false;
    }
  }

  updatePasswordRules(password: string) {
    this.passwordRules.minLength = StringValidators.PasswordCriteria.hasMinLength(password);
    this.passwordRules.hasUppercase = StringValidators.PasswordCriteria.hasUppercase(password);
    this.passwordRules.hasLowercase = StringValidators.PasswordCriteria.hasLowercase(password);
    this.passwordRules.hasNumber = StringValidators.PasswordCriteria.hasNumber(password);
    this.passwordRules.hasSpecialChar = StringValidators.PasswordCriteria.hasSpecialChar(password);

    if (this.areAllPasswordRulesMet() && this.showPasswordRules) {
      setTimeout(() => {
        this.showPasswordRules = false;
      }, 1500);
    }
  }

  areAllPasswordRulesMet(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return StringValidators.PasswordCriteria.meetsAllCriteria(password);
  }

  register() {
    this.userService.createUser(this.registerForm.value).subscribe({
      next: (response) => {
        this.notificationService.create('Conta criada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.notificationService.create('Erro ao criar usuário');
      }
    });
  }
}