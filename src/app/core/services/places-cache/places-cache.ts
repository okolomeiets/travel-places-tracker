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
  private readonly cache = new Map<string, CachedPlaces>();

  getCachedPlaces(keyword: string, location: string): GeoapifyPlacesResponse | null {
    const cacheKey = this.createCacheKey(keyword, location);
    const cachedValue = this.cache.get(cacheKey);

    if (!cachedValue) {
      return null;
    }

    const isExpired = Date.now() - cachedValue.timestamp > this.cacheDuration;

    if (isExpired) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cachedValue.data;
  }

  savePlaces(keyword: string, location: string, data: GeoapifyPlacesResponse): void {
    const cacheKey = this.createCacheKey(keyword, location);

    this.cache.set(cacheKey, {
      timestamp: Date.now(),
      data,
    });
  }

  private createCacheKey(keyword: string, location: string): string {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    return `${normalizedKeyword}-${normalizedLocation}`;
  }
}
