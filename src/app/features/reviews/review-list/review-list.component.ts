// src/app/features/reviews/review-list/review-list.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';
import { AuthService } from '../../../core/authentication/auth.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  @Input() locationId!: number;
  reviews: Review[] = [];
  isLoading = true;
  error = '';
  currentUserId: number | null = null;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.currentUserValue?.id || null;
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByLocationId(this.locationId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  deleteReview(id: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.loadReviews();
        },
        error: (err) => {
          this.error = err.message;
        }
      });
    }
  }
}
