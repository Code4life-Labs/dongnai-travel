import React, { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from './message-feature-styles';
import { MessageFeatureProps } from './types';

// Import components con - sử dụng lazy load để cải thiện hiệu suất
const WeatherFeature = React.lazy(() => import('./features/weather-feature'));
const PlacesFeature = React.lazy(() => import('./features/places-feature'));
const MapFeature = React.lazy(() => import('./features/map-feature'));
const DirectionFeature = React.lazy(() => import('./features/direction-feature'));

// Fallback component khi đang load lazy component
const LazyLoadFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="small" color="#3498db" />
  </View>
);

/**
 * MessageFeature Component
 * 
 * Component này sẽ hiển thị các loại feature khác nhau dựa vào action
 * Mỗi loại feature sẽ được xử lý bởi một component con riêng biệt
 * 
 * @param action - loại action để xác định feature cần hiển thị
 * @param data - dữ liệu cần thiết cho feature
 */
const MessageFeature: React.FC<MessageFeatureProps> = ({ action, data = {} }) => {
  // Nếu không có action hoặc data, không hiển thị gì cả
  if (!action || !data) {
    return null;
  }

  // Xác định tiêu đề dựa trên action
  const getFeatureTitle = () => {
    switch (action) {
      case 'input.get-weather':
        return 'Thời tiết hôm nay';
      case 'input.suggest-place':
        return 'Địa điểm du lịch';
      case 'input.show-map':
        return 'Bản đồ';
      case 'input.where-am-i':
        return 'Vị trí hiện tại';
      case 'input.get-direction':
        return 'Chỉ đường';
      case 'input.create-travel-itinerary':
        return 'Lịch trình du lịch';
      default:
        return '';
    }
  };

  const title = getFeatureTitle();

  return (
    <View style={styles.container}>
      {title && <Text style={styles.featureTitle}>{title}</Text>}
      
      <React.Suspense fallback={<LazyLoadFallback />}>
        {/* Hiển thị thông tin thời tiết */}
        {action === 'input.get-weather' && data.weatherData && (
          <WeatherFeature weatherData={data.weatherData} />
        )}
        
        {/* Hiển thị danh sách địa điểm */}
        {action === 'input.suggest-place' && data.places && (
          <PlacesFeature 
            places={data.places}
            onLoadMore={data.onLoadMore}
            isLoading={data.isLoading}
          />
        )}
        
        {/* Hiển thị bản đồ */}
        {action === 'input.show-map' && data.coordinates && (
          <MapFeature 
            coordinates={data.coordinates}
            initialRegion={data.initialRegion}
          />
        )}
        
        {/* Hiển thị vị trí hiện tại */}
        {action === 'input.where-am-i' && data.myLocation && (
          <MapFeature 
            coordinates={[{
              latitude: data.myLocation.latitude,
              longitude: data.myLocation.longitude,
              name: 'Vị trí của bạn'
            }]}
            initialRegion={{
              latitude: data.myLocation.latitude,
              longitude: data.myLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
          />
        )}
        
        {/* Hiển thị chỉ đường */}
        {action === 'input.get-direction' && data.origin && data.destination && (
          <DirectionFeature
            origin={data.origin}
            destination={data.destination}
            distance={data.distance}
            duration={data.duration}
            route={data.route}
          />
        )}

        {/* Hiển thị lịch trình du lịch */}
        {action === 'input.create-travel-itinerary' && data.itinerary && (
          <View style={styles.container}>
            {data.itinerary.places && data.itinerary.places.length > 0 && (
              <PlacesFeature 
                places={data.itinerary.places}
                isLoading={false}
              />
            )}
          </View>
        )}

        {/* Có thể thêm các action khác ở đây */}
      </React.Suspense>
    </View>
  );
};

export default memo(MessageFeature); 