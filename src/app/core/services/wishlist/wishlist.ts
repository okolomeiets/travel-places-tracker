import { Injectable, signal } from '@angular/core';

import type { GeoapifyPlaceFeature } from '../../models/geoapify-place.model';

@Injectable({
  providedIn: 'root',
})
export class Wishlist {
  private readonly storageKey = 'travel-places-wishlist';

  private readonly wishlist = signal<GeoapifyPlaceFeature[]>(this.readFromStorage());

  wishlistPlaces = this.wishlist.asReadonly();

  addPlace(place: GeoapifyPlaceFeature): void {
    if (this.isInWishlist(place)) {
      return;
    }

    const updatedWishlist = [...this.wishlist(), place];

    this.wishlist.set(updatedWishlist);
    this.saveToStorage(updatedWishlist);
  }

  removePlace(place: GeoapifyPlaceFeature): void {
    const placeId = this.getPlaceId(place);

    const updatedWishlist = this.wishlist().filter(
      (wishlistPlace) => this.getPlaceId(wishlistPlace) !== placeId,
    );

    this.wishlist.set(updatedWishlist);
    this.saveToStorage(updatedWishlist);
  }

  isInWishlist(place: GeoapifyPlaceFeature): boolean {
    const placeId = this.getPlaceId(place);

    return this.wishlist().some((wishlistPlace) => this.getPlaceId(wishlistPlace) === placeId);
  }

  private getPlaceId(place: GeoapifyPlaceFeature): string {
    return (
      place.properties.place_id ||
      `${place.properties.name}-${place.geometry.coordinates[0]}-${place.geometry.coordinates[1]}`
    );
  }

  private readFromStorage(): GeoapifyPlaceFeature[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const savedWishlist = localStorage.getItem(this.storageKey);

    if (!savedWishlist) {
      return [];
    }

    try {
      const parsedWishlist = JSON.parse(savedWishlist);

      return Array.isArray(parsedWishlist) ? parsedWishlist : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(wishlist: GeoapifyPlaceFeature[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
  }
}
