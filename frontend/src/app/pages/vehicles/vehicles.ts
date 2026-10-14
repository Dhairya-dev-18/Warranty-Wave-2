import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Vehicle {
  id: number;
  registrationNumber: string;
  vin: string;
  manufacturer: string;
  model: string;
  manufactureYear: number;
  category: string;
  fuelType: string;
  odometerReading: number;
  color: string;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <span class="badge badge-blue">Fleet & Personal Assets</span>
          <h1>My registered vehicles</h1>
          <p>Manage your covered automobiles, review VIN registrations, and inspect warranty eligibility.</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add New Vehicle</span>
        </button>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <span>Loading vehicle fleet...</span>
        </div>
      } @else if (vehicles().length === 0) {
        <div class="empty-state card">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <h3>No vehicles registered yet</h3>
          <p>Add your first vehicle to connect warranty protection and file claims.</p>
          <button (click)="openAddModal()" class="btn btn-primary">Add Vehicle Now</button>
        </div>
      } @else {
        <div class="vehicles-grid">
          @for (vehicle of vehicles(); track vehicle.id) {
            <div class="vehicle-card card">
              <div class="card-top">
                <span class="badge badge-green">Covered</span>
                <span class="reg-tag">{{ vehicle.registrationNumber }}</span>
              </div>
              <div class="vehicle-info">
                <h3>{{ vehicle.manufacturer }} {{ vehicle.model }}</h3>
                <span class="sub">{{ vehicle.manufactureYear }} • {{ vehicle.category }}</span>
              </div>
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="label">VIN</span>
                  <span class="val mono">{{ vehicle.vin }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">Powertrain</span>
                  <span class="val">{{ vehicle.fuelType || 'Standard' }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">Odometer</span>
                  <span class="val">{{ vehicle.odometerReading ? (vehicle.odometerReading | number) + ' mi' : 'N/A' }}</span>
                </div>
                <div class="spec-item">
                  <span class="label">Exterior</span>
                  <span class="val">{{ vehicle.color || 'Unspecified' }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Add Vehicle Modal -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Register new vehicle</h2>
              <button (click)="closeModal()" class="close-btn">&times;</button>
            </div>

            @if (modalError()) {
              <div class="error-banner">
                <span>{{ modalError() }}</span>
              </div>
            }

            <form [formGroup]="vehicleForm" (ngSubmit)="submitVehicle()">
              <div class="form-row">
                <div class="form-group">
                  <label for="manufacturer">Manufacturer</label>
                  <input id="manufacturer" formControlName="manufacturer" placeholder="e.g. Toyota" />
                </div>
                <div class="form-group">
                  <label for="model">Model</label>
                  <input id="model" formControlName="model" placeholder="e.g. Camry" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="manufactureYear">Year</label>
                  <input id="manufactureYear" formControlName="manufactureYear" type="number" placeholder="2023" />
                </div>
                <div class="form-group">
                  <label for="category">Category</label>
                  <select id="category" formControlName="category">
                    <option value="CAR">Car / Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="TRUCK">Truck</option>
                    <option value="VAN">Van</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="regNum">Registration Number</label>
                  <input id="regNum" formControlName="registrationNumber" placeholder="e.g. CA-7XY99" />
                </div>
                <div class="form-group">
                  <label for="vin">VIN (17 Characters)</label>
                  <input id="vin" formControlName="vin" placeholder="1HGCR2F83HA000000" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="fuelType">Fuel Type</label>
                  <select id="fuelType" formControlName="fuelType">
                    <option value="PETROL">Petrol / Gasoline</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric (EV)</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="CNG">CNG</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="odometerReading">Odometer (mi)</label>
                  <input id="odometerReading" formControlName="odometerReading" type="number" placeholder="24500" />
                </div>
              </div>

              <div class="form-group">
                <label for="color">Exterior Color</label>
                <input id="color" formControlName="color" placeholder="e.g. Midnight Silver" />
              </div>

              <div class="modal-actions">
                <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="vehicleForm.invalid || submitting()">
                  @if (submitting()) {
                    <span>Saving...</span>
                  } @else {
                    <span>Register Vehicle</span>
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

    .page-container {
      max-width: 1240px;
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

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 520px;
      margin: 2rem auto;

      .empty-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 1.25rem;
        border-radius: 16px;
        background: #EFF6FF;
        color: var(--color-primary);
        display: grid;
        place-items: center;
      }

      h3 { font-size: 1.35rem; }
      p { color: var(--color-muted); margin: 0.5rem 0 1.5rem; }
    }

    .vehicles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .vehicle-card {
      padding: 1.75rem;
      border-radius: var(--radius-xl);

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .reg-tag {
          font-family: monospace;
          font-weight: 700;
          font-size: 0.85rem;
          background: #F1F5F9;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          border: 1px solid var(--color-border);
        }
      }

      .vehicle-info {
        margin-bottom: 1.5rem;
        h3 { font-size: 1.35rem; }
        .sub { color: var(--color-muted); font-size: 0.85rem; font-weight: 500; }
      }

      .specs-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        background: #F8FAFC;
        padding: 1rem;
        border-radius: var(--radius-md);

        .spec-item {
          display: flex;
          flex-direction: column;
          .label { font-size: 0.7rem; color: var(--color-muted); text-transform: uppercase; font-weight: 700; }
          .val { font-size: 0.875rem; font-weight: 600; color: var(--color-dark); }
          .mono { font-family: monospace; font-size: 0.775rem; }
        }
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
        line-height: 1;
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

        input, select {
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
export class VehiclesPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly vehicles = signal<Vehicle[]>([]);
  readonly loading = signal(true);
  readonly showModal = signal(false);
  readonly submitting = signal(false);
  readonly modalError = signal<string | null>(null);

  readonly vehicleForm: FormGroup = this.fb.group({
    manufacturer: ['', [Validators.required, Validators.maxLength(120)]],
    model: ['', [Validators.required, Validators.maxLength(120)]],
    manufactureYear: [new Date().getFullYear(), [Validators.required, Validators.min(1980), Validators.max(2030)]],
    category: ['CAR', Validators.required],
    fuelType: ['PETROL', Validators.required],
    registrationNumber: ['', [Validators.required, Validators.maxLength(80)]],
    vin: ['', [Validators.required, Validators.maxLength(80)]],
    odometerReading: [10000, [Validators.min(0)]],
    color: ['Silver']
  });

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading.set(true);
    this.http.get<Vehicle[]>('/api/vehicles').subscribe({
      next: (data) => {
        this.vehicles.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openAddModal(): void {
    this.modalError.set(null);
    this.vehicleForm.reset({
      manufactureYear: 2023,
      category: 'CAR',
      fuelType: 'PETROL',
      odometerReading: 15000,
      color: 'Black'
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  submitVehicle(): void {
    if (this.vehicleForm.invalid) return;

    this.submitting.set(true);
    this.modalError.set(null);

    this.http.post<Vehicle>('/api/vehicles', this.vehicleForm.getRawValue()).subscribe({
      next: (newVehicle) => {
        this.submitting.set(false);
        this.showModal.set(false);
        this.vehicles.update((list) => [...list, newVehicle]);
      },
      error: (err) => {
        this.submitting.set(false);
        if (err.error?.message) {
          this.modalError.set(err.error.message);
        } else {
          this.modalError.set('Failed to register vehicle. Please verify input fields.');
        }
      }
    });
  }
}
