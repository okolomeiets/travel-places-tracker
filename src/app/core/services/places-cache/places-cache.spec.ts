import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GeoapifyPlacesResponse } from '../../models/geoapify-place.model';
import { PlacesCache } from './places-cache';

const mockPlacesResponse: GeoapifyPlacesResponse = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Test Museum',
        city: 'Wrocław',
        country: 'Poland',
        categories: ['entertainment.museum'],
        place_id: 'test-place-id',
      },
      geometry: {
        type: 'Point',
        coordinates: [17.0326689, 51.1089776],
      },
    },
  ],
};

describe('PlacesCache', () => {
  let service: PlacesCache;

  beforeEach(() => {
    service = new PlacesCache();
    vi.useRealTimers();
  });

  it('should save and return cached places for the same keyword and location', () => {
    service.savePlaces('museum', 'wroclaw', mockPlacesResponse);

    const cachedPlaces = service.getCachedPlaces('museum', 'wroclaw');

    expect(cachedPlaces).toEqual(mockPlacesResponse);
  });

  it('should normalize keyword and location when reading cache', () => {
    service.savePlaces('Museum', 'Wroclaw', mockPlacesResponse);

    const cachedPlaces = service.getCachedPlaces(' museum ', ' wroclaw ');

    expect(cachedPlaces).toEqual(mockPlacesResponse);
  });

  it('should return null when cache does not exist', () => {
    const cachedPlaces = service.getCachedPlaces('park', 'wroclaw');

    expect(cachedPlaces).toBeNull();
  });

  it('should return null when cached data is older than 10 minutes', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2026-06-25T10:00:00Z'));

    service.savePlaces('museum', 'wroclaw', mockPlacesResponse);

    vi.setSystemTime(new Date('2026-06-25T10:11:00Z'));

    const cachedPlaces = service.getCachedPlaces('museum', 'wroclaw');

    expect(cachedPlaces).toBeNull();

    vi.useRealTimers();
  });
});
