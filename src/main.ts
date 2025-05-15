import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './app/environment/environment';
import { tokenInterceptorFn } from './app/core/authentication/token.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
  provideRouter(routes),
  provideHttpClient(
    withInterceptors([tokenInterceptorFn]),
    withFetch()
  ),
  provideAnimations(),
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(environment.googleClientId)
        }
      ],
      onError: (err) => {
        console.error('Social auth error:', err);
      }
    } as SocialAuthServiceConfig,
  }
]

}).catch(err => console.error(err));
