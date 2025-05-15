// src/app/core/models/location.model.ts
export interface Location {
  id: number;
  name: string;
  area: string;
  latitude?: number;
  longitude?: number;
  // Additional frontend-specific properties
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  cuisineType?: string;
  priceRange?: number;
  distance?: number; // For calculated distance from user
}
