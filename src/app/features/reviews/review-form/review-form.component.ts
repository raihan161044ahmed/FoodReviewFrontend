// src/app/features/reviews/review-form/review-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { LocationService } from '../../../core/services/location.service';
import { Review } from '../../../core/models/review.model';
import { Location } from '../../../core/models/location';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input() locationId!: number;
  @Input() userId!: number; // Add userId as required input
  @Input() review?: Review; // For edit mode
  location!: Location;
  reviewForm: FormGroup;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.reviewForm = this.fb.group({
      rating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    if (this.locationId) {
      this.loadLocation(this.locationId);
    }
    if (this.review) {
      this.reviewForm.patchValue({
        rating: this.review.rating,
        comment: this.review.comment
      });
    }
  }

  private loadLocation(id: number): void {
    this.locationService.getLocationById(id).subscribe({
      next: (location) => {
        this.location = location;
      },
      error: (err) => {
        this.error = err.message;
      }
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid && this.locationId) {
      const reviewData = {
        userId: this.userId, // Add userId to reviewData
        locationId: this.locationId,
        rating: this.reviewForm.value.rating!,
        comment: this.reviewForm.value.comment || ''
      };

      let operation$: import('rxjs').Observable<Review | void>;
      if (this.review) {
        operation$ = this.reviewService.updateReview({ ...this.review, ...reviewData });
      } else {
        operation$ = this.reviewService.addReview(reviewData);
      }

      operation$.subscribe({
        next: () => {
          this.navigateBack();
        },
        error: (err) => {
          this.error = err.message;
          this.isSubmitting = false;
        }
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/locations', this.locationId]);
  }
}
