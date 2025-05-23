// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/authentication/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'locations',
    loadComponent: () => import('./location-management/location-management.component').then(m => m.LocationManagementComponent),
    canActivate: [AuthGuard],
    data: { roles: ['Administrator'] }
  }
];
