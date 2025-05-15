// src/app/features/user/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/authentication/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';
import { CheckIn } from '../../../core/models/check-in.model';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile!: User;
  userReviews: Review[] = [];
  userCheckIns: CheckIn[] = [];
  isEditing = false;
  isLoading = true;
  error = '';
  profileForm: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatarUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserReviews();
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser?.id) {
      this.authService.getUserProfile(currentUser.id).subscribe({
        next: (user) => {
          this.userProfile = user;
            const randomName = 'User' + Math.floor(Math.random() * 10000);
            this.profileForm.patchValue({
            name: randomName,
            email: user.email
            });
          this.profileForm.disable();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
        }
      });
    }
  }

  private loadUserReviews(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser?.id) {
      this.reviewService.getReviewById(currentUser.id).subscribe({
        next: (review) => {
          this.userReviews = Array.isArray(review) ? review : [review];
        },
        error: (err) => {
          console.error('Failed to load reviews:', err);
        }
      });
    }
  }


  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.userProfile) {
      this.isLoading = true;
      const updatedUser = {
        ...this.userProfile,
        ...this.profileForm.value
      };

      this.authService.updateUserProfile(updatedUser).subscribe({
        next: (user) => {
          this.userProfile = user;
          this.authService.updateCurrentUser(user);
          this.isEditing = false;
          this.profileForm.disable();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
        }
      });
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser?.id) {
        this.authService.deleteUserAccount(currentUser.id).subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.error = err.message;
          }
        });
      }
    }
  }
}
