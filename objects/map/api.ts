import axios from 'axios';
import { 
  DirectionModesGCP,
  DirectionModesORS,
  WeatherData
} from '@/declarations.d';
import { 
  PlaceDetailsResponse, 
  PlacesSearchResponse, 
  DirectionsResponse 
} from './types';
import { PLACE_DETAILS_FIELDS } from './constants';

// Base config cho axios
const instance = axios.create({
  timeout: 15000,
});

// API keys và URLs có thể được lấy từ .env
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY || '';

/**
 * Lấy thông tin chi tiết của một địa điểm dựa trên place_id
 */
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetailsResponse> => {
  try {
    const response = await instance.get('/api/places/details', {
      params: {
        place_id: placeId,
        fields: PLACE_DETAILS_FIELDS.join(','),
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

/**
 * Tìm kiếm địa điểm dựa trên text
 */
export const getPlacesTextSearch = async (
  query: string, 
  nextPageToken?: string
): Promise<PlacesSearchResponse> => {
  try {
    const response = await instance.get('/api/places/textsearch', {
      params: {
        query,
        pagetoken: nextPageToken,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
};

/**
 * Lấy thêm địa điểm khi người dùng scroll (dùng page token)
 */
export const getMorePlacesTextSearch = async (
  nextPageToken: string
): Promise<PlacesSearchResponse> => {
  try {
    const response = await instance.get('/api/places/textsearch', {
      params: {
        pagetoken: nextPageToken,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching more places:', error);
    throw error;
  }
};

/**
 * Lấy địa điểm theo danh mục
 */
export const getPlacesByCategory = async (
  category: string,
  location: string,
  radius: number = 5000
): Promise<PlacesSearchResponse> => {
  try {
    const response = await instance.get('/api/places/nearbysearch', {
      params: {
        type: category,
        location,
        radius,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching places by category:', error);
    throw error;
  }
};

/**
 * Lấy nhiều địa điểm theo ID
 */
export const getPlacesById = async (
  placeIds: string[]
): Promise<{ arrPlace: any[], nextPageToken?: string }> => {
  try {
    const response = await instance.post('/api/places/batch', {
      placeIds,
      fields: PLACE_DETAILS_FIELDS.join(','),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching places by ID:', error);
    throw error;
  }
};

/**
 * Lấy chỉ đường giữa hai địa điểm (Google Maps)
 */
export const getRouteDirection = async (
  origin: string,
  destination: string,
  mode: DirectionModesGCP = 'DRIVE'
): Promise<DirectionsResponse> => {
  try {
    const response = await instance.get('/api/directions/google', {
      params: {
        origin,
        destination,
        mode,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting directions from Google:', error);
    throw error;
  }
};

/**
 * Lấy chỉ đường giữa hai địa điểm (OpenRouteService)
 */
export const getRouteDirectionORS = async (
  origin: [number, number],
  destination: [number, number],
  mode: DirectionModesORS = 'driving-car'
): Promise<any> => {
  try {
    const response = await instance.get('/api/directions/ors', {
      params: {
        start: origin.join(','),
        end: destination.join(','),
        mode,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting directions from ORS:', error);
    throw error;
  }
};

/**
 * Lấy thông tin thời tiết hiện tại
 */
export const getWeatherCurrent = async (lat: number, lon: number): Promise<WeatherData['current']> => {
  try {
    const response = await instance.get('/api/weather/current', {
      params: {
        lat,
        lon,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

/**
 * Lấy dự báo thời tiết
 */
export const getWeatherForecast = async (lat: number, lon: number): Promise<WeatherData['forecast']> => {
  try {
    const response = await instance.get('/api/weather/forecast', {
      params: {
        lat,
        lon,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

/**
 * Lưu trạng thái map của người dùng
 */
export const updateMapUser = async (userId: string, mapData: any) => {
  try {
    const response = await instance.post('/api/map/user', {
      userId,
      mapData,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating map user data:', error);
    throw error;
  }
};

/**
 * Lấy trạng thái map của người dùng
 */
export const getMapUser = async (userId: string) => {
  try {
    const response = await instance.get('/api/map/user', {
      params: {
        userId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching map user data:', error);
    throw error;
  }
}; 