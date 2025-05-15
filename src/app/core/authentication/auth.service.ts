// src/app/core/authentication/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterUserRequest, User, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'api/user/profile'; // Add your API base URL here

  constructor() {
    this.initializeUser();
  }

  private initializeUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data', error);
        this.clearUser();
      }
    }
  }

  register(userData: RegisterUserRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('api/user/register', userData).pipe(
      tap(response => {
        if (response.message) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('api/user/login', credentials).pipe(
      tap(response => {
        const user = {
          id: response.id,
          email: response.email,
          role: response.role,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('api/user/logout', {}).pipe(
      tap(() => {
        this.clearUser();
        this.router.navigate(['/login']);
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>('api/user/profile');
  }

  private clearUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  getToken(): string | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
      const parsed = JSON.parse(user);
      return parsed.token || null;
      } catch {
      return null;
      }
    }
    return null;
  }
  updateCurrentUser(user: User): void {
  localStorage.setItem('currentUser', JSON.stringify(user));
  this.currentUserSubject.next(user);
}
getUserProfile(userId: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${userId}`);
}
updateUserProfile(user: User): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
}

deleteUserAccount(userId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${userId}`);
}
}
