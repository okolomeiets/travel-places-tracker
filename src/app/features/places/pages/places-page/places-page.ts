import { Component, inject, signal } from '@angular/core';
import { switchMap, throwError } from 'rxjs';

import type { GeoapifyPlaceFeature } from '../../../../core/models/geoapify-place.model';
import { PlacesApi } from '../../../../core/services/places/places-api';
import { PlacesCache } from '../../../../core/services/places-cache/places-cache';
import { Wishlist } from '../../../../core/services/wishlist/wishlist';
import { PlaceCard } from '../../components/place-card/place-card';
import { AppSpinner } from '../../../../shared/components/app-spinner/app-spinner';
import {
  PlaceSearchForm,
  type PlaceSearchFormValue,
} from '../../components/place-search-form/place-search-form';

@Component({
  selector: 'app-places-page',
  imports: [PlaceSearchForm, PlaceCard, AppSpinner],
  templateUrl: './places-page.html',
  styleUrl: './places-page.scss',
})
export class PlacesPage {
  private readonly placesApi = inject(PlacesApi);
  private readonly placesCache = inject(PlacesCache);
  private readonly wishlist = inject(Wishlist);

  places = signal<GeoapifyPlaceFeature[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  searchedLocation = signal('');
  cacheMessage = signal<string | null>(null);

  wishlistPlaces = this.wishlist.wishlistPlaces;

  onSearch(value: PlaceSearchFormValue): void {
    const keyword = value.keyword.trim();
    const location = value.location.trim();

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.cacheMessage.set(null);
    this.places.set([]);
    this.searchedLocation.set(location);

    const cachedPlaces = this.placesCache.getCachedPlaces(keyword, location);

    if (cachedPlaces) {
      this.places.set(cachedPlaces.features);
      this.isLoading.set(false);
      this.cacheMessage.set('Loaded from cache');

      return;
    }

    this.placesApi
      .geocodeLocation(location)
      .pipe(
        switchMap((geocodeResponse) => {
          const bbox = geocodeResponse.features[0]?.bbox;

          if (!bbox) {
            return throwError(() => new Error('Location was not found. Try another location.'));
          }

          return this.placesApi.searchPlacesByBounds(keyword, bbox);
        }),
      )
      .subscribe({
        next: (placesResponse) => {
          this.places.set(placesResponse.features);
          this.placesCache.savePlaces(keyword, location, placesResponse);
          this.cacheMessage.set('Loaded from API and saved to cache');
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(
            error instanceof Error ? error.message : 'Something went wrong while searching places.',
          );

          this.isLoading.set(false);
          console.error('Search error:', error);
        },
      });
  }

  onAddToWishlist(place: GeoapifyPlaceFeature): void {
    this.wishlist.addPlace(place);
  }

  onRemoveFromWishlist(place: GeoapifyPlaceFeature): void {
    this.wishlist.removePlace(place);
  }

  isPlaceInWishlist(place: GeoapifyPlaceFeature): boolean {
    return this.wishlist.isInWishlist(place);
  }
}
