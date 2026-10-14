import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="icon-badge">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your WarrantyWave account</p>
        </div>

        @if (errorMessage()) {
          <div class="error-banner">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label for="email">Email address</label>
            <input
              id="email"
              formControlName="email"
              type="email"
              placeholder="name@company.com"
              [class.invalid]="form.get('email')?.touched && form.get('email')?.invalid"
            />
            @if (form.get('email')?.touched && form.get('email')?.invalid) {
              <span class="field-error">Please enter a valid email address</span>
            }
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password">Password</label>
            </div>
            <input
              id="password"
              formControlName="password"
              type="password"
              placeholder="••••••••"
              [class.invalid]="form.get('password')?.touched && form.get('password')?.invalid"
            />
            @if (form.get('password')?.touched && form.get('password')?.invalid) {
              <span class="field-error">Password is required</span>
            }
          </div>

          <button type="submit" class="btn btn-primary submit-btn" [disabled]="form.invalid || loading()">
            @if (loading()) {
              <span>Signing in...</span>
            } @else {
              <span>Sign in to account</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create an account</a></p>
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
      width: min(92vw, 440px);
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

    form {
      display: grid;
      gap: 1.25rem;
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

        &.invalid {
          border-color: var(--color-danger);
        }
      }

      .field-error {
        font-size: 0.75rem;
        color: var(--color-danger);
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
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.role === 'ADMIN') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Invalid email or password.');
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Unable to connect to the server. Please verify backend is running.');
        }
      }
    });
  }
}
