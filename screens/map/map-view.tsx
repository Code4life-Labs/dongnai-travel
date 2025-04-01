import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import MapView, { 
  Marker, 
  Polyline, 
  PROVIDER_GOOGLE, 
  Region, 
  MapViewProps 
} from 'react-native-maps';
import { Coordinate, Place, Route } from '@/objects/map/types';
import MapMarker from './map-marker';
import { decode } from '@mapbox/polyline';

interface MapViewComponentProps extends MapViewProps {
  places: Place[];
  selectedPlace?: Place;
  routes: Route[];
  userLocation?: Coordinate;
  mapType: string;
  onMarkerPress: (place: Place) => void;
  onMapPress: () => void;
  initialRegion?: Region;
}

export interface MapViewRef {
  animateToRegion: (region: Region, duration: number) => void;
  fitToCoordinates: (
    coordinates: Coordinate[],
    options: { edgePadding: { top: number; right: number; bottom: number; left: number }; animated: boolean }
  ) => void;
}

const MapViewComponent = forwardRef<MapViewRef, MapViewComponentProps>(
  (
    {
      places,
      selectedPlace,
      routes,
      userLocation,
      mapType,
      onMarkerPress,
      onMapPress,
      initialRegion,
      ...rest
    },
    ref
  ) => {
    const mapRef = useRef<MapView>(null);

    // Chuyển đổi polyline thành array toạ độ
    const getPolylineCoordinates = (polyline: string): Coordinate[] => {
      const points = decode(polyline);
      return points.map((point: [number, number]) => ({
        latitude: point[0],
        longitude: point[1],
      }));
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      animateToRegion: (region: Region, duration: number) => {
        mapRef.current?.animateToRegion(region, duration);
      },
      fitToCoordinates: (
        coordinates: Coordinate[],
        options: { edgePadding: { top: number; right: number; bottom: number; left: number }; animated: boolean }
      ) => {
        mapRef.current?.fitToCoordinates(coordinates, options);
      },
    }));

    // Map provider based on platform
    const provider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={provider}
          mapType={mapType as 'standard' | 'satellite' | 'hybrid' | 'terrain'}
          initialRegion={initialRegion || {
            latitude: 10.762622,
            longitude: 106.660172,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsTraffic={false}
          zoomEnabled={true}
          zoomControlEnabled={true}
          onPress={onMapPress}
          {...rest}
        >
          {/* Render user location marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Vị trí của bạn"
              pinColor="blue"
            />
          )}

          {/* Render place markers */}
          {places.map((place) => (
            <MapMarker
              key={place.id}
              place={place}
              isSelected={selectedPlace?.id === place.id}
              onPress={() => onMarkerPress(place)}
            />
          ))}

          {/* Render routes */}
          {routes.map((route, index) => {
            // Nếu có polyline, sử dụng nó, ngược lại dùng origin và destination
            const coordinates = route.polyline 
              ? getPolylineCoordinates(route.polyline)
              : [route.origin, route.destination];
              
            return (
              <Polyline
                key={`route-${index}`}
                coordinates={coordinates}
                strokeWidth={4}
                strokeColor="#FF5722"
                lineJoin="round"
                geodesic={true}
                tappable={true}
                lineCap="round"
              />
            );
          })}
        </MapView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapViewComponent; 