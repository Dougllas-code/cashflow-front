import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthenticationService } from '../../core/services/authetication.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../shared/models/responses/loginResponse';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: LoginResponse) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // Handle login error here
      }
    });
  }

}
