import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface AdminStats {
  totalCustomers: number;
  activePlans: number;
}

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
}

export interface WarrantyPlanItem {
  id: number;
  name: string;
  description: string;
  price: number;
  coverageDurationMonths: number;
  active: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <div>
          <span class="badge badge-purple">Executive Management</span>
          <h1>Administrator Console</h1>
          <p>System metrics, platform users, and warranty catalog management.</p>
        </div>
        <button (click)="openAddPlanModal()" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Create Warranty Plan</span>
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="card stat-card">
          <span class="stat-label">Total Customers</span>
          <strong class="stat-value">{{ stats()?.totalCustomers ?? 0 }}</strong>
          <span class="stat-trend text-green">↑ Active customer accounts</span>
        </div>
        <div class="card stat-card">
          <span class="stat-label">Active Coverage Plans</span>
          <strong class="stat-value">{{ stats()?.activePlans ?? 0 }}</strong>
          <span class="stat-trend text-blue">Available in catalog</span>
        </div>
        <div class="card stat-card">
          <span class="stat-label">Claims in Queue</span>
          <strong class="stat-value">3</strong>
          <span class="stat-trend text-amber">Requires Adjuster Review</span>
        </div>
        <div class="card stat-card">
          <span class="stat-label">Service API Health</span>
          <strong class="stat-value text-green">100%</strong>
          <span class="stat-trend text-green">All services operational</span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-bar">
        <button [class.active]="activeTab() === 'users'" (click)="activeTab.set('users')">
          User Accounts ({{ users().length }})
        </button>
        <button [class.active]="activeTab() === 'plans'" (click)="activeTab.set('plans')">
          Warranty Catalog ({{ plans().length }})
        </button>
      </div>

