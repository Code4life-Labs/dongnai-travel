export type AddressComoponent = {
  shortName: string;
  longName: string;
  types: Array<string>;
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type Geometry = {
  location: Coordinate;
  viewport: {
    northeast: Coordinate;
    southwest: Coordinate;
  };
};

export type PlusCode = {
  compoundCode: string;
  globalCode: string;
};

export type PlaceContent = {
  _id: string;
  plainText: {
    vi: string;
    en: string;
  };
  formattedText: {
    vi: string;
    en: string;
  };
  speech?: {
    vi: { female: string; male: string };
    en: { female: string; male: string };
  };
  createdAt: number;
  updatedAt: number;
};

// Use for base type of place
type $Extendable = {
  _id: string;
  addressComponents: Array<AddressComoponent>;
  businessStatus: "OPERATIONAL" | "CLOSED";
  geometry: Geometry;
  phoneNumber: string;
  name: string;
  plusCode: PlusCode;
  rating: number;
  types: Array<string>;
  url: string;
  website: string;
  userRatingsTotal: number;
  isRecommended: boolean;
  favoritesTotal: number;
  visitsTotal: number;
  updatedAt: number;
  createdAt: number;
};

// The complete Place data structure (Place Document)
export type BasePlace = {
  placeId: string;
  contentId: string;
  photosId: string;
} & $Extendable;

// The actual place data structure (A data that is joined from multiple documents)
export type Place = {
  content: PlaceContent;
  photos: Array<string>;
  isLiked: boolean;
  isVisited: boolean;
} & $Extendable;
