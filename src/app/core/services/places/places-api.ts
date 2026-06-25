import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import type {
  GeoapifyBoundingBox,
  GeoapifyGeocodeResponse,
} from '../../models/geoapify-geocode.model';
import type { GeoapifyPlaceDetailsResponse } from '../../models/geoapify-place-details.model';
import type { GeoapifyPlacesResponse } from '../../models/geoapify-place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesApi {
  private readonly http = inject(HttpClient);

  private readonly geocodeUrl = 'https://api.geoapify.com/v1/geocode/search';
  private readonly placesUrl = 'https://api.geoapify.com/v2/places';
  private readonly placeDetailsUrl = 'https://api.geoapify.com/v2/place-details';

  geocodeLocation(location: string): Observable<GeoapifyGeocodeResponse> {
    const httpParams = new HttpParams()
      .set('text', location.trim())
      .set('limit', 1)
      .set('apiKey', environment.apiKey);

    return this.http.get<GeoapifyGeocodeResponse>(this.geocodeUrl, {
      params: httpParams,
    });
  }

  searchPlacesByBounds(
    keyword: string,
    bbox: GeoapifyBoundingBox,
  ): Observable<GeoapifyPlacesResponse> {
    const httpParams = new HttpParams()
      .set('categories', this.getCategoryByKeyword(keyword))
      .set('filter', `rect:${bbox.join(',')}`)
      .set('limit', 20)
      .set('apiKey', environment.apiKey);

    return this.http.get<GeoapifyPlacesResponse>(this.placesUrl, {
      params: httpParams,
    });
  }

  getPlaceDetails(placeId: string): Observable<GeoapifyPlaceDetailsResponse> {
    const httpParams = new HttpParams()
      .set('id', placeId)
      .set('features', 'details')
      .set('apiKey', environment.apiKey);

    return this.http.get<GeoapifyPlaceDetailsResponse>(this.placeDetailsUrl, {
      params: httpParams,
    });
  }

  private getCategoryByKeyword(keyword: string): string {
    const normalizedKeyword = keyword.trim().toLowerCase();

    switch (true) {
      case normalizedKeyword.includes('museum'):
        return 'entertainment.museum';

      case normalizedKeyword.includes('park'):
        return 'leisure.park';

      case normalizedKeyword.includes('coffee'):
      case normalizedKeyword.includes('cafe'):
        return 'catering.cafe';

      case normalizedKeyword.includes('restaurant'):
        return 'catering.restaurant';

      case normalizedKeyword.includes('castle'):
        return 'tourism.sights.castle';

      default:
        return 'tourism';
    }
  }
}
