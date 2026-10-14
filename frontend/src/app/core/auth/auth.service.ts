import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UserSession {
  email: string;
  role: string;
  token: string;
}

export interface AuthResponseDto {
  token: string;
  type?: string;
  email: string;
  role: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly tokenKey = 'ww_token';
  private readonly sessionKey = 'ww_session';

  readonly user = signal<UserSession | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');
  readonly isCustomer = computed(() => this.user()?.role === 'CUSTOMER');

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const raw = localStorage.getItem(this.sessionKey);
    const token = localStorage.getItem(this.tokenKey);
    if (raw && token) {
      try {
        const parsed = JSON.parse(raw) as UserSession;
        if (parsed.email && parsed.role) {
          this.user.set({ ...parsed, token });
          return;
        }
      } catch {
        this.clearSession();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponseDto> {
    const payload = {
      email: email.trim().toLowerCase(),
      password
    };
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => {
        const session: UserSession = {
          email: res.email,
          role: res.role,
          token: res.token
        };
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        this.user.set(session);
      })
    );
  }

  register(data: RegisterPayload): Observable<{ message: string }> {
    const payload = {
      ...data,
      email: data.email.trim().toLowerCase()
    };
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, payload);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.sessionKey);
    this.user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
