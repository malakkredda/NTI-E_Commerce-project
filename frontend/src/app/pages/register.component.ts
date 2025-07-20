import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
                <h3>Create Account</h3>
                <p class="text-muted">Join GlamStore today</p>
              </div>

              <div class="alert alert-danger alert-custom" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
              </div>

              <div class="alert alert-success alert-custom" *ngIf="successMessage">
                <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-user"></i>
                    </span>
                    <input type="text" 
                           class="form-control" 
                           id="name" 
                           formControlName="name"
                           [class.is-invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                           placeholder="Enter your full name">
                  </div>
                  <div class="invalid-feedback" 
                       *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
                    <div *ngIf="registerForm.get('name')?.errors?.['required']">Name is required</div>
                    <div *ngIf="registerForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input type="email" 
                           class="form-control" 
                           id="email" 
                           formControlName="email"
                           [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                           placeholder="Enter your email">
                  </div>
                  <div class="invalid-feedback" 
                       *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                    <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                    <div *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</div>
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
                           [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                           placeholder="Create a password">
                    <button class="btn btn-outline-secondary" 
                            type="button" 
                            (click)="togglePassword()">
                      <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div class="invalid-feedback" 
                       *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                    <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                    <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input [type]="showConfirmPassword ? 'text' : 'password'" 
                           class="form-control" 
                           id="confirmPassword" 
                           formControlName="confirmPassword"
                           [class.is-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                           placeholder="Confirm your password">
                    <button class="btn btn-outline-secondary" 
                            type="button" 
                            (click)="toggleConfirmPassword()">
                      <i [class]="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div class="invalid-feedback" 
                       *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                    <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</div>
                    <div *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</div>
                  </div>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" 
                         type="checkbox" 
                         id="terms" 
                         formControlName="terms"
                         [class.is-invalid]="registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched">
                  <label class="form-check-label" for="terms">
                    I agree to the <a href="#" class="text-primary">Terms of Service</a> and 
                    <a href="#" class="text-primary">Privacy Policy</a>
                  </label>
                  <div class="invalid-feedback" 
                       *ngIf="registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched">
                    You must agree to the terms and conditions
                  </div>
                </div>

                <div class="d-grid gap-2 mb-3">
                  <button type="submit" 
                          class="btn btn-primary" 
                          [disabled]="registerForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i class="fas fa-user-plus me-2" *ngIf="!loading"></i>
                    {{ loading ? 'Creating Account...' : 'Create Account' }}
                  </button>
                </div>
              </form>

              <div class="text-center">
                <p class="mb-0">Already have an account? 
                  <a routerLink="/login" class="text-primary text-decoration-none">
                    <strong>Sign in here</strong>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { name, email, password } = this.registerForm.value;
      
      this.authService.register({ name, email, password }).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Account created successfully! You can now sign in.';
          
          // Auto redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched();
    }
  }
}