import { DirectionModesGCP, DirectionModesORS, WeatherData } from "@/declarations.d";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Place {
  id: string;
  place_id: string;
  name: string;
  description?: string;
  address?: string;
  coordinate: Coordinate;
  rating?: number;
  user_ratings_total?: number;
  photos?: string[];
  types?: string[];
  website?: string;
  phone_number?: string;
  opening_hours?: {
    open_now?: boolean;
    periods?: any[];
    weekday_text?: string[];
  };
  reviews?: any[];
  // Thêm các trường khác tùy theo nhu cầu
}

export interface Route {
  origin: Coordinate;
  destination: Coordinate;
  waypoints?: Coordinate[];
  distance?: number;
  duration?: number;
  polyline?: string;
  steps?: RouteStep[];
  modeGCP?: DirectionModesGCP;
  modeORS?: DirectionModesORS;
}

export interface RouteInfo {
  origin: Coordinate;
  destination: Coordinate;
  distance: number;
  duration: number;
  steps: Array<{
    distance: number;
    duration: number;
    instruction: string;
    maneuver?: string;
    start_location: Coordinate;
    end_location: Coordinate;
  }>;
  polyline: string;
  mode: {
    gcp: DirectionModesGCP;
    ors: DirectionModesORS;
  };
}

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  maneuver?: string;
  start_location: Coordinate;
  end_location: Coordinate;
}

export interface Weather {
  current?: {
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: {
      description: string;
      icon: string;
    }[];
  };
  forecast?: any[];
}

export interface MapState {
  places: Place[];
  selectedPlace?: Place;
  routes: Route[];
  userLocation?: Coordinate;
  isTrackingUserLocation: boolean;
  searchText: string;
  suggestions: Place[];
  weather?: WeatherData;
  mapType: string;
  isLoading: boolean;
  nextPageToken?: string | null;
}

export interface PlaceDetailsResponse {
  result: {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    rating?: number;
    user_ratings_total?: number;
    photos?: {
      photo_reference: string;
      height: number;
      width: number;
    }[];
    opening_hours?: {
      open_now: boolean;
      periods: any[];
      weekday_text: string[];
    };
    types: string[];
    reviews?: any[];
    website?: string;
    formatted_phone_number?: string;
  };
}

export interface PlacesSearchResponse {
  results: {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    rating?: number;
    user_ratings_total?: number;
    photos?: {
      photo_reference: string;
      height: number;
      width: number;
    }[];
    types: string[];
  }[];
  next_page_token?: string;
}

export interface DirectionsResponse {
  routes: {
    legs: {
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      steps: {
        distance: {
          text: string;
          value: number;
        };
        duration: {
          text: string;
          value: number;
        };
        html_instructions: string;
        maneuver?: string;
        start_location: {
          lat: number;
          lng: number;
        };
        end_location: {
          lat: number;
          lng: number;
        };
      }[];
    }[];
    overview_polyline: {
      points: string;
    };
  }[];
} 