export type GeoapifyPlacesResponse = {
  type: 'FeatureCollection';
  features: GeoapifyPlaceFeature[];
};

export type GeoapifyPlaceFeature = {
  type: 'Feature';
  properties: GeoapifyPlaceProperties;
  geometry: GeoapifyPlaceGeometry;
};

export type GeoapifyPlaceGeometry = {
  type: 'Point';
  coordinates: [number, number];
};

export type GeoapifyPlaceProperties = {
  name?: string;
  country?: string;
  country_code?: string;
  state?: string;
  city?: string;
  postcode?: string;
  suburb?: string;
  street?: string;
  housenumber?: string;
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  categories?: string[];
  details?: string[];
  datasource?: {
    sourcename?: string;
    attribution?: string;
    license?: string;
    url?: string;
    raw?: Record<string, unknown>;
  };
  distance?: number;
  place_id?: string;
};
