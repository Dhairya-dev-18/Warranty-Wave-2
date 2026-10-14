import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

export interface WarrantyPlan {
  id: number;
  name: string;
  description: string;
  coverageDurationMonths: number;
  coverageMileageLimit: number;
  price: number;
  coverageDetails: string;
  exclusions: string;
  eligibilityCriteria: string;
  active: boolean;
}

@Component({
  selector: 'app-warranty-plans',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="plans-container">
      <div class="plans-header">
        <span class="badge badge-blue">Protection Portfolio</span>
        <h1>Transparent vehicle warranty plans</h1>
        <p>Select the ideal mechanical and electrical coverage tailored to your vehicle's mileage and age.</p>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <span>Loading active protection plans...</span>
        </div>
      } @else if (errorMessage()) {
        <div class="error-banner">
          <span>{{ errorMessage() }}</span>
        </div>
      } @else {
        <div class="plans-grid">
          @for (plan of plans(); track plan.id; let idx = $index) {
            <article class="plan-card" [class.featured]="idx === 1">
              @if (idx === 1) {
                <div class="popular-ribbon">Most Popular</div>
              }
              <div class="plan-head">
                <span class="plan-duration">{{ plan.coverageDurationMonths }} Months Coverage</span>
                <h3>{{ plan.name }}</h3>
                <p class="plan-desc">{{ plan.description }}</p>
                <div class="plan-price">
                  <span class="currency">$</span>
                  <span class="amount">{{ plan.price }}</span>
                  <span class="term">/ one-time</span>
                </div>
              </div>

              <div class="plan-specs">
                <div class="spec-row">
                  <span>Mileage Limit</span>
                  <strong>{{ plan.coverageMileageLimit ? (plan.coverageMileageLimit | number) + ' miles' : 'Unlimited' }}</strong>
                </div>
                <div class="spec-row">
                  <span>Eligibility</span>
                  <small>{{ plan.eligibilityCriteria || 'Standard certified vehicles' }}</small>
                </div>
              </div>

              <div class="plan-details">
                <span class="details-label">Key Coverage:</span>
                <p>{{ plan.coverageDetails }}</p>
              </div>

              <div class="plan-action">
                <a routerLink="/register" class="btn" [class.btn-primary]="idx === 1" [class.btn-secondary]="idx !== 1">
                  Choose Plan
                </a>
              </div>
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .plans-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem;
    }

    .plans-header {
      text-align: center;
      max-width: 620px;
      margin: 0 auto 3.5rem;

      h1 {
        font-size: 2.5rem;
        margin-top: 0.75rem;
      }

      p {
        color: var(--color-muted);
        margin-top: 0.5rem;
        font-size: 1.05rem;
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 4rem;
      color: var(--color-muted);

      .spinner {
        width: 36px;
        height: 36px;
        border: 3px solid #E2E8F0;
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      align-items: stretch;
    }

    .plan-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      position: relative;
      box-shadow: var(--shadow-sm);
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
      }

      &.featured {
        border-color: #93C5FD;
        box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);

        .popular-ribbon {
          position: absolute;
          top: -12px;
          right: 24px;
          background: #2563EB;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .plan-head {
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;

        .plan-duration {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        h3 {
          font-size: 1.5rem;
          margin-top: 0.4rem;
        }

        .plan-desc {
          font-size: 0.875rem;
          color: var(--color-muted);
          margin-top: 0.5rem;
          line-height: 1.5;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-top: 1.25rem;

          .currency {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-navy);
          }

          .amount {
            font-family: var(--font-heading);
            font-size: 2.75rem;
            font-weight: 800;
            color: var(--color-navy);
            line-height: 1;
          }

          .term {
            font-size: 0.85rem;
            color: var(--color-muted);
          }
        }
      }

      .plan-specs {
        margin-bottom: 1.5rem;
        display: grid;
        gap: 0.6rem;

        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;

          span { color: var(--color-muted); }
          strong { color: var(--color-dark); font-weight: 600; }
          small { color: var(--color-muted); max-width: 60%; text-align: right; }
        }
      }

      .plan-details {
        flex: 1;
        margin-bottom: 2rem;

        .details-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 0.4rem;
        }

        p {
          font-size: 0.85rem;
          color: var(--color-slate);
          line-height: 1.6;
        }
      }

      .plan-action {
        a {
          width: 100%;
          padding: 0.85rem;
          font-weight: 700;
        }
      }
    }
  `]
})
export class WarrantyPlansPage implements OnInit {
  private readonly http = inject(HttpClient);

  readonly plans = signal<WarrantyPlan[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<WarrantyPlan[]>('/api/plans').subscribe({
      next: (data) => {
        this.plans.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load warranty plans from server.');
        this.loading.set(false);
      }
    });
  }
}
