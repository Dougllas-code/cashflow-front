import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthenticationService } from '../../core/services/authetication.service';
import { Router, RouterModule } from '@angular/router';
import { LoginResponse } from '../../shared/models/responses/loginResponse';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: LoginResponse) => {
        this.router.navigate(['/home']);
        this.notificationService.create('Login successful');
      },
      error: (error) => {
        this.notificationService.create('Login failed');
      }
    });
  }

}
