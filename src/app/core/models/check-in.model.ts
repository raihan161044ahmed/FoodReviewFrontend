// src/app/core/models/check-in.model.ts
export interface CheckIn {
  id: number;
  locationId: number;
  userId: number;
  comment?: string;
  rating: number;
  createdAt: Date;
}
