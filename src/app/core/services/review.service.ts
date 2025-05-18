// src/app/core/services/review.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Review } from '../models/review.model';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private env= environment
  private apiUrl = this.env + '/review';

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

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  getReviewsByLocationId(locationId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.env}/location/${locationId}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addReview(review: Omit<Review, 'id' | 'createdAt'>): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateReview(review: Review): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${review.id}`, review).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
