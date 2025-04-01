import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  StatusBar, 
  Alert, 
  ActivityIndicator, 
  Share,
  FlatList,
  ScrollView,
  Animated,
  Pressable,
  Image,
  Platform,
  Dimensions,
  LayoutAnimation
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BottomSheetModal as BSModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { debounce } from 'lodash';
import moment from 'moment';

// Components 
import { 
  MapViewComponent, 
  SearchBar, 
  PlaceDetail, 
  RouteDetail, 
  WeatherPanel, 
  ControlPanel,
  FavoritePlaces
} from '@/screens/map';
import type { MapViewRef } from '@/screens/map/map-view';
import type { SearchBarRef } from '@/screens/map/search-bar';
import { useTheme } from '@/hooks/useTheme';
import { useMap } from '@/hooks/useMap';

// Types
import { Coordinate, Place } from '@/objects/map/types';
import { TRANSPORT_MODES, MAP_TYPES, PLACE_TYPES, WEATHER_ICONS } from '@/objects/map/constants';
// Using require for animation to avoid path resolution issues
const { dropDownAnimation } = require('@/animations/dropDownAnimation');
import ImageModal from 'react-native-image-modal';

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = 240;
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const SPACING_FOR_CARD_INSET = SCREEN_WIDTH * 0.1 - 10;

// Dùng tên khác để tránh xung đột
const BottomSheetModal = BSModal as any;

