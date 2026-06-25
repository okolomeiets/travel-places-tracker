import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { GeoapifyPlaceFeature } from '../../../../core/models/geoapify-place.model';

@Component({
  selector: 'app-place-card',
  imports: [RouterLink],
  templateUrl: './place-card.html',
  styleUrl: './place-card.scss',
})
export class PlaceCard {
  place = input.required<GeoapifyPlaceFeature>();
  isSaved = input(false);
  isWishlistCard = input(false);

  addToWishlist = output<GeoapifyPlaceFeature>();
  removeFromWishlist = output<GeoapifyPlaceFeature>();

  getPlaceId(): string | null {
    return this.place().properties.place_id || null;
  }

  onButtonClick(): void {
    if (this.isWishlistCard()) {
      this.removeFromWishlist.emit(this.place());
      return;
    }

    if (this.isSaved()) {
      return;
    }

    this.addToWishlist.emit(this.place());
  }
}
