import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-container">
      <section class="hero-section">
        <div class="hero-content">
          <div class="eyebrow-pill">
            <span class="pulse-dot"></span>
            <span>Next-Gen Auto Protection Suite</span>
          </div>
          <h1>Smarter Vehicle Warranties, Instant Claims & Financing.</h1>
          <p class="hero-subtitle">
            Experience end-to-end vehicle lifecycle protection. Manage comprehensive warranty coverage, track real-time claims, and explore flexible auto financing in one intuitive portal.
          </p>

          <div class="hero-actions">
            @if (!auth.isAuthenticated()) {
              <a routerLink="/register" class="btn btn-primary btn-lg">Start Free Registration</a>
              <a routerLink="/warranty-plans" class="btn btn-secondary btn-lg">Browse Coverage Plans</a>
            } @else {
              <a routerLink="/dashboard" class="btn btn-primary btn-lg">Go to My Dashboard</a>
              <a routerLink="/vehicles" class="btn btn-secondary btn-lg">Manage Vehicles</a>
            }
          </div>

          <div class="hero-metrics">
            <div class="metric-item">
              <strong>99.8%</strong>
              <span>Claim Satisfaction</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <strong>< 2 Hours</strong>
              <span>Avg Approval Speed</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <strong>$4.2M+</strong>
              <span>Protected Assets</span>
            </div>
          </div>
        </div>

        <div class="hero-card-preview">
          <div class="glass-card">
            <div class="card-header">
              <div class="badge badge-green">Live Protected</div>
              <span class="vin">VIN: 5YJ3E1EB8NF192834</span>
            </div>
            <div class="car-title">
              <h3>Tesla Model 3 Long Range</h3>
              <span>CA-8X921 • 2023 Electric</span>
            </div>
            <div class="coverage-bar">
              <div class="bar-labels">
                <span>Platinum Comprehensive</span>
                <span>88% Term Left</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width: 88%;"></div>
              </div>
            </div>
            <div class="card-perks">
              <div class="perk">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>24/7 Roadside Assistance</span>
              </div>
              <div class="perk">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Full Powertrain & ECU Shield</span>
              </div>
              <div class="perk">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Zero Deductible Repairs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="section-header">
          <span class="badge badge-blue">Core Capabilities</span>
          <h2>Engineered for peace of mind on every journey</h2>
          <p>Built with enterprise security, real-time database synchronicity, and automated workflows.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon icon-blue">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Certified Warranty Plans</h3>
            <p>From essential mechanical breakdown coverage to bumper-to-bumper EV electronics and radar sensor packages.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon icon-teal">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h3>Transparent Claims Tracking</h3>
            <p>Submit repair bills, track adjuster reviews in real time, and receive direct digital reimbursements without hassle.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon icon-amber">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <h3>Auto Finance Integration</h3>
            <p>Competitive auto loan terms, rate previews, and instant pre-approvals combined directly with your coverage policy.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .landing-container {
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .hero-section {
      display: grid;
      grid-template-columns: 1.25fr 1fr;
      gap: 3.5rem;
      align-items: center;
      padding: 5rem 0 4rem;
    }

    .hero-content {
      .eyebrow-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.35rem 0.85rem;
        border-radius: var(--radius-full);
        background: #EFF6FF;
        border: 1px solid #BFDBFE;
        color: #2563EB;
        font-size: 0.825rem;
        font-weight: 700;
        margin-bottom: 1.5rem;

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563EB;
          animation: pulse 2s infinite;
        }
      }

      h1 {
        font-size: clamp(2.4rem, 4.5vw, 3.8rem);
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--color-navy);
      }

      .hero-subtitle {
        margin-top: 1.25rem;
        font-size: 1.15rem;
        line-height: 1.6;
        color: var(--color-muted);
        max-width: 580px;
      }
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;

      .btn-lg {
        padding: 0.85rem 1.6rem;
        font-size: 1rem;
      }
    }

    .hero-metrics {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-top: 3.5rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-border);

      .metric-item {
        strong {
          display: block;
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-navy);
        }
        span {
          font-size: 0.825rem;
          color: var(--color-muted);
          font-weight: 500;
        }
      }

      .metric-divider {
        width: 1px;
        height: 38px;
        background: var(--color-border);
      }
    }

    .hero-card-preview {
      position: relative;

      .glass-card {
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
        padding: 2.25rem;
        box-shadow: 0 20px 45px rgba(11, 19, 43, 0.08);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-4px);
        }
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        .vin {
          font-family: monospace;
          font-size: 0.775rem;
          color: var(--color-muted);
          background: #F1F5F9;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
      }

      .car-title {
        h3 {
          font-size: 1.4rem;
        }
        span {
          color: var(--color-muted);
          font-size: 0.875rem;
        }
      }

      .coverage-bar {
        margin: 1.75rem 0;

        .bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: var(--color-dark);
        }

        .bar-track {
          width: 100%;
          height: 8px;
          background: #E2E8F0;
          border-radius: var(--radius-full);
          overflow: hidden;

          .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #2563EB, #0D9488);
            border-radius: var(--radius-full);
          }
        }
      }

      .card-perks {
        display: grid;
        gap: 0.75rem;

        .perk {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--color-slate);

          svg {
            color: #10B981;
            flex-shrink: 0;
          }
        }
      }
    }

    .features-section {
      padding: 5rem 0;
      border-top: 1px solid var(--color-border);

      .section-header {
        text-align: center;
        max-width: 640px;
        margin: 0 auto 3.5rem;

        h2 {
          font-size: 2.2rem;
          margin-top: 0.75rem;
        }

        p {
          color: var(--color-muted);
          margin-top: 0.5rem;
          font-size: 1.05rem;
        }
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
      }

      .feature-card {
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        box-shadow: var(--shadow-sm);
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          margin-bottom: 1.25rem;

          &.icon-blue { background: #EFF6FF; color: #2563EB; }
          &.icon-teal { background: #CCFBF1; color: #0D9488; }
          &.icon-amber { background: #FEF3C7; color: #D97706; }
        }

        h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--color-muted);
          font-size: 0.925rem;
          line-height: 1.6;
        }
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }

    @media (max-width: 960px) {
      .hero-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingPage {
  readonly auth = inject(AuthService);
}
