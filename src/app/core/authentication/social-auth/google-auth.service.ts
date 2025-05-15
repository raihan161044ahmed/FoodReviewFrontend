import { Injectable, Inject } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  constructor(
    @Inject(SocialAuthService) private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.handleGoogleLogin(user.idToken);
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  private handleGoogleLogin(idToken: string): void {
    this.http.post<User>('/api/auth/google', { token: idToken }).subscribe({
      next: (user) => {
        this.authService['currentUserSubject'].next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Google login failed', err);
      }
    });
  }
}
