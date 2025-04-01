import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles as commonStyles } from '../message-feature-styles';
import { MapFeatureProps } from '../types';

const { width } = Dimensions.get('window');

/**
 * Component hiển thị bản đồ
 * Sử dụng hình ảnh tĩnh thay vì MapView để tránh lỗi trong development
 */
const MapFeature: React.FC<MapFeatureProps> = ({ 
  coordinates,
  initialRegion
}) => {
  // Sử dụng hình ảnh tĩnh của bản đồ thay vì MapView thật
  // để tránh các vấn đề liên quan đến MapView trong môi trường development
  
  // Chọn địa điểm đầu tiên trong danh sách làm center (nếu có)
  const centerLocation = coordinates?.length > 0 
    ? coordinates[0]
    : initialRegion || { latitude: 10.9454, longitude: 106.8423 }; // Mặc định là Biên Hòa
    
  // Tạo URL cho hình ảnh bản đồ tĩnh từ Google Maps
  const getStaticMapUrl = () => {
    const apiKey = ""; // Để trống vì chỉ sử dụng mockup
    const center = `${centerLocation.latitude},${centerLocation.longitude}`;
    const zoom = 13;
    const size = `${width * 0.9}x180`;
    const markers = coordinates.map(coord => 
      `markers=color:red|${coord.latitude},${coord.longitude}`
    ).join('&');
    
    // URL mẫu cho Google Maps Static API
    // Trong thực tế có thể sử dụng API key thật, hiện tại chỉ dùng cho mockup
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&${markers}&key=${apiKey}`;
  };

  // Tạo URL thay thế khi không có API key
  const getPlaceholderMapUrl = () => {
    return 'https://maps.googleapis.com/maps/api/staticmap?center=10.9454,106.8423&zoom=13&size=400x180&markers=color:red|10.9454,106.8423&key=';
  };

  // Xử lý khi nhấn vào nút chỉ đường
  const handleGetDirections = () => {
    console.log('Get directions');
  };

  // Xử lý khi nhấn vào nút hiển thị toàn bộ marker
  const handleShowAll = () => {
    console.log('Show all markers');
  };

  return (
    <View style={commonStyles.mapContainer}>
      {/* Hình ảnh bản đồ tĩnh thay vì MapView */}
      <View style={styles.staticMapContainer}>
        <Image
          source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=10.9454,106.8423&zoom=13&size=400x180&markers=color:red|10.9454,106.8423' }}
          style={styles.staticMapImage}
          // defaultSource={require('@/assets/images/map_placeholder.png')}
        />
        
        {/* Thêm markers giả */}
        {coordinates.length > 0 && coordinates.map((coord, index) => (
          <View 
            key={index} 
            style={[
              styles.markerOverlay,
              {
                left: `${Math.random() * 80 + 10}%`, 
                top: `${Math.random() * 70 + 15}%`
              }
            ]}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
            {coord.name && (
              <View style={styles.markerLabelContainer}>
                <Text style={styles.markerLabel}>{coord.name}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
      
      {/* Các nút tương tác */}
      <View style={styles.mapControlsContainer}>
        {coordinates.length > 1 && (
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={handleShowAll}
          >
            <Ionicons name="location" size={20} color="#3b82f6" />
            <Text style={styles.buttonLabel}>Xem tất cả</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={handleGetDirections}
        >
          <Ionicons name="navigate" size={20} color="#3b82f6" />
          <Text style={styles.buttonLabel}>Chỉ đường</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles cục bộ cho component này
const styles = StyleSheet.create({
  mapControlsContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'column',
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 100,
  },
  mapButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    flexDirection: 'row',
  },
  buttonLabel: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
    fontWeight: '500',
  },
  staticMapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  staticMapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  markerOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markerLabelContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  markerLabel: {
    fontSize: 10,
    color: '#333',
  }
});

export default MapFeature; 