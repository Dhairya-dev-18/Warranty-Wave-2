import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="icon-badge">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h1>Create your account</h1>
          <p>Join WarrantyWave to manage auto warranties and claims</p>
        </div>

        @if (errorMessage()) {
          <div class="error-banner">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        @if (successMessage()) {
          <div class="success-banner">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{{ successMessage() }}</span>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First name</label>
              <input id="firstName" formControlName="firstName" placeholder="John" />
            </div>
            <div class="form-group">
              <label for="lastName">Last name</label>
              <input id="lastName" formControlName="lastName" placeholder="Doe" />
            </div>
          </div>

          <div class="form-group">
            <label for="regEmail">Email address</label>
            <input id="regEmail" formControlName="email" type="email" placeholder="john.doe@example.com" />
          </div>

          <div class="form-group">
            <label for="regPassword">Password</label>
            <input id="regPassword" formControlName="password" type="password" placeholder="At least 8 characters" />
          </div>

          <button type="submit" class="btn btn-primary submit-btn" [disabled]="form.invalid || loading()">
            @if (loading()) {
              <span>Creating account...</span>
            } @else {
              <span>Register new account</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; }
    .auth-page {
      min-height: calc(100vh - 160px);
      display: grid;
      place-items: center;
      padding: 3rem 1rem;
      background: radial-gradient(circle at top, #EFF6FF 0%, #F8FAFC 100%);
    }

    .auth-card {
      width: min(92vw, 480px);
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;

      .icon-badge {
        width: 48px;
        height: 48px;
        margin: 0 auto 1rem;
        border-radius: 14px;
        background: var(--color-primary-light);
        color: var(--color-primary);
        display: grid;
        place-items: center;
      }

      h1 {
        font-size: 1.75rem;
        color: var(--color-navy);
      }

      p {
        margin-top: 0.25rem;
        color: var(--color-muted);
        font-size: 0.925rem;
      }
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #FEF2F2;
      border: 1px solid #FCA5A5;
      color: #B91C1C;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .success-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #ECFDF5;
      border: 1px solid #6EE7B7;
      color: #047857;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    form {
      display: grid;
      gap: 1.25rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: grid;
      gap: 0.4rem;

      label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-dark);
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
      }
    }

    .submit-btn {
      width: 100%;
      padding: 0.85rem;
      margin-top: 0.5rem;
      font-size: 1rem;
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--color-muted);

      a {
        color: var(--color-primary);
        font-weight: 600;
        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const values = this.form.getRawValue();

    this.auth.register(values).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1200);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Registration failed. Please check details or server connection.');
        }
      }
    });
  }
}
