import { Routes } from '@angular/router';

import { PlacesPage } from './features/places/pages/places-page/places-page';
import { PlaceDetailsPage } from './features/places/pages/place-details-page/place-details-page';

export const routes: Routes = [
  {
    path: '',
    component: PlacesPage,
  },
  {
    path: 'places/:placeId',
    component: PlaceDetailsPage,
  },
];
