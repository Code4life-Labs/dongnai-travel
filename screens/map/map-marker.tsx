import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Place } from '@/objects/map/types';

interface MapMarkerProps {
  place: Place;
  isSelected: boolean;
  onPress: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ place, isSelected, onPress }) => {
  // Animation
  const scale = useRef(new Animated.Value(1)).current;
  
  // Lấy loại địa điểm đầu tiên để xác định icon
  const placeType = place.types && place.types.length > 0 ? place.types[0] : 'default';

  // Hiệu ứng khi marker được chọn
  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scale, { 
          toValue: 1.3, 
          duration: 200, 
          useNativeDriver: true 
        }),
        Animated.timing(scale, { 
          toValue: 1.1, 
          duration: 100, 
          useNativeDriver: true 
        })
      ]).start();
    } else {
      Animated.timing(scale, { 
        toValue: 1, 
        duration: 200, 
        useNativeDriver: true 
      }).start();
    }
  }, [isSelected]);

  // Xác định màu cho marker dựa trên loại địa điểm
  const getMarkerColor = () => {
    switch (placeType) {
      case 'restaurant':
      case 'food':
      case 'bakery':
        return '#FF5722';
      case 'cafe':
        return '#795548';
      case 'lodging':
      case 'hotel':
        return '#2196F3';
      case 'museum':
        return '#9C27B0';
      case 'tourist_attraction':
      case 'point_of_interest':
        return '#E91E63';
      case 'park':
      case 'natural_feature':
        return '#4CAF50';
      case 'shopping_mall':
      case 'store':
      case 'clothing_store':
        return '#FF9800';
      case 'bar':
      case 'night_club':
        return '#673AB7';
      case 'church':
      case 'place_of_worship':
        return '#9E9E9E';
      case 'spa':
      case 'beauty_salon':
        return '#F48FB1';
      case 'gym':
      case 'health':
        return '#F44336';
      case 'airport':
      case 'bus_station':
      case 'train_station':
      case 'transit_station':
        return '#03A9F4';
      case 'establishment':
      default:
        return '#607D8B';
    }
  };

  // Chọn icon dựa trên loại địa điểm
  const getMarkerIcon = () => {
    switch (placeType) {
      case 'restaurant':
      case 'food':
        return <FontAwesome5 name="utensils" size={16} color={getMarkerColor()} />;
      case 'bakery':
        return <FontAwesome5 name="bread-slice" size={16} color={getMarkerColor()} />;
      case 'cafe':
        return <FontAwesome5 name="coffee" size={16} color={getMarkerColor()} />;
      case 'lodging':
      case 'hotel':
        return <FontAwesome5 name="hotel" size={16} color={getMarkerColor()} />;
      case 'museum':
        return <FontAwesome5 name="landmark" size={16} color={getMarkerColor()} />;
      case 'tourist_attraction':
      case 'point_of_interest':
        return <MaterialCommunityIcons name="camera" size={16} color={getMarkerColor()} />;
      case 'park':
        return <FontAwesome5 name="tree" size={16} color={getMarkerColor()} />;
      case 'natural_feature':
        return <MaterialCommunityIcons name="pine-tree" size={16} color={getMarkerColor()} />;
      case 'shopping_mall':
      case 'store':
        return <FontAwesome5 name="shopping-bag" size={16} color={getMarkerColor()} />;
      case 'clothing_store':
        return <FontAwesome5 name="tshirt" size={16} color={getMarkerColor()} />;
      case 'bar':
      case 'night_club':
        return <FontAwesome5 name="glass-martini-alt" size={16} color={getMarkerColor()} />;
      case 'church':
      case 'place_of_worship':
        return <FontAwesome5 name="church" size={16} color={getMarkerColor()} />;
      case 'spa':
      case 'beauty_salon':
        return <MaterialCommunityIcons name="spa" size={16} color={getMarkerColor()} />;
      case 'gym':
      case 'health':
        return <MaterialCommunityIcons name="dumbbell" size={16} color={getMarkerColor()} />;
      case 'airport':
        return <FontAwesome5 name="plane" size={16} color={getMarkerColor()} />;
      case 'bus_station':
        return <FontAwesome5 name="bus" size={16} color={getMarkerColor()} />;
      case 'train_station':
      case 'transit_station':
        return <MaterialCommunityIcons name="train" size={16} color={getMarkerColor()} />;
      case 'establishment':
      default:
        return <MaterialIcons name="place" size={16} color={getMarkerColor()} />;
    }
  };

  return (
    <Marker
      coordinate={place.coordinate}
      title={place.name}
      description={place.address}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <Animated.View 
        style={[
          styles.markerContainer, 
          isSelected && styles.selectedMarker,
          { transform: [{ scale }] }
        ]}
      >
        {getMarkerIcon()}
      </Animated.View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarker: {
    borderColor: '#FF5722',
    backgroundColor: '#FFF9C4',
    padding: 10,
  },
});

export default MapMarker; 