import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { DashboardPage } from './pages/dashboard/dashboard';
import { VehiclesPage } from './pages/vehicles/vehicles';
import { WarrantyPlansPage } from './pages/warranty-plans/warranty-plans';
import { ClaimsPage } from './pages/claims/claims';
import { FinancePage } from './pages/finance/finance';
import { AdminPage } from './pages/admin/admin';
import { NotFoundPage } from './pages/not-found/not-found';
import { UnauthorizedPage } from './pages/unauthorized/unauthorized';
import { AuthGuard, AdminGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'warranty-plans', component: WarrantyPlansPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [AuthGuard] },
  { path: 'vehicles', component: VehiclesPage, canActivate: [AuthGuard] },
  { path: 'claims', component: ClaimsPage, canActivate: [AuthGuard] },
  { path: 'finance', component: FinancePage, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPage, canActivate: [AdminGuard] },
  { path: 'unauthorized', component: UnauthorizedPage },
  { path: '**', component: NotFoundPage }
];
