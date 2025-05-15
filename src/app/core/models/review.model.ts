// src/app/core/models/review.model.ts
export interface Review {
  id: number;
  userId: number;
  userName?: string; // Added for frontend display
  locationId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  userAvatar?: string; // Optional for UI display
}
