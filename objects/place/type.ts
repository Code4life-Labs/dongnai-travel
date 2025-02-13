type AddressComoponent = {
  shortName: string;
  longName: string;
  types: Array<string>;
};

type Coordinate = {
  lat: number;
  lng: number;
};

type Geometry = {
  location: Coordinate;
  viewport: {
    northeast: Coordinate;
    southwest: Coordinate;
  };
};

type PlusCode = {
  compoundCode: string;
  globalCode: string;
};

type BusinessStatus = {
  _id: string;
  value: string;
  name: string;
  updatedAt: number;
  createdAt: number;
};

type PlaceType = {
  _id: string;
  value: string;
  name: string;
  updatedAt: number;
  createdAt: number;
};

// Use for base type of place
type $Extendable = {
  _id: string;
  addressComponents: Array<AddressComoponent>;
  geometry: Geometry;
  phoneNumber: string;
  name: string;
  plusCode: PlusCode;
  photos: Array<string>;
  rating: number;
  url: string;
  website: string;
  userRatingsTotal: number;
  isRecommended: boolean;
  userFavoritesTotal: number;
  visitsTotal: number;
  updatedAt: number;
  createdAt: number;
};

// The complete Place data structure (Place Document)
export type BasePlace = {
  placeId: string;
  typeIds: Array<string>;
} & $Extendable;

// The actual place data structure (A data that is joined from multiple documents)
export type Place = {
  content: string;
  businessStatus: BusinessStatus;
  types: Array<PlaceType>;
  isLiked?: boolean;
  isVisited?: boolean;
  reviews?: Array<any>;
} & $Extendable;
