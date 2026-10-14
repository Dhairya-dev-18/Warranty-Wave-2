import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="error-page">
      <div class="card error-card">
        <div class="error-code">404</div>
        <h1>Page not found</h1>
        <p>The URL you requested does not exist or has been relocated to another endpoint.</p>
        <div class="actions">
          <a routerLink="/" class="btn btn-primary">Return to Homepage</a>
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
      padding: 3.5rem 2rem;
      border-radius: var(--radius-xl);

      .error-code {
        font-family: var(--font-heading);
        font-size: 5rem;
        font-weight: 800;
        line-height: 1;
        color: var(--color-primary);
        margin-bottom: 0.5rem;
      }

      h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
      p { color: var(--color-muted); font-size: 0.95rem; margin-bottom: 2rem; }

      .actions {
        display: flex;
        justify-content: center;
      }
    }
  `]
})
export class NotFoundPage {}
