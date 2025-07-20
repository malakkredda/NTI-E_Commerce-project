import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <i class="fas fa-user-circle fa-3x text-primary mb-3"></i>
                <h3>Login</h3>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <div class="alert alert-danger alert-custom" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input type="email" 
                           class="form-control" 
                           id="email" 
                           formControlName="email"
                           [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                           placeholder="Enter your email">
                  </div>
                  <div class="invalid-feedback" 
                       *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                    <div *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</div>
                    <div *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input [type]="showPassword ? 'text' : 'password'" 
                           class="form-control" 
                           id="password" 
                           formControlName="password"
                           [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                           placeholder="Enter your password">
                    <button class="btn btn-outline-secondary" 
                            type="button" 
                            (click)="togglePassword()">
                      <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div class="invalid-feedback" 
                       *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                    <div *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</div>
                    <div *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>

                <div class="d-grid gap-2 mb-3">
                  <button type="submit" 
                          class="btn btn-primary" 
                          [disabled]="loginForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i class="fas fa-sign-in-alt me-2" *ngIf="!loading"></i>
                    {{ loading ? 'Signing In...' : 'Sign In' }}
                  </button>
                </div>
              </form>

              <div class="text-center">
                <p class="mb-0">Don't have an account? 
                  <a routerLink="/register" class="text-primary text-decoration-none">
                    <strong>Register here</strong>
                  </a>
                </p>
              </div>
            </div>
          </div>

          <!-- Demo Credentials -->
          <div class="card mt-3 bg-light">
            <div class="card-body">
              <h6 class="card-title">Demo Credentials</h6>
              <small class="text-muted">
                <strong>Admin:</strong> admin@example.com / password<br>
                <strong>User:</strong> user@example.com / password
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          // Redirect based on role
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.error || 'Login failed. Please try again.';
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}