// src/app/features/locations/location-detail/location-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location';

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss']
})
export class LocationDetailComponent implements OnInit {
  location!: Location;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLocation(+id);
    }
  }

  loadLocation(id: number): void {
    this.locationService.getLocationById(id).subscribe({
      next: (location) => {
        this.location = location;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }
}
