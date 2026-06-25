import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { environment } from '../../../../../environments/environment';
import type { GeoapifyPlaceDetailsFeature } from '../../../../core/models/geoapify-place-details.model';
import { PlacesApi } from '../../../../core/services/places/places-api';

@Component({
  selector: 'app-place-details-page',
  imports: [RouterLink],
  templateUrl: './place-details-page.html',
  styleUrl: './place-details-page.scss',
})
export class PlaceDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly placesApi = inject(PlacesApi);

  place = signal<GeoapifyPlaceDetailsFeature | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  staticMapUrl = signal<string | null>(null);
  isMapLoading = signal(false);
  mapErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const placeId = this.route.snapshot.paramMap.get('placeId');

    if (!placeId) {
      this.errorMessage.set('Place id is missing.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.staticMapUrl.set(null);
    this.isMapLoading.set(false);
    this.mapErrorMessage.set(null);

    this.placesApi.getPlaceDetails(placeId).subscribe({
      next: (response) => {
        const firstFeature = response.features[0];

        if (!firstFeature) {
          this.errorMessage.set('Place details were not found.');
          this.isLoading.set(false);
          return;
        }

        this.place.set(firstFeature);

        const mapUrl = this.buildStaticMapUrl();

        if (mapUrl) {
          this.staticMapUrl.set(mapUrl);
          this.isMapLoading.set(true);
        }

        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set('Something went wrong while loading place details.');
        this.isLoading.set(false);

        console.error('Place details error:', error);
      },
    });
  }

  getPlaceName(): string {
    const place = this.place();

    return place?.properties.name || place?.properties.address_line1 || 'Unnamed place';
  }

  getPlaceType(): string {
    return this.place()?.properties.categories?.[0] || 'Place';
  }

  getMapUrl(): string {
    const place = this.place();

    if (!place?.properties.lat || !place.properties.lon) {
      return 'https://www.google.com/maps';
    }

    return `https://www.google.com/maps?q=${place.properties.lat},${place.properties.lon}`;
  }

  onMapLoad(): void {
    this.isMapLoading.set(false);
  }

  onMapError(): void {
    this.isMapLoading.set(false);
    this.mapErrorMessage.set('Map preview could not be loaded.');
  }

  private buildStaticMapUrl(): string | null {
    const place = this.place();

    if (!place?.properties.lat || !place.properties.lon) {
      return null;
    }

    const lon = place.properties.lon;
    const lat = place.properties.lat;

    const marker = encodeURIComponent(
      `lonlat:${lon},${lat};type:material;color:#b86b2f;size:48;icon:place;contentcolor:#ffffff`,
    );

    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=900&height=360&center=lonlat:${lon},${lat}&zoom=15&marker=${marker}&apiKey=${environment.apiKey}`;
  }
}
