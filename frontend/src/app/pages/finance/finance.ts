import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <span class="badge badge-green">Auto Financing</span>
          <h1>Vehicle loans & warranty financing</h1>
          <p>Estimate monthly vehicle payments with the calculator below.</p>
        </div>
      </div>

      <div class="finance-grid">
        <div class="card status-card">
          <span class="badge badge-blue">Payment tool</span>
          <h3>Financing estimates</h3>
          <p class="calc-sub">Loan applications and approvals are not tracked here. Use the estimator to model a monthly payment; it is not a financing offer.</p>
        </div>

        <!-- Loan Calculator -->
        <div class="card calculator-card">
          <h3>Interactive Payment Estimator</h3>
          <p class="calc-sub">Estimate your monthly payment including extended warranty coverage.</p>

          <div class="calc-form">
            <div class="slider-group">
              <div class="slider-label">
                <span>Vehicle Loan Amount</span>
                <strong>\${{ loanAmount() | number }}</strong>
              </div>
              <input type="range" min="5000" max="80000" step="1000" [ngModel]="loanAmount()" (ngModelChange)="loanAmount.set($event)" />
            </div>

            <div class="slider-group">
              <div class="slider-label">
                <span>Term (Months)</span>
                <strong>{{ loanTerm() }} Months</strong>
              </div>
              <input type="range" min="12" max="72" step="12" [ngModel]="loanTerm()" (ngModelChange)="loanTerm.set($event)" />
            </div>

            <div class="calc-result">
              <span>Estimated Monthly Note</span>
              <strong class="result-amount">\${{ monthlyPayment() | number:'1.2-2' }}</strong>
              <small>Based on estimated 5.9% APR with $0 down</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }

    .page-header {
      margin-bottom: 2.5rem;
      h1 { font-size: 2.25rem; margin-top: 0.5rem; }
      p { color: var(--color-muted); margin-top: 0.25rem; }
    }

    .finance-grid {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 2rem;
    }

    .status-card {
      padding: 2rem;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        .app-id {
          font-family: monospace;
          font-size: 0.8rem;
          color: var(--color-muted);
        }
      }

      h3 { font-size: 1.35rem; }

      .amount-banner {
        margin: 1.5rem 0;
        background: #F0FDF4;
        border: 1px solid #BBF7D0;
        padding: 1.25rem;
        border-radius: var(--radius-md);

        .label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #166534; }
        .val { font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: #15803D; }
      }

      .loan-specs {
        display: grid;
        gap: 0.85rem;

        .spec {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          span { color: var(--color-muted); }
          strong { color: var(--color-navy); }
        }
      }
    }

    .calculator-card {
      padding: 2rem;

      h3 { font-size: 1.35rem; }
      .calc-sub { color: var(--color-muted); font-size: 0.875rem; margin-top: 0.25rem; margin-bottom: 2rem; }

      .calc-form {
        display: grid;
        gap: 1.75rem;
      }

      .slider-group {
        .slider-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          strong { color: var(--color-primary); font-size: 1.05rem; }
        }

        input[type="range"] {
          width: 100%;
          accent-color: var(--color-primary);
        }
      }

      .calc-result {
        background: #F8FAFC;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        text-align: center;

        span { display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--color-muted); }
        .result-amount { display: block; font-family: var(--font-heading); font-size: 2.5rem; color: var(--color-navy); margin: 0.35rem 0; }
        small { color: var(--color-muted); font-size: 0.775rem; }
      }
    }

    @media (max-width: 860px) {
      .finance-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FinancePage {
  readonly loanAmount = signal(25000);
  readonly loanTerm = signal(48);

  readonly monthlyPayment = computed(() => {
    const P = this.loanAmount();
    const r = 0.059 / 12;
    const n = this.loanTerm();
    const payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(payment) ? 0 : payment;
  });
}
