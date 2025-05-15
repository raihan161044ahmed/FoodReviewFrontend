// src/app/features/locations/location-form/location-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {
  isEditMode = false;
  locationId?: number;
  locationForm: ReturnType<FormBuilder['group']>;
  isLoading = false;
  error = '';


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService
  ) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      area: ['', Validators.required],
      cuisineType: [''],
      priceRange: [1, [Validators.min(1), Validators.max(4)]],
      latitude: [null as number | null],
      longitude: [null as number | null]
    });
  }


  loadLocationForEdit(id: number): void {
    this.isLoading = true;
    this.locationService.getLocationById(id).subscribe({
      next: (location) => {
        this.locationForm.patchValue({
          name: location.name,
          area: location.area,
          cuisineType: location.cuisineType,
          priceRange: location.priceRange,
          latitude: location.latitude || null,
          longitude: location.longitude || null
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.isLoading = true;
      const locationData = this.locationForm.value;

      let operation$: import('rxjs').Observable<Location | void>;
      if (this.isEditMode && this.locationId) {
        operation$ = this.locationService.updateLocation({ ...locationData, id: this.locationId } as Location);
      } else {
        operation$ = this.locationService.addLocation(locationData as Omit<Location, 'id'>);
      }

      operation$.subscribe({
        next: (): void => {
          this.router.navigate(['/locations']);
        },
        error: (err: { message: string }): void => {
          this.error = err.message;
          this.isLoading = false;
        }
      });
    }
  }
}
