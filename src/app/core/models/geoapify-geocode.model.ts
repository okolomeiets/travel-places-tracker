export type GeoapifyGeocodeResponse = {
  type: 'FeatureCollection';
  features: GeoapifyGeocodeFeature[];
  query: GeoapifyGeocodeQuery;
};

export type GeoapifyGeocodeFeature = {
  type: 'Feature';
  properties: GeoapifyGeocodeProperties;
  geometry: GeoapifyPointGeometry;
  bbox?: GeoapifyBoundingBox;
};

export type GeoapifyPointGeometry = {
  type: 'Point';
  coordinates: [number, number];
};

export type GeoapifyBoundingBox = [number, number, number, number];

export type GeoapifyGeocodeProperties = {
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  country_code?: string;
  lat?: number;
  lon?: number;
  place_id?: string;
};

export type GeoapifyGeocodeQuery = {
  text?: string;
  parsed?: {
    city?: string;
    expected_type?: string;
  };
};
