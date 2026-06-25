import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../../environments/environment';
import { PlacesApi } from './places-api';

describe('PlacesApi', () => {
  let service: PlacesApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PlacesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create geocode request with trimmed location', () => {
    service.geocodeLocation('  Wroclaw  ').subscribe();

    const request = httpMock.expectOne(
      (req) => req.url === 'https://api.geoapify.com/v1/geocode/search',
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('text')).toBe('Wroclaw');
    expect(request.request.params.get('limit')).toBe('1');
    expect(request.request.params.get('apiKey')).toBe(environment.apiKey);

    request.flush({
      type: 'FeatureCollection',
      features: [],
      query: {
        text: 'Wroclaw',
      },
    });
  });

  it('should create places search request by bounding box and museum category', () => {
    service.searchPlacesByBounds('museum', [16.8, 51.04, 17.17, 51.21]).subscribe();

    const request = httpMock.expectOne((req) => req.url === 'https://api.geoapify.com/v2/places');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('categories')).toBe('entertainment.museum');
    expect(request.request.params.get('filter')).toBe('rect:16.8,51.04,17.17,51.21');
    expect(request.request.params.get('limit')).toBe('20');
    expect(request.request.params.get('apiKey')).toBe(environment.apiKey);

    request.flush({
      type: 'FeatureCollection',
      features: [],
    });
  });

  it('should map cafe keyword to catering cafe category', () => {
    service.searchPlacesByBounds('coffee', [16.8, 51.04, 17.17, 51.21]).subscribe();

    const request = httpMock.expectOne((req) => req.url === 'https://api.geoapify.com/v2/places');

    expect(request.request.params.get('categories')).toBe('catering.cafe');

    request.flush({
      type: 'FeatureCollection',
      features: [],
    });
  });

  it('should create place details request by place id', () => {
    service.getPlaceDetails('test-place-id').subscribe();

    const request = httpMock.expectOne(
      (req) => req.url === 'https://api.geoapify.com/v2/place-details',
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('id')).toBe('test-place-id');
    expect(request.request.params.get('features')).toBe('details');
    expect(request.request.params.get('apiKey')).toBe(environment.apiKey);

    request.flush({
      type: 'FeatureCollection',
      features: [],
    });
  });
});
