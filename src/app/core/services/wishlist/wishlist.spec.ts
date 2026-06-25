import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import type { GeoapifyPlaceFeature } from '../../models/geoapify-place.model';
import { Wishlist } from './wishlist';

const storageKey = 'travel-places-wishlist';

const mockPlace: GeoapifyPlaceFeature = {
  type: 'Feature',
  properties: {
    name: 'Test Museum',
    city: 'Wrocław',
    country: 'Poland',
    categories: ['entertainment.museum'],
    place_id: 'test-place-id',
    formatted: 'Test Museum, Wrocław, Poland',
  },
  geometry: {
    type: 'Point',
    coordinates: [17.0326689, 51.1089776],
  },
};

const anotherMockPlace: GeoapifyPlaceFeature = {
  type: 'Feature',
  properties: {
    name: 'Test Park',
    city: 'Wrocław',
    country: 'Poland',
    categories: ['leisure.park'],
    place_id: 'another-test-place-id',
    formatted: 'Test Park, Wrocław, Poland',
  },
  geometry: {
    type: 'Point',
    coordinates: [17.04, 51.11],
  },
};

describe('Wishlist', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  function createService(): Wishlist {
    TestBed.configureTestingModule({});

    return TestBed.inject(Wishlist);
  }

  it('should add place to wishlist and save it to localStorage', () => {
    const service = createService();

    service.addPlace(mockPlace);

    expect(service.wishlistPlaces()).toEqual([mockPlace]);

    const savedWishlist = localStorage.getItem(storageKey);

    expect(savedWishlist).not.toBeNull();
    expect(JSON.parse(savedWishlist ?? '[]')).toEqual([mockPlace]);
  });

  it('should not add the same place twice', () => {
    const service = createService();

    service.addPlace(mockPlace);
    service.addPlace(mockPlace);

    expect(service.wishlistPlaces()).toHaveLength(1);
  });

  it('should remove place from wishlist and update localStorage', () => {
    const service = createService();

    service.addPlace(mockPlace);
    service.addPlace(anotherMockPlace);

    service.removePlace(mockPlace);

    expect(service.wishlistPlaces()).toEqual([anotherMockPlace]);

    const savedWishlist = localStorage.getItem(storageKey);

    expect(JSON.parse(savedWishlist ?? '[]')).toEqual([anotherMockPlace]);
  });

  it('should read wishlist from localStorage on initialization', () => {
    localStorage.setItem(storageKey, JSON.stringify([mockPlace]));

    const service = createService();

    expect(service.wishlistPlaces()).toEqual([mockPlace]);
  });
});
