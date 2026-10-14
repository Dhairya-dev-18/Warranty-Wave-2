import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="error-page">
      <div class="card error-card">
        <div class="icon-wrap">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
        </div>
        <h1>403 • Access restricted</h1>
        <p>Your current user role does not have authorization to view this administrative resource.</p>
        <div class="actions">
          <a routerLink="/dashboard" class="btn btn-primary">Return to Dashboard</a>
          <a routerLink="/" class="btn btn-secondary">Go to Homepage</a>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; }
    .error-page {
      min-height: calc(100vh - 160px);
      display: grid;
      place-items: center;
      padding: 3rem 1.5rem;
    }
    .error-card {
      max-width: 480px;
      text-align: center;
      padding: 3rem 2rem;
      border-radius: var(--radius-xl);

      .icon-wrap {
        width: 64px;
        height: 64px;
        margin: 0 auto 1.5rem;
        border-radius: 18px;
        background: #FEE2E2;
        color: #DC2626;
        display: grid;
        place-items: center;
      }

      h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
      p { color: var(--color-muted); font-size: 0.95rem; margin-bottom: 2rem; }

      .actions {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
      }
    }
  `]
})
export class UnauthorizedPage {}
