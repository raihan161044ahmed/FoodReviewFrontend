// src/app/features/locations/location.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/authentication/auth.guard';

export const LOCATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./location-list/location-list.component').then(m => m.LocationListComponent),
    title: 'Restaurants'
  },
  {
    path: ':id',
    loadComponent: () => import('./location-detail/location-detail.component').then(m => m.LocationDetailComponent),
    title: 'Restaurant Details'
  },
  {
    path: ':id/reviews',
    loadComponent: () => import('../reviews/review-list/review-list.component').then(m => m.ReviewListComponent),
    title: 'Reviews'
  },
  {
    path: 'new',
    loadComponent: () => import('./location-form/location-form.component').then(m => m.LocationFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    title: 'Add Restaurant'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./location-form/location-form.component').then(m => m.LocationFormComponent),
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    title: 'Edit Restaurant'
  }
];
