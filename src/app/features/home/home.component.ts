// src/app/features/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/location';
import { LocationCardComponent } from '../../shared/components/location-card/location-card.component';
import { AuthService } from '../../core/authentication/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LocationCardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredLocations: Location[] = [];
  popularLocations: Location[] = [];
  isLoading = true;
  searchQuery = '';
  isLoggedIn = false;

  constructor(
    private locationService: LocationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.loadFeaturedLocations();
    this.loadPopularLocations();
  }

  loadFeaturedLocations(): void {
    interface GetLocationsResponse {
      next: (locations: Location[]) => void;
      error?: () => void;
    }

    this.locationService.getAllLocations().subscribe(<GetLocationsResponse>{
      next: (locations: Location[]) => {
      this.featuredLocations = locations.slice(0, 3);
      this.isLoading = false;
      },
      error: (): void => {
      this.isLoading = false;
      }
    });
  }

  loadPopularLocations(): void {
    this.locationService.getAllLocations().subscribe({
      next: (locations) => {
        // Sort by rating and get top 6
        this.popularLocations = [...locations]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6);
      }
    });
  }

  searchLocations(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.locationService.searchLocations(this.searchQuery).subscribe({
        next: (locations) => {
          this.popularLocations = locations;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
