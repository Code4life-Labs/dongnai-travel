/**
 * Props chung cho MessageFeature
 */
export interface MessageFeatureProps {
  action: string;
  data: any;
}

/**
 * Props cho WeatherFeature
 */
export interface WeatherFeatureProps {
  weatherData: {
    current: {
      temp: number;
      humidity: number;
      wind_speed: number;
      weather: Array<{
        icon: string;
        main: string;
        description: string;
      }>;
    };
    daily: Array<{
      dt: number;
      temp: {
        min: number;
        max: number;
      };
      weather: Array<{
        icon: string;
        main: string;
        description: string;
      }>;
    }>;
  };
}

/**
 * Props cho PlacesFeature
 */
export interface PlacesFeatureProps {
  places: Array<{
    _id: string;
    name: string;
    rating?: number;
    image?: string;
    location?: {
      coordinates: [number, number];
    };
    address?: string;
  }>;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

/**
 * Props cho MapFeature
 */
export interface MapFeatureProps {
  coordinates: Array<{
    latitude: number;
    longitude: number;
    name?: string;
  }>;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

/**
 * Props cho DirectionFeature
 */
export interface DirectionFeatureProps {
  origin: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  distance?: string;
  duration?: string;
  route?: any;
}

/**
 * Props cho ItineraryFeature
 */
export interface ItineraryFeatureProps {
  itinerary: {
    _id: string;
    name: string;
    places: Array<any>;
    startDate?: string;
    endDate?: string;
  };
}

/**
 * Props cho WebViewFeature
 */
export interface WebViewFeatureProps {
  uri: string;
  height?: number;
} 