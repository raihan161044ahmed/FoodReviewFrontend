// src/app/core/services/location.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Location } from '../models/location';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private apiUrl = 'api/location';

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Session expired. Please login again.'));
    }
    if (error.status === 403) {
      return throwError(() => new Error('You do not have permission to perform this action.'));
    }
    return throwError(() => new Error(error.error?.message || 'An unexpected error occurred'));
  }

  getAllLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getLocationById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getLocationsByArea(area: string): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/area/${encodeURIComponent(area)}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  searchLocations(query: string, filters?: {
    cuisineType?: string;
    minRating?: number;
    priceRange?: number;
    isOpenNow?: boolean;
  }): Observable<Location[]> {
    let params = new HttpParams().set('query', query);

    if (filters) {
      if (filters.cuisineType) params = params.set('cuisineType', filters.cuisineType);
      if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
      if (filters.priceRange) params = params.set('priceRange', filters.priceRange.toString());
      if (filters.isOpenNow !== undefined) params = params.set('isOpenNow', filters.isOpenNow.toString());
    }

    return this.http.get<Location[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getNearbyLocations(lat: number, lng: number, radius: number = 5): Observable<Location[]> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radius', radius.toString());

    return this.http.get<Location[]>(`${this.apiUrl}/nearby`, { params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addLocation(location: Omit<Location, 'id'>): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, location).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateLocation(location: Location): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${location.id}`, location).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