export default function MapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Refs
  const mapViewRef = useRef<MapViewRef>(null);
  const searchBarRef = useRef<SearchBarRef>(null);
  const filterBottomSheetRef = useRef<any>(null);
  const mapTypeBottomSheetRef = useRef<any>(null);
  const favoritesBottomSheetRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Bottom sheet snapPoints
  const snapPoints = ['25%', '50%', '75%'];

  // Animation refs
  const animationDropdown = useRef(new Animated.Value(0)).current;
  
  // Map hooks
  const {
    mapState,
    updateMapState,
    getUserLocation,
    moveToLocation,
    getPlaceDetailsById,
    handleSearchTextChange,
    getDirections,
    closeDirections,
    sharePlace,
    stopTrackingUserLocation,
    startTrackingUserLocation,
    searchPlaces,
    loadMorePlaces,
    searchPlacesByCategory,
    fitToCoordinates,
    bottomSheetRef,
    routeBottomSheetRef,
    weatherBottomSheetRef,
    getWeather,
    openWeatherPanel,
    changeMapType,
    changeTransportMode,
  } = useMap();

  // Local state
  const [isToggleOpenHours, setIsToggleOpenHours] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isShowFilterBottomSheet, setIsShowFilterBottomSheet] = useState(false);
  const [isShowMapTypeBottomSheet, setIsShowMapTypeBottomSheet] = useState(false);
  const [isShowFavoritesBottomSheet, setIsShowFavoritesBottomSheet] = useState(false);
  const [isShowScrollCardPlace, setIsShowScrollCardPlace] = useState(false);
  const [isRefreshingCards, setIsRefreshingCards] = useState(false);
  const [previousScrollY, setPreviousScrollY] = useState(0);

  // Xử lý khi component mount
  useEffect(() => {
    getUserLocation();
    
    return () => {
      stopTrackingUserLocation();
    };
  }, []);

  // Xử lý route params
  useEffect(() => {
    if (params.place_id) {
      getPlaceDetailsById(params.place_id as string);
    } else if (params.array_place_id) {
      try {
        const placeIds = JSON.parse(params.array_place_id as string);
        if (Array.isArray(placeIds) && placeIds.length > 0) {
          // Logic xử lý array_place_id sẽ được thêm vào useMap hook
        }
      } catch (e) {
        console.error('Error parsing array_place_id:', e);
      }
    }
  }, [params]);

  // Xử lý hiệu ứng dropdown cho bảng giờ mở cửa
  const handleToggleOpenHoursAnimation = () => {
    const config = {
      duration: 500,
      toValue: isToggleOpenHours ? 0 : 1,
      useNativeDriver: true
    };
    Animated.timing(animationDropdown, config).start();
    LayoutAnimation.configureNext(dropDownAnimation);
    setIsToggleOpenHours(!isToggleOpenHours);
  };

  // Chuyển đổi icon theo góc xoay
  const arrowTransform = animationDropdown.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg']
  });

  // Xử lý khi nhấn vào marker
  const handleMarkerPress = (place: Place) => {
    updateMapState({ selectedPlace: place });
    if (bottomSheetRef.current) {
      setTimeout(() => {
        bottomSheetRef.current?.present?.();
      }, 0);
    }
  };
  
  // Xử lý khi nhấn vào bản đồ
  const handleMapPress = () => {
    searchBarRef.current?.blur();
  };
  
  // Xử lý khi chọn địa điểm từ suggestions
  const handlePlaceSelect = (place: Place) => {
    updateMapState({ searchText: place.name });
    moveToLocation(place.coordinate);
    getPlaceDetailsById(place.place_id);
  };
  
  // Xử lý lấy chỉ đường
  const handleGetDirections = () => {
    if (mapState.userLocation && mapState.selectedPlace) {
      getDirections(
        mapState.userLocation,
        mapState.selectedPlace.coordinate,
        'DRIVE'
      );
    } else {
      Alert.alert(
        'Không thể lấy chỉ đường',
        'Vui lòng bật vị trí của bạn để lấy chỉ đường'
      );
    }
  };
  
  // Xử lý chia sẻ địa điểm
  const handleSharePlace = async () => {
    if (mapState.selectedPlace) {
      await sharePlace(mapState.selectedPlace);
    }
  };
  
  // Di chuyển đến vị trí người dùng
  const handleGoToUserLocation = () => {
    if (mapState.userLocation) {
      moveToLocation(mapState.userLocation);
    } else {
      getUserLocation().then((location) => {
        if (location) {
          moveToLocation(location);
        }
      });
    }
  };
  
  // Bật/tắt theo dõi vị trí
  const handleToggleLocationTracking = () => {
    if (mapState.isTrackingUserLocation) {
      stopTrackingUserLocation();
    } else {
      startTrackingUserLocation();
    }
  };
  
  // Thay đổi loại bản đồ
  const handleOpenMapTypeBottomSheet = () => {
    setIsShowMapTypeBottomSheet(true);
    mapTypeBottomSheetRef.current?.present();
  };

  // Xử lý khi thay đổi loại bản đồ
  const handleChangeMapType = (mapTypeId: string) => {
    changeMapType(mapTypeId);
    mapTypeBottomSheetRef.current?.close();
  };

  // Xử lý khi mở danh sách yêu thích
  const handleOpenFavorites = () => {
    setIsShowFavoritesBottomSheet(true);
    favoritesBottomSheetRef.current?.present();
  };

  // Xử lý khi chọn một địa điểm yêu thích
  const handleFavoritePlaceSelect = (place: Place) => {
    updateMapState({ selectedPlace: place });
    moveToLocation(place.coordinate);
    favoritesBottomSheetRef.current?.close();
    bottomSheetRef.current?.present?.();
  };

  // Xử lý khi chọn danh mục
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (mapState.userLocation) {
      searchPlacesByCategory(categoryId);
    }
  };

  // Xử lý tải thêm card khi scroll
  const handleLoadMorePlaces = () => {
    if (mapState.places.length > 0 && mapState.nextPageToken) {
      setIsRefreshingCards(true);
      loadMorePlaces().finally(() => {
        setIsRefreshingCards(false);
      });
    }
  };

  // Render danh sách card địa điểm
  const renderScrollCards = () => {
    if (!isShowScrollCardPlace || mapState.places.length === 0) return null;

    return (
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
        }}
        style={styles.cardScrollView}
        onScroll={(event) => {
          const scrollX = event.nativeEvent.contentOffset.x;
          // Handle scroll logic here if needed
        }}
        onScrollEndDrag={(event) => {
          // Handle end drag for loadMore
          const currentY = event.nativeEvent.contentOffset.x;
          if (currentY > previousScrollY && currentY > (mapState.places.length - 3) * (CARD_WIDTH + 20)) {
            handleLoadMorePlaces();
          }
          setPreviousScrollY(currentY);
        }}
      >
        {mapState.places.map((place, index) => (
          <View style={styles.card} key={`place-${place.id}-${index}`}>
            {place.photos && place.photos.length > 0 ? (
              <Image
                source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0]}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}` }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.cardNoImage}>
                <Text style={styles.noImageText}>Không có hình ảnh</Text>
              </View>
            )}
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={[styles.cardTitle, { color: theme.text }]}>
                {place.name}
              </Text>
              {place.rating !== undefined && (
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome
                      key={`star-${star}`}
                      name={place.rating && place.rating >= star 
                        ? 'star' 
                        : place.rating && place.rating >= star - 0.5 
                          ? 'star-half-o' 
                          : 'star-o'}
                      size={14}
                      color="#FFBB3C"
                      style={{ marginRight: 3 }}
                    />
                  ))}
                  <Text style={[styles.ratingText, { color: theme.textLight }]}>
                    {place.rating} ({place.user_ratings_total})
                  </Text>
                </View>
              )}
              <Text numberOfLines={2} style={[styles.cardDescription, { color: theme.textLight }]}>
                {place.address}
              </Text>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => getPlaceDetailsById(place.place_id)}
                  style={styles.placeButton}
                >
                  <Text style={styles.buttonText}>Tổng quan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (mapState.userLocation) {
                      getDirections(
                        mapState.userLocation,
                        place.coordinate,
                        'DRIVE'
                      );
                    }
                  }}
                  style={styles.placeButton}
                >
                  <Text style={styles.buttonText}>Đường đi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {isRefreshingCards && (
          <View style={styles.refreshContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
          </View>
        )}
      </Animated.ScrollView>
    );
  };

  // Render danh sách danh mục
  const renderCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {PLACE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.categoryItem,
              selectedCategory === type.id && { backgroundColor: type.color },
            ]}
            onPress={() => handleCategorySelect(type.id)}
          >
            <FontAwesome5
              name={type.icon}
              size={16}
              color={selectedCategory === type.id ? '#fff' : type.color}
            />
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === type.id ? '#fff' : theme.text },
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <StatusBar barStyle="dark-content" />
          
          {/* Map View */}
          <MapViewComponent
            ref={mapViewRef}
            places={mapState.places}
            selectedPlace={mapState.selectedPlace}
            routes={mapState.routes}
            userLocation={mapState.userLocation}
            mapType={mapState.mapType}
            onMarkerPress={handleMarkerPress}
            onMapPress={handleMapPress}
          />
          
          {/* Search Bar */}
          <SearchBar
            ref={searchBarRef}
            value={mapState.searchText}
            onChangeText={handleSearchTextChange}
            onClear={() => updateMapState({ searchText: '', suggestions: [] })}
            onPlaceSelect={handlePlaceSelect}
            suggestions={mapState.suggestions}
          />

          {/* Categories List */}
          <View style={[styles.categoriesWrapper, { top: 60 + insets.top }]}>
            {renderCategories()}
          </View>
          
          {/* Control Panel */}
          <ControlPanel
            isTrackingUserLocation={mapState.isTrackingUserLocation}
            onGoToUserLocation={handleGoToUserLocation}
            onToggleLocationTracking={handleToggleLocationTracking}
            onChangeMapType={handleOpenMapTypeBottomSheet}
            onOpenWeather={() => {
              if (mapState.userLocation) {
                getWeather(mapState.userLocation);
                openWeatherPanel();
              }
            }}
            onOpenFilter={() => {
              setIsShowFilterBottomSheet(true);
              filterBottomSheetRef.current?.present();
            }}
            onOpenFavorites={handleOpenFavorites}
            mapType={mapState.mapType}
          />
          
          {/* Scrollable Place Cards */}
          {renderScrollCards()}
          
          {/* Bottom Sheet cho chi tiết địa điểm */}
          <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            enableOverDrag={true}
            handleIndicatorStyle={{ backgroundColor: theme.border }}
            backgroundStyle={{ backgroundColor: theme.card }}
          >
            {mapState.selectedPlace && (
              <PlaceDetail
                place={mapState.selectedPlace}
                onGetDirections={handleGetDirections}
                onShare={handleSharePlace}
                onClose={() => bottomSheetRef.current?.close()}
                onToggleOpenHours={handleToggleOpenHoursAnimation}
                isToggleOpenHours={isToggleOpenHours}
                arrowTransform={arrowTransform}
              />
            )}
          </BottomSheetModal>
          
          {/* Bottom Sheet cho chỉ đường */}
          <BottomSheetModal
            ref={routeBottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            enableOverDrag={true}
            handleIndicatorStyle={{ backgroundColor: theme.border }}
            backgroundStyle={{ backgroundColor: theme.card }}
          >
            <RouteDetail
              route={mapState.routes[0] as any}
              onChangeMode={(modeId) => changeTransportMode(modeId)}
              onClose={() => {
                closeDirections();
                routeBottomSheetRef.current?.close();
              }}
            />
          </BottomSheetModal>
          
          {/* Bottom Sheet cho thời tiết */}
          <BottomSheetModal
            ref={weatherBottomSheetRef}
            index={0}
            snapPoints={['40%', '70%']}
            enablePanDownToClose={true}
            enableOverDrag={true}
            handleIndicatorStyle={{ backgroundColor: theme.border }}
            backgroundStyle={{ backgroundColor: theme.card }}
          >
            <WeatherPanel
              weather={mapState.weather}
              onClose={() => weatherBottomSheetRef.current?.close()}
            />
          </BottomSheetModal>

          {/* Bottom Sheet cho bộ lọc */}
          <BottomSheetModal
            ref={filterBottomSheetRef}
            index={0}
            snapPoints={['40%']}
            enablePanDownToClose={true}
            enableOverDrag={true}
            handleIndicatorStyle={{ backgroundColor: theme.border }}
            backgroundStyle={{ backgroundColor: theme.card }}
          >
            <View style={styles.filterContainer}>
              <Text style={[styles.filterTitle, { color: theme.text }]}>Bộ lọc</Text>
              {/* Thêm các tùy chọn lọc ở đây */}
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => filterBottomSheetRef.current?.close()}
              >
                <Text style={styles.applyButtonText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetModal>

          {/* Bottom Sheet cho loại bản đồ */}
          <BottomSheetModal
            ref={mapTypeBottomSheetRef}
            index={0}
            snapPoints={['30%']}
            enablePanDownToClose={true}
            enableOverDrag={true}
            handleIndicatorStyle={{ backgroundColor: theme.border }}
            backgroundStyle={{ backgroundColor: theme.card }}
          >
            <View style={styles.mapTypeContainer}>
              <Text style={[styles.mapTypeTitle, { color: theme.text }]}>Loại bản đồ</Text>
              {MAP_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.mapTypeItem,
                    mapState.mapType === type.id && styles.mapTypeItemSelected
                  ]}
                  onPress={() => handleChangeMapType(type.id)}
                >
                  <Text 
                    style={[
                      styles.mapTypeText,
                      { color: mapState.mapType === type.id ? '#fff' : theme.text }
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </BottomSheetModal>
          
          {/* Loading Indicator */}
          {mapState.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          )}

          {/* Bottom Sheet cho danh sách yêu thích */}
          <BottomSheetModal
            ref={favoritesBottomSheetRef}
            index={0}
            snapPoints={['70%']}
            enablePanDownToClose={true}
            enableOverDrag={true}
            handleIndicatorStyle={{ backgroundColor: theme.border }}
            backgroundStyle={{ backgroundColor: theme.card }}
          >
            <FavoritePlaces
              onClose={() => favoritesBottomSheetRef.current?.close()}
              onPlaceSelect={handleFavoritePlaceSelect}
            />
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  categoriesWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  cardScrollView: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  refreshContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17.5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: CARD_HEIGHT / 2 - 17.5,
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 135,
    alignSelf: 'center',
  },
  cardNoImage: {
    width: '100%',
    height: 135,
    alignSelf: 'center',
    backgroundColor: '#f3f3f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#999',
    fontWeight: 'bold',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  cardDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 12,
  },
  filterContainer: {
    padding: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: '#FF5722',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  mapTypeContainer: {
    padding: 16,
  },
  mapTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mapTypeItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  mapTypeItemSelected: {
    backgroundColor: '#FF5722',
  },
  mapTypeText: {
    fontWeight: '500',
  },
});
