import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface ClaimRecord {
  id: string;
  vehicleId: number;
  vehicle: string;
  issue: string;
  estimatedCost: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'NEEDS_INFORMATION' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  date: string;
}

interface VehicleOption { id: number; manufacturer: string; model: string; registrationNumber: string; }
interface ClaimApiRecord { claimNumber: string; vehicleId: number; vehicle: string; issue: string; estimatedCost: number; status: ClaimRecord['status']; createdAt: string; }
interface ClaimPage { content: ClaimApiRecord[]; }

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      @if (errorMessage()) { <div class="error-banner">{{ errorMessage() }}</div> }
      <div class="page-header">
        <div>
          <span class="badge badge-amber">Claims Processing</span>
          <h1>Warranty service claims</h1>
          <p>File incident reports, submit repair shop invoices, and track adjuster determinations.</p>
        </div>
        <button (click)="openModal()" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>File New Claim</span>
        </button>
      </div>

      <div class="claims-list">
        @if (claims().length === 0 && !errorMessage()) { <p>No claims submitted yet.</p> }
        @for (claim of claims(); track claim.id) {
          <div class="claim-card card">
            <div class="claim-left">
              <div class="claim-id-row">
                <span class="claim-id">{{ claim.id }}</span>
                <span class="claim-date">{{ claim.date }}</span>
              </div>
              <h3>{{ claim.issue }}</h3>
              <span class="vehicle-sub">{{ claim.vehicle }}</span>
            </div>

            <div class="claim-right">
              <div class="claim-cost">
                <span class="label">Invoice Total</span>
                <strong>\${{ claim.estimatedCost | number:'1.2-2' }}</strong>
              </div>
              <span class="badge" [class.badge-amber]="claim.status === 'UNDER_REVIEW' || claim.status === 'NEEDS_INFORMATION'" [class.badge-green]="claim.status === 'APPROVED'" [class.badge-blue]="claim.status === 'SUBMITTED'" [class.badge-red]="claim.status === 'REJECTED' || claim.status === 'CLOSED'">
                {{ claim.status.replace('_', ' ') }}
              </span>
            </div>
          </div>
        }
      </div>

      <!-- File Claim Modal -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>File warranty claim</h2>
              <button (click)="closeModal()" class="close-btn">&times;</button>
            </div>

            <form [formGroup]="claimForm" (ngSubmit)="submitClaim()">
              <div class="form-group">
                <label for="vehicleSelect">Select Covered Vehicle</label>
                <select id="vehicleSelect" formControlName="vehicleId">
                  @for (vehicle of vehicles(); track vehicle.id) {
                    <option [ngValue]="vehicle.id">{{ vehicle.manufacturer }} {{ vehicle.model }} ({{ vehicle.registrationNumber }})</option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label for="issue">Describe Mechanical / Electrical Issue</label>
                <textarea id="issue" formControlName="issue" rows="3" placeholder="e.g. Inverter thermal warning with power steering assist failure..."></textarea>
              </div>

              <div class="form-group">
                <label for="cost">Repair Invoice Estimate ($)</label>
                <input id="cost" formControlName="cost" type="number" step="0.01" placeholder="850.00" />
              </div>

              <div class="modal-actions">
                <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="claimForm.invalid || submitting()">{{ submitting() ? 'Submitting…' : 'Submit Claim' }}</button>
              </div>
            </form>
          </div>
        </div>
      }
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
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1.5rem;

      h1 { font-size: 2.25rem; margin-top: 0.5rem; }
      p { color: var(--color-muted); margin-top: 0.25rem; }
    }

    .error-banner { background: #FEF2F2; color: #B91C1C; padding: .75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; }
    .badge-red { background: #FEE2E2; color: #B91C1C; }
    .claims-list {
      display: grid;
      gap: 1.25rem;
    }

    .claim-card {
      padding: 1.5rem 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;

      .claim-id-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.4rem;

        .claim-id {
          font-family: monospace;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--color-primary);
        }

        .claim-date {
          font-size: 0.775rem;
          color: var(--color-muted);
        }
      }

      h3 { font-size: 1.2rem; }
      .vehicle-sub { font-size: 0.85rem; color: var(--color-muted); }

      .claim-right {
        display: flex;
        align-items: center;
        gap: 2rem;

        .claim-cost {
          text-align: right;
          .label { display: block; font-size: 0.7rem; color: var(--color-muted); text-transform: uppercase; font-weight: 700; }
          strong { font-size: 1.25rem; color: var(--color-navy); }
        }
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      .close-btn { background: none; border: none; font-size: 1.75rem; cursor: pointer; color: var(--color-muted); }
    }

    form {
      display: grid;
      gap: 1rem;

      .form-group {
        display: grid;
        gap: 0.35rem;

        label { font-size: 0.8rem; font-weight: 600; color: var(--color-dark); }
        input, select, textarea {
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: 0.9rem;
          outline: none;
          &:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
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
export class ClaimsPage implements OnInit {
  private readonly http = inject(HttpClient);
  readonly showModal = signal(false);
  readonly claims = signal<ClaimRecord[]>([]);
  readonly vehicles = signal<VehicleOption[]>([]);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly claimForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.claimForm = fb.group({
      vehicleId: [null, Validators.required],
      issue: ['', [Validators.required, Validators.minLength(10)]],
      cost: [450.00, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadClaims();
    this.http.get<VehicleOption[]>('/api/vehicles').subscribe({
      next: vehicles => { this.vehicles.set(vehicles); this.claimForm.patchValue({ vehicleId: vehicles[0]?.id ?? null }); },
      error: () => this.errorMessage.set('Could not load your vehicles. Please try again.')
    });
  }

  private loadClaims(): void {
    this.http.get<ClaimPage>('/api/claims').subscribe({
      next: result => this.claims.set(result.content.map(claim => ({
        id: claim.claimNumber, vehicleId: claim.vehicleId, vehicle: claim.vehicle, issue: claim.issue,
        estimatedCost: claim.estimatedCost, status: claim.status, date: new Date(claim.createdAt).toLocaleDateString()
      }))),
      error: () => this.errorMessage.set('Could not load claims from the server.')
    });
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submitClaim(): void {
    if (this.claimForm.invalid) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    const val = this.claimForm.getRawValue();
    this.http.post<ClaimApiRecord>('/api/claims', {
      vehicleId: val.vehicleId, issueDescription: val.issue, estimatedCost: Number(val.cost)
    }).subscribe({
      next: () => { this.submitting.set(false); this.closeModal(); this.loadClaims(); },
      error: err => { this.submitting.set(false); this.errorMessage.set(err.error?.message ?? 'Claim submission failed. Please check your details.'); }
    });
  }
}
