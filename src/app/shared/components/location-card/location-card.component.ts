// src/app/shared/components/location-card/location-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '../../../core/models/location';

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './location-card.component.html',
  styleUrls: ['./location-card.component.scss']
})
export class LocationCardComponent {
  @Input() location!: Location;
  @Input() showActions: boolean = true;
  @Input() showDistance: boolean = false;
}
