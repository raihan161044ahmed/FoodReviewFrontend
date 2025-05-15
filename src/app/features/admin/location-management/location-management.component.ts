// src/app/features/admin/location-management/location-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location';
import { AuthService } from '../../../core/authentication/auth.service';

@Component({
  selector: 'app-location-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-management.component.html',
  styleUrls: ['./location-management.component.css']
})
export class LocationManagementComponent implements OnInit {
  locations: Location[] = [];
  currentLocation: Partial<Location> = {};
  isEditing = false;
  errorMessage = '';

  constructor(
    private locationService: LocationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.locationService.getAllLocations().subscribe({
      next: (locations) => this.locations = locations,
      error: (err) => this.errorMessage = err.message
    });
  }

  editLocation(location: Location): void {
    this.currentLocation = { ...location };
    this.isEditing = true;
  }

  createNew(): void {
    this.currentLocation = {};
    this.isEditing = true;
  }

  saveLocation(): void {
    if (!this.currentLocation.name || !this.currentLocation.area) {
      this.errorMessage = 'Name and area are required';
      return;
    }

    let operation;
    if (this.currentLocation.id) {
      operation = this.locationService.updateLocation(this.currentLocation as Location);
    } else {
      operation = this.locationService.addLocation(this.currentLocation as Omit<Location, 'id'>);
    }

    (operation as import("rxjs").Observable<Location>).subscribe({
      next: (): void => {
        this.loadLocations();
        this.cancelEdit();
      },
      error: (err: { message: string }): void => { this.errorMessage = err.message; }
    });
  }

  deleteLocation(id: number): void {
    if (confirm('Are you sure you want to delete this location?')) {
      this.locationService.deleteLocation(id).subscribe({
        next: () => this.loadLocations(),
        error: (err) => this.errorMessage = err.message
      });
    }
  }

  cancelEdit(): void {
    this.currentLocation = {};
    this.isEditing = false;
    this.errorMessage = '';
  }
}
