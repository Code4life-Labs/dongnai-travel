import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../message-feature-styles';
import { DirectionFeatureProps } from '../types';

const { width } = Dimensions.get('window');

/**
 * Component hiển thị chỉ đường 
 * Thay thế MapView bằng hình ảnh tĩnh để tránh lỗi trong development
 */
const DirectionFeature: React.FC<DirectionFeatureProps> = ({ 
  origin,
  destination,
  distance,
  duration,
  route
}) => {
  // Region mặc định dựa trên điểm đi và điểm đến
  const centerLat = (origin.latitude + destination.latitude) / 2;
  const centerLng = (origin.longitude + destination.longitude) / 2;

  // Tạo URL cho hình ảnh bản đồ tĩnh với đường đi giữa 2 điểm
  const getDirectionsMapUrl = () => {
    const origin_coord = `${origin.latitude},${origin.longitude}`;
    const dest_coord = `${destination.latitude},${destination.longitude}`;
    const center = `${centerLat},${centerLng}`;
    const markers = `markers=color:green|label:A|${origin_coord}&markers=color:red|label:B|${dest_coord}`;
    const path = `path=color:0x0000ff|weight:5|${origin_coord}|${dest_coord}`;
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=12&size=400x200&${markers}&${path}`;
  };

  return (
    <View style={styles.directionContainer}>
      {/* Header với thông tin khoảng cách và thời gian */}
      <View style={styles.row}>
        <MaterialIcons name="directions" size={22} color="#3b82f6" />
        <Text style={localStyles.boldText}>
          {distance ? `${distance} · ` : ''}
          {duration ? `${duration}` : 'Xem chỉ đường'}
        </Text>
      </View>

      {/* Hiển thị bản đồ tĩnh thay vì MapView */}
      <View style={styles.directionMapContainer}>
        <Image 
          source={{ uri: getDirectionsMapUrl() }}
          // defaultSource={require('@/assets/images/map_placeholder.png')}
          style={localStyles.mapImage}
        />
        
        {/* Hiển thị điểm đi và điểm đến giả lập */}
        <View style={localStyles.originMarker}>
          <Text style={localStyles.markerText}>A</Text>
        </View>
        <View style={localStyles.destMarker}>
          <Text style={localStyles.markerText}>B</Text>
        </View>
      </View>
      
      {/* Thông tin origin và destination */}
      <View style={localStyles.directionDetail}>
        <View style={[styles.row, localStyles.marginBottom5]}>
          <MaterialIcons name="location-on" size={18} color="green" />
          <Text style={localStyles.p5}>Từ: {origin.name || 'Vị trí của bạn'}</Text>
        </View>
        
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={18} color="red" />
          <Text style={localStyles.p5}>Đến: {destination.name || 'Điểm đến'}</Text>
        </View>
      </View>
    </View>
  );
};

// Style cục bộ cho component này
const localStyles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  p5: {
    paddingHorizontal: 5,
  },
  marginBottom5: {
    marginBottom: 5,
  },
  directionDetail: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  mapImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  originMarker: {
    position: 'absolute',
    left: '25%',
    top: '40%',
    backgroundColor: 'green',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  destMarker: {
    position: 'absolute',
    right: '25%',
    top: '40%',
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default DirectionFeature; 