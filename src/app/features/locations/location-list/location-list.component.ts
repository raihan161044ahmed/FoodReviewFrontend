// src/app/features/locations/location-list/location-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocationCardComponent } from '../../../shared/components/location-card/location-card.component';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LocationCardComponent],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {
  locations: Location[] = [];
  isLoading = true;
  error = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.locationService.getAllLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }
}
