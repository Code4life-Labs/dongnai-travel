import { useRef, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Coordinate, MapState, Place, PlaceDetailsResponse, PlacesSearchResponse, Route, RouteInfo } from '@/objects/map/types';
import { WeatherData, DirectionModesGCP, DirectionModesORS } from '@/declarations.d';
import { 
  getMapUser, 
  getMorePlacesTextSearch, 
  getPlaceDetails, 
  getPlacesTextSearch,
  getPlacesByCategory,
  getPlacesById,
  getRouteDirection, 
  getRouteDirectionORS,
  getWeatherCurrent, 
  getWeatherForecast, 
  updateMapUser 
} from '@/objects/map/api';
import { useAuth } from './useAuth';
import { debounce } from 'lodash';
import { Alert, Platform, Share } from 'react-native';
import { TRANSPORT_MODES, MAP_TYPES } from '@/objects/map/constants';
import { decode } from '@mapbox/polyline';

// Định nghĩa kiểu cho LocationSubscription
type LocationSubscription = { remove: () => void };

export const useMap = () => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const trackingUserLocation = useRef<LocationSubscription | null>(null);
  const bottomSheetRef = useRef<any>(null);
  const routeBottomSheetRef = useRef<any>(null);
  const weatherBottomSheetRef = useRef<any>(null);
  
  const { user } = useAuth();

  // State ban đầu của map
  const initialMapState: MapState = {
    places: [],
    selectedPlace: undefined,
    routes: [],
    userLocation: undefined,
    isTrackingUserLocation: false,
    searchText: '',
    suggestions: [],
    weather: undefined,
    mapType: 'standard',
    isLoading: false,
  };

  const [mapState, setMapState] = useState<MapState>(initialMapState);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedTransportMode, setSelectedTransportMode] = useState(TRANSPORT_MODES[0]);
  const [isOpenWeatherPanel, setIsOpenWeatherPanel] = useState<boolean>(false);
  const [isOpenPlaceDetails, setIsOpenPlaceDetails] = useState<boolean>(false);
  
  // Cập nhật state của map
  const updateMapState = (newState: Partial<MapState>) => {
    setMapState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  // Các hàm tiện ích
  const convertToCoordinate = (location: { lat: number, lng: number } | { latitude: number, longitude: number }): Coordinate => {
    if ('lat' in location && 'lng' in location) {
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    }
    return location as Coordinate;
  };
  
  // Chuyển đổi polyline string thành mảng tọa độ
  const decodePolyline = (polyline: string): Coordinate[] => {
    const points = decode(polyline);
    return points.map((point: [number, number]) => ({
      latitude: point[0],
      longitude: point[1]
    }));
  };

  // Tính toán ngày giờ từ thời lượng (giây)
  const calculateTimeFromDuration = (durationInSeconds: number) => {
    const days = Math.floor(durationInSeconds / 86400);
    const hours = Math.floor((durationInSeconds % 86400) / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    
    return { days, hours, minutes, seconds };
  };

  // Lấy vị trí hiện tại của người dùng
  const getUserLocation = async () => {
    try {
      updateMapState({ isLoading: true });
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập vị trí bị từ chối', 'Ứng dụng cần quyền truy cập vị trí để hoạt động chính xác.');
        updateMapState({ isLoading: false });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      updateMapState({ 
        userLocation,
        isLoading: false 
      });
      
      // Tự động lấy thông tin thời tiết
      getWeather(userLocation);

      return userLocation;
    } catch (error) {
      console.error('Lỗi khi lấy vị trí người dùng:', error);
      updateMapState({ isLoading: false });
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại của bạn. Vui lòng thử lại sau.');
    }
  };

  // Bắt đầu theo dõi vị trí người dùng
  const startTrackingUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập vị trí bị từ chối', 'Ứng dụng cần quyền truy cập vị trí để hoạt động chính xác.');
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (location) => {
          const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          };
          
          updateMapState({ userLocation });
          
          if (mapRef.current) {
            // @ts-ignore
            mapRef.current.animateToRegion({
              ...userLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }, 1000);
          }
        }
      );

      trackingUserLocation.current = subscription;
      updateMapState({ isTrackingUserLocation: true });
    } catch (error) {
      console.error('Lỗi khi theo dõi vị trí người dùng:', error);
      Alert.alert('Lỗi', 'Không thể theo dõi vị trí của bạn. Vui lòng thử lại sau.');
    }
  };

  // Dừng theo dõi vị trí người dùng
  const stopTrackingUserLocation = () => {
    if (trackingUserLocation.current) {
      trackingUserLocation.current.remove();
      trackingUserLocation.current = null;
      updateMapState({ isTrackingUserLocation: false });
    }
  };

  // Di chuyển map đến vị trí cụ thể
  const moveToLocation = (coordinate: Coordinate, zoom = 0.01, pitch = 0) => {
    if (mapRef.current) {
      // @ts-ignore
      mapRef.current.animateToRegion({
        ...coordinate,
        latitudeDelta: zoom,
        longitudeDelta: zoom
      }, 1000);
    }
  };

  // Fit map để hiển thị nhiều điểm
  const fitToCoordinates = (coordinates: Coordinate[], edgePadding = { top: 50, right: 50, bottom: 50, left: 50 }, animated = true) => {
    if (mapRef.current && coordinates.length > 0) {
      // @ts-ignore
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding,
        animated
      });
    }
  };

  // Lấy thông tin chi tiết của địa điểm
  const getPlaceDetailsById = async (placeId: string) => {
    try {
      updateMapState({ isLoading: true });
      const response = await getPlaceDetails(placeId);
      
      if (response && response.result) {
        const place: Place = {
          id: response.result.place_id,
          place_id: response.result.place_id,
          name: response.result.name,
          address: response.result.formatted_address,
          coordinate: convertToCoordinate(response.result.geometry.location),
          rating: response.result.rating,
          user_ratings_total: response.result.user_ratings_total,
          photos: response.result.photos?.map(photo => photo.photo_reference) || [],
          types: response.result.types,
          website: response.result.website,
          phone_number: response.result.formatted_phone_number,
          opening_hours: response.result.opening_hours,
          reviews: response.result.reviews,
        };

        updateMapState({ 
          selectedPlace: place,
          isLoading: false 
        });
        
        // Auto-open place details
        setIsOpenPlaceDetails(true);
        if (bottomSheetRef.current) {
          // @ts-ignore
          bottomSheetRef.current.present();
        }

        return place;
      }
      
      updateMapState({ isLoading: false });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết địa điểm:', error);
      updateMapState({ isLoading: false });
      Alert.alert('Lỗi', 'Không thể lấy thông tin chi tiết của địa điểm. Vui lòng thử lại sau.');
    }
  };

  // Tìm kiếm địa điểm
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      updateMapState({ suggestions: [] });
      return;
    }

    try {
      updateMapState({ isLoading: true });
      const response = await getPlacesTextSearch(query);
      
      if (response && response.results) {
        // Cập nhật nextPageToken nếu có
        if (response.next_page_token) {
          setNextPageToken(response.next_page_token);
        } else {
          setNextPageToken(null);
        }
        
        const places: Place[] = response.results.map(result => ({
          id: result.place_id,
          place_id: result.place_id,
          name: result.name,
          address: result.formatted_address,
          coordinate: convertToCoordinate(result.geometry.location),
          rating: result.rating,
          user_ratings_total: result.user_ratings_total,
          photos: result.photos?.map(photo => photo.photo_reference) || [],
          types: result.types,
        }));

        updateMapState({ 
          suggestions: places,
          isLoading: false 
        });
      } else {
        updateMapState({ 
          suggestions: [],
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm địa điểm:', error);
      updateMapState({ 
        suggestions: [],
        isLoading: false 
      });
    }
  };
  
  // Tải thêm địa điểm
  const loadMorePlaces = async () => {
    if (!nextPageToken) return;
    
    try {
      updateMapState({ isLoading: true });
      const response = await getMorePlacesTextSearch(nextPageToken);
      
      if (response && response.results) {
        if (response.next_page_token) {
          setNextPageToken(response.next_page_token);
        } else {
          setNextPageToken(null);
        }
        
        const newPlaces: Place[] = response.results.map(result => ({
          id: result.place_id,
          place_id: result.place_id,
          name: result.name,
          address: result.formatted_address,
          coordinate: convertToCoordinate(result.geometry.location),
          rating: result.rating,
          user_ratings_total: result.user_ratings_total,
          photos: result.photos?.map(photo => photo.photo_reference) || [],
          types: result.types,
        }));
        
        // Kết hợp với danh sách places hiện tại
        updateMapState({
          places: [...mapState.places, ...newPlaces],
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải thêm địa điểm:', error);
      updateMapState({ isLoading: false });
    }
  };
  
  // Tìm kiếm địa điểm theo danh mục
  const searchPlacesByCategory = async (category: string) => {
    if (!mapState.userLocation) {
      Alert.alert('Thông báo', 'Cần vị trí người dùng để tìm kiếm xung quanh. Vui lòng bật vị trí của bạn.');
      return;
    }
    
    setSelectedCategory(category);
    updateMapState({ isLoading: true });
    
    try {
      const locationStr = `${mapState.userLocation.latitude},${mapState.userLocation.longitude}`;
      const response = await getPlacesByCategory(category, locationStr);
      
      if (response && response.results) {
        const places: Place[] = response.results.map(result => ({
          id: result.place_id,
          place_id: result.place_id,
          name: result.name,
          address: result.formatted_address,
          coordinate: convertToCoordinate(result.geometry.location),
          rating: result.rating,
          user_ratings_total: result.user_ratings_total,
          photos: result.photos?.map(photo => photo.photo_reference) || [],
          types: result.types,
        }));
        
        updateMapState({
          places: places,
          isLoading: false
        });
        
        // Fit map to show all nearby places
        if (places.length > 0) {
          const coordinates = [
            mapState.userLocation,
            ...places.map(place => place.coordinate)
          ];
          fitToCoordinates(coordinates);
        }
      } else {
        updateMapState({
          places: [],
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm địa điểm theo danh mục:', error);
      updateMapState({ isLoading: false });
    }
  };

  // Debounce search để tránh gọi API quá nhiều
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      searchPlaces(text);
    }, 500),
    []
  );

  // Xử lý khi người dùng nhập text tìm kiếm
  const handleSearchTextChange = (text: string) => {
    updateMapState({ searchText: text });
    debouncedSearch(text);
  };

  // Lấy chỉ đường
  const getDirections = async (origin: Coordinate, destination: Coordinate, transportMode: string = 'DRIVE') => {
    try {
      updateMapState({ isLoading: true });
      
      // Tìm transport mode từ danh sách
      const selectedMode = TRANSPORT_MODES.find(mode => mode.gcp === transportMode) || TRANSPORT_MODES[0];
      setSelectedTransportMode(selectedMode);
      
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;
      
      // Gọi API google directions
      const response = await getRouteDirection(originStr, destinationStr, selectedMode.gcp);
      
      if (response && response.routes && response.routes.length > 0) {
        const route = response.routes[0];
        const leg = route.legs[0];
        
        const newRoute: Route = {
          origin,
          destination,
          distance: leg.distance.value,
          duration: leg.duration.value,
          polyline: route.overview_polyline.points,
          steps: leg.steps.map(step => ({
            distance: step.distance.value,
            duration: step.duration.value,
            instruction: step.html_instructions,
            maneuver: step.maneuver,
            start_location: convertToCoordinate(step.start_location),
            end_location: convertToCoordinate(step.end_location),
          })),
          modeGCP: selectedMode.gcp,
          modeORS: selectedMode.ors,
        };

        updateMapState({ 
          routes: [newRoute],
          isLoading: false 
        });
        
        // Hiển thị panel chỉ đường
        setShowDirections(true);
        if (routeBottomSheetRef.current) {
          // @ts-ignore
          setTimeout(() => {
            routeBottomSheetRef.current?.present?.();
          }, 0);
        }

        // Fit map để hiển thị toàn bộ route
        const coordinates = decodePolyline(route.overview_polyline.points);
        fitToCoordinates(coordinates);

        return newRoute;
      }
      
      updateMapState({ isLoading: false });
    } catch (error) {
      console.error('Lỗi khi lấy chỉ đường:', error);
      updateMapState({ isLoading: false });
      Alert.alert('Lỗi', 'Không thể lấy chỉ đường. Vui lòng thử lại sau.');
    }
  };
  
  // Đóng bảng thông tin chỉ đường
  const closeDirections = () => {
    setShowDirections(false);
    updateMapState({ routes: [] });
  };
  
  // Thay đổi phương tiện di chuyển
  const changeTransportMode = (modeId: string) => {
    const selectedMode = TRANSPORT_MODES.find(mode => mode.id === modeId);
    if (selectedMode && mapState.routes.length > 0 && mapState.routes[0].origin && mapState.routes[0].destination) {
      getDirections(mapState.routes[0].origin, mapState.routes[0].destination, selectedMode.gcp);
    }
  };

  // Lấy thông tin thời tiết
  const getWeather = async (coordinate: Coordinate) => {
    try {
      const currentWeather = await getWeatherCurrent(coordinate.latitude, coordinate.longitude);
      const forecastWeather = await getWeatherForecast(coordinate.latitude, coordinate.longitude);
      
      const weatherData = {
        current: currentWeather,
        forecast: forecastWeather
      };
      
      setWeatherData(weatherData);
      updateMapState({
        weather: weatherData
      });
      
      return weatherData;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thời tiết:', error);
    }
  };
  
  // Mở bảng thông tin thời tiết
  const openWeatherPanel = () => {
    if (mapState.userLocation) {
      setIsOpenWeatherPanel(true);
      if (weatherBottomSheetRef.current) {
        // @ts-ignore
        setTimeout(() => {
          weatherBottomSheetRef.current?.present?.();
        }, 0);
      }
    } else {
      Alert.alert('Thông báo', 'Cần vị trí người dùng để xem thông tin thời tiết.');
      getUserLocation();
    }
  };
  
  // Đóng bảng thông tin thời tiết
  const closeWeatherPanel = () => {
    setIsOpenWeatherPanel(false);
  };

  // Thay đổi loại bản đồ
  const changeMapType = (mapType: string) => {
    updateMapState({ mapType });
  };
  
  // Chia sẻ địa điểm
  const sharePlace = async (place: Place) => {
    try {
      const message = `${place.name}\n${place.address}\nhttps://maps.google.com/?q=${place.coordinate.latitude},${place.coordinate.longitude}`;
      
      await Share.share({
        message,
        title: place.name,
      });
    } catch (error) {
      console.error('Lỗi khi chia sẻ địa điểm:', error);
    }
  };

  // Lưu trạng thái map của người dùng
  const saveMapState = async () => {
    if (user) {
      try {
        // Sử dụng user._id thay vì user.id
        await updateMapUser(user._id as string, {
          selectedPlace: mapState.selectedPlace,
          routes: mapState.routes,
          userLocation: mapState.userLocation,
          mapType: mapState.mapType
        });
      } catch (error) {
        console.error('Lỗi khi lưu trạng thái map:', error);
      }
    }
  };

  // Lấy trạng thái map đã lưu của người dùng
  const loadSavedMapState = async () => {
    if (user) {
      try {
        // Sử dụng user._id thay vì user.id
        const response = await getMapUser(user._id as string);
        
        if (response && response.mapData) {
          updateMapState(response.mapData);
        }
      } catch (error) {
        console.error('Lỗi khi lấy trạng thái map đã lưu:', error);
      }
    }
  };

  // Effect để lấy vị trí người dùng khi component mount
  useEffect(() => {
    getUserLocation();

    return () => {
      if (trackingUserLocation.current) {
        trackingUserLocation.current.remove();
      }
    };
  }, []);

  // Effect để lấy trạng thái map đã lưu khi user thay đổi
  useEffect(() => {
    if (user) {
      loadSavedMapState();
    }
  }, [user]);

  return {
    mapRef,
    searchInputRef,
    bottomSheetRef,
    routeBottomSheetRef,
    weatherBottomSheetRef,
    mapState,
    updateMapState,
    nearbyPlaces,
    selectedCategory,
    showDirections,
    weatherData,
    selectedTransportMode,
    isOpenWeatherPanel,
    isOpenPlaceDetails,
    nextPageToken,
    getUserLocation,
    startTrackingUserLocation,
    stopTrackingUserLocation,
    moveToLocation,
    fitToCoordinates,
    getPlaceDetailsById,
    searchPlaces,
    loadMorePlaces,
    searchPlacesByCategory,
    handleSearchTextChange,
    getDirections,
    closeDirections,
    changeTransportMode,
    getWeather,
    openWeatherPanel,
    closeWeatherPanel,
    changeMapType,
    sharePlace,
    saveMapState,
    loadSavedMapState,
    setIsOpenPlaceDetails,
    decodePolyline,
    calculateTimeFromDuration,
    TRANSPORT_MODES,
    MAP_TYPES,
  };
};
