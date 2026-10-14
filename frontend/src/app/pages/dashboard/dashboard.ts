import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface DashboardStats {
  customers: number;
  activePlans: number;
  activeClaims: number;
  message: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="welcome-banner">
        <div>
          <h1>Welcome, {{ auth.user()?.email }}</h1>
          <p>Portfolio overview, warranty status, and quick automotive operations.</p>
        </div>
        <div class="banner-badge">
          <span class="status-indicator"></span>
          <span>Account Status: Active</span>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card card">
          <div class="icon-wrap blue">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div class="metric-details">
            <span class="label">My Vehicles</span>
            <strong class="count">{{ vehicleCount() }}</strong>
          </div>
        </div>

        <div class="metric-card card">
          <div class="icon-wrap teal">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="metric-details">
            <span class="label">Available Plans</span>
            <strong class="count">{{ stats()?.activePlans ?? 0 }}</strong>
          </div>
        </div>

        <div class="metric-card card">
          <div class="icon-wrap amber">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
          </div>
          <div class="metric-details">
            <span class="label">Active Claims</span>
            <strong class="count">{{ stats()?.activeClaims ?? 0 }}</strong>
          </div>
        </div>

        <div class="metric-card card">
          <div class="icon-wrap green">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="metric-details">
            <span class="label">Financing tool</span>
            <strong class="count text-green">Estimator</strong>
          </div>
        </div>
      </div>

      <div class="content-split">
        <div class="section-card card">
          <div class="section-title">
            <h3>Quick Actions</h3>
          </div>
          <div class="actions-list">
            <a routerLink="/vehicles" class="action-item">
              <div class="act-icon">🚗</div>
              <div>
                <strong>Register a New Vehicle</strong>
                <p>Add vehicle identification and mileage details</p>
              </div>
            </a>
            <a routerLink="/warranty-plans" class="action-item">
              <div class="act-icon">🛡️</div>
              <div>
                <strong>Explore Coverage Plans</strong>
                <p>View bumper-to-bumper and powertrain protection</p>
              </div>
            </a>
            <a routerLink="/claims" class="action-item">
              <div class="act-icon">📋</div>
              <div>
                <strong>File or Track a Claim</strong>
                <p>Submit repair bills for instant reimbursement review</p>
              </div>
            </a>
          </div>
        </div>

        <div class="section-card card">
          <div class="section-title">
            <h3>Recent Policy Activity</h3>
          </div>
          <p>Your claims are listed on the Claims page. Warranty activity will appear here when warranty registrations are supported.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .dashboard-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }

    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1.5rem;

      h1 { font-size: 2rem; }
      p { color: var(--color-muted); margin-top: 0.25rem; }

      .banner-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem 0.85rem;
        background: #ECFDF5;
        border: 1px solid #A7F3D0;
        color: #065F46;
        border-radius: var(--radius-full);
        font-size: 0.825rem;
        font-weight: 600;

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
        }
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .metric-card {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;

      .icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: grid;
        place-items: center;

        &.blue { background: #EFF6FF; color: #2563EB; }
        &.teal { background: #CCFBF1; color: #0D9488; }
        &.amber { background: #FEF3C7; color: #D97706; }
        &.green { background: #DCFCE7; color: #16A34A; }
      }

      .metric-details {
        .label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .count {
          font-family: var(--font-heading);
          font-size: 1.85rem;
          color: var(--color-navy);

          &.text-green {
            color: #16A34A;
            font-size: 1.5rem;
          }
        }
      }
    }

    .content-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .section-card {
      padding: 2rem;

      .section-title {
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 1rem;
        margin-bottom: 1.25rem;
        h3 { font-size: 1.25rem; }
      }
    }

    .actions-list {
      display: grid;
      gap: 1rem;

      .action-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #F8FAFC;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        transition: all 0.2s;

        .act-icon {
          font-size: 1.5rem;
        }

        strong {
          display: block;
          font-size: 0.95rem;
          color: var(--color-navy);
        }

        p {
          font-size: 0.8rem;
          color: var(--color-muted);
          margin-top: 0.15rem;
        }

        &:hover {
          background: #EFF6FF;
          border-color: #BFDBFE;
          transform: translateX(4px);
        }
      }
    }

    .activity-timeline {
      list-style: none;
      display: grid;
      gap: 1.25rem;

      li {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;

        .bullet {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 0.35rem;
          flex-shrink: 0;

          &.success { background: #10B981; }
          &.info { background: #3B82F6; }
          &.warning { background: #F59E0B; }
        }

        .act-info {
          strong {
            display: block;
            font-size: 0.9rem;
            color: var(--color-navy);
          }
          span {
            font-size: 0.775rem;
            color: var(--color-muted);
          }
        }
      }
    }

    @media (max-width: 860px) {
      .content-split {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardPage implements OnInit {
  readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);

  readonly stats = signal<DashboardStats | null>(null);
  readonly vehicleCount = signal(0);

  ngOnInit(): void {
    this.http.get<DashboardStats>('/api/dashboard').subscribe({
      next: (data) => this.stats.set(data),
      error: () => {}
    });

    this.http.get<any[]>('/api/vehicles').subscribe({
      next: (list) => this.vehicleCount.set(list.length),
      error: () => {}
    });
  }
}
