import { Injectable } from '@angular/core';

import type { GeoapifyPlacesResponse } from '../../models/geoapify-place.model';

type CachedPlaces = {
  timestamp: number;
  data: GeoapifyPlacesResponse;
};

@Injectable({
  providedIn: 'root',
})
export class PlacesCache {
  private readonly cacheDuration = 10 * 60 * 1000;
  private readonly storagePrefix = 'travel-places-cache';

  getCachedPlaces(keyword: string, location: string): GeoapifyPlacesResponse | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const cacheKey = this.createCacheKey(keyword, location);
    const cachedValue = localStorage.getItem(cacheKey);

    if (!cachedValue) {
      return null;
    }

    try {
      const parsedValue = JSON.parse(cachedValue) as CachedPlaces;
      const isExpired = Date.now() - parsedValue.timestamp > this.cacheDuration;

      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return parsedValue.data;
    } catch {
      localStorage.removeItem(cacheKey);
      return null;
    }
  }

  savePlaces(keyword: string, location: string, data: GeoapifyPlacesResponse): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const cacheKey = this.createCacheKey(keyword, location);

    const cachedValue: CachedPlaces = {
      timestamp: Date.now(),
      data,
    };

    localStorage.setItem(cacheKey, JSON.stringify(cachedValue));
  }

  private createCacheKey(keyword: string, location: string): string {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    return `${this.storagePrefix}-${normalizedKeyword}-${normalizedLocation}`;
  }
}
