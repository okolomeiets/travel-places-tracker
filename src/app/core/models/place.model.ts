export type PlaceCategory = {
  id: number;
  name: string;
};

export type PlacePhoto = {
  id: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
};

export type PlaceLocation = {
  formattedAddress?: string;
  address?: string;
  locality?: string;
  country?: string;
};

export type Place = {
  id: string;
  name: string;
  categories: PlaceCategory[];
  location: PlaceLocation;
  rating?: number;
  photos?: PlacePhoto[];
};
