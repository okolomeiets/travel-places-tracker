export type GeoapifyPlaceDetailsResponse = {
  type: 'FeatureCollection';
  features: GeoapifyPlaceDetailsFeature[];
};

export type GeoapifyPlaceDetailsFeature = {
  type: 'Feature';
  properties: GeoapifyPlaceDetailsProperties;
  geometry?: GeoapifyPlaceDetailsGeometry;
};

export type GeoapifyPlaceDetailsGeometry = {
  type: string;
  coordinates: unknown;
};

export type GeoapifyPlaceDetailsProperties = {
  feature_type?: string;

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

  lat?: number;
  lon?: number;

  categories?: string[];
  place_id?: string;

  website?: string;
  contact?: {
    phone?: string;
    email?: string;
  };

  opening_hours?: string;
  wheelchair?: boolean;
  internet_access?: boolean;

  datasource?: {
    sourcename?: string;
    attribution?: string;
    license?: string;
    url?: string;
    raw?: Record<string, unknown>;
  };

  [key: string]: unknown;
};