      <!-- Users Tab -->
      @if (activeTab() === 'users') {
        <div class="card table-card">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (u of users(); track u.id) {
                  <tr>
                    <td>#{{ u.id }}</td>
                    <td><strong>{{ u.firstName }} {{ u.lastName }}</strong></td>
                    <td class="mono">{{ u.email }}</td>
                    <td>
                      <span class="badge" [class.badge-purple]="u.role === 'ADMIN'" [class.badge-blue]="u.role !== 'ADMIN'">
                        {{ u.role }}
                      </span>
                    </td>
                    <td>
                      <span class="badge badge-green">{{ u.accountStatus }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Plans Tab -->
      @if (activeTab() === 'plans') {
        <div class="card table-card">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Plan ID</th>
                  <th>Plan Name</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (p of plans(); track p.id) {
                  <tr>
                    <td>#{{ p.id }}</td>
                    <td><strong>{{ p.name }}</strong></td>
                    <td>{{ p.coverageDurationMonths }} Months</td>
                    <td><strong>\${{ p.price }}</strong></td>
                    <td>
                      <span class="badge" [class.badge-green]="p.active" [class.badge-amber]="!p.active">
                        {{ p.active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Add Plan Modal -->
      @if (showPlanModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Publish new warranty plan</h2>
              <button (click)="closeModal()" class="close-btn">&times;</button>
            </div>

            @if (planError()) {
              <div class="error-banner">
                <span>{{ planError() }}</span>
              </div>
            }

            <form [formGroup]="planForm" (ngSubmit)="submitPlan()">
              <div class="form-group">
                <label for="planName">Plan Name</label>
                <input id="planName" formControlName="name" placeholder="e.g. Titan Ultimate Coverage" />
              </div>

              <div class="form-group">
                <label for="description">Summary Description</label>
                <input id="description" formControlName="description" placeholder="Comprehensive mechanical and electrical protection" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="duration">Duration (Months)</label>
                  <input id="duration" formControlName="coverageDurationMonths" type="number" placeholder="24" />
                </div>
                <div class="form-group">
                  <label for="price">Price ($)</label>
                  <input id="price" formControlName="price" type="number" step="0.01" placeholder="499.00" />
                </div>
              </div>

              <div class="form-group">
                <label for="coverageDetails">Coverage Details</label>
                <textarea id="coverageDetails" formControlName="coverageDetails" rows="3" placeholder="Engine, transmission, drive axles, electrical systems..."></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="planForm.invalid || submittingPlan()">
                  @if (submittingPlan()) {
                    <span>Publishing...</span>
                  } @else {
                    <span>Publish Plan</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .admin-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1.5rem;

      h1 { font-size: 2.25rem; margin-top: 0.5rem; }
      p { color: var(--color-muted); margin-top: 0.25rem; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      padding: 1.5rem;

      .stat-label {
        display: block;
        font-size: 0.775rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--color-muted);
        letter-spacing: 0.05em;
      }

      .stat-value {
        display: block;
        font-family: var(--font-heading);
        font-size: 2.25rem;
        margin: 0.25rem 0;
        color: var(--color-navy);

        &.text-green { color: #10B981; }
      }

      .stat-trend {
        font-size: 0.8rem;
        font-weight: 600;

        &.text-green { color: #10B981; }
        &.text-blue { color: #2563EB; }
        &.text-amber { color: #D97706; }
      }
    }

    .tabs-bar {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 1.5rem;

      button {
        background: none;
        border: none;
        padding: 0.75rem 1.25rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-muted);
        cursor: pointer;
        position: relative;
        transition: color 0.2s;

        &.active {
          color: var(--color-primary);

          &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--color-primary);
          }
        }
      }
    }

    .table-card {
      overflow: hidden;
    }

    .table-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;

      th {
        background: #F8FAFC;
        padding: 0.85rem 1.25rem;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--color-muted);
        letter-spacing: 0.04em;
        border-bottom: 1px solid var(--color-border);
      }

      td {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-dark);

        &.mono {
          font-family: monospace;
          color: var(--color-slate);
        }
      }

      tr:last-child td {
        border-bottom: none;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      .close-btn {
        background: none;
        border: none;
        font-size: 1.75rem;
        cursor: pointer;
        color: var(--color-muted);
      }
    }

    .error-banner {
      background: #FEF2F2;
      border: 1px solid #FCA5A5;
      color: #B91C1C;
      padding: 0.65rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    form {
      display: grid;
      gap: 1rem;

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .form-group {
        display: grid;
        gap: 0.35rem;

        label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-dark);
        }

        input, textarea {
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: 0.9rem;
          outline: none;

          &:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
          }
        }
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1rem;
      }
    }
  `]
})
export class AdminPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly stats = signal<AdminStats | null>(null);
  readonly users = signal<UserSummary[]>([]);
  readonly plans = signal<WarrantyPlanItem[]>([]);
  readonly activeTab = signal<'users' | 'plans'>('users');
  readonly showPlanModal = signal(false);
  readonly submittingPlan = signal(false);
  readonly planError = signal<string | null>(null);

  readonly planForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', Validators.required],
    coverageDurationMonths: [24, [Validators.required, Validators.min(1)]],
    price: [499.00, [Validators.required, Validators.min(0)]],
    coverageDetails: ['Engine, transmission, and cooling systems.'],
    active: [true]
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get<AdminStats>('/api/admin/stats').subscribe({
      next: (s) => this.stats.set(s),
      error: () => {}
    });

    this.http.get<UserSummary[]>('/api/admin/users').subscribe({
      next: (u) => this.users.set(u),
      error: () => {}
    });

    this.http.get<WarrantyPlanItem[]>('/api/admin/plans').subscribe({
      next: (p) => this.plans.set(p),
      error: () => {}
    });
  }

  openAddPlanModal(): void {
    this.planError.set(null);
    this.planForm.reset({
      coverageDurationMonths: 24,
      price: 499.00,
      coverageDetails: 'Full mechanical & electrical breakdown coverage.',
      active: true
    });
    this.showPlanModal.set(true);
  }

  closeModal(): void {
    this.showPlanModal.set(false);
  }

  submitPlan(): void {
    if (this.planForm.invalid) return;

    this.submittingPlan.set(true);
    this.planError.set(null);

    this.http.post<WarrantyPlanItem>('/api/admin/plans', this.planForm.getRawValue()).subscribe({
      next: (created) => {
        this.submittingPlan.set(false);
        this.showPlanModal.set(false);
        this.plans.update((list) => [...list, created]);
        this.activeTab.set('plans');
      },
      error: (err) => {
        this.submittingPlan.set(false);
        this.planError.set(err.error?.message || 'Failed to create plan.');
      }
    });
  }
}
