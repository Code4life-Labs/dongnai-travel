import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Share,
  Platform,
  Animated,
  Linking,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '@/hooks/useTheme';
import { RouteInfo } from '@/objects/map/types';
import { MANEUVER_DATA, TRANSPORT_MODES } from '@/objects/map/constants';

const { width } = Dimensions.get('window');

// Kích hoạt LayoutAnimation cho Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TransportModeButtonProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

const TransportModeButton: React.FC<TransportModeButtonProps> = ({ 
  id, 
  label, 
  icon, 
  isSelected, 
  onPress 
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.transportButton,
        isSelected && { backgroundColor: theme.primary + '20' }
      ]} 
      onPress={onPress}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={isSelected ? theme.primary : theme.text} 
      />
      <Text 
        style={[
          styles.transportButtonText,
          { color: isSelected ? theme.primary : theme.textLight }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface RouteDetailProps {
  route?: RouteInfo;
  onChangeMode: (modeId: string) => void;
  onClose: () => void;
}

const RouteDetail: React.FC<RouteDetailProps> = ({ 
  route, 
  onChangeMode, 
  onClose 
}) => {
  const { theme } = useTheme();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  // Animation reference
  const animatedHeight = useRef(new Animated.Value(150)).current;
  const mapOpacity = useRef(new Animated.Value(1)).current;

  // Hiệu ứng khi toggle bản đồ
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: showMap ? 150 : 0,
        duration: 300,
        useNativeDriver: false
      }),
      Animated.timing(mapOpacity, {
        toValue: showMap ? 1 : 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  }, [showMap]);

  // Hiển thị khoảng cách dưới dạng km nếu > 1000m
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Hiển thị thời gian dưới dạng HH:MM hoặc MM phút
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} giây`;
    }
    
    if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} phút`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} giờ ${minutes} phút`;
  };

  // Lấy icon cho hướng dẫn
  const getManeuverIcon = (maneuver?: string) => {
    if (!maneuver || !(maneuver in MANEUVER_DATA)) {
      return 'arrow-right-thick';
    }
    return MANEUVER_DATA[maneuver as keyof typeof MANEUVER_DATA].icon;
  };

  // Lấy mô tả cho hướng dẫn
  const getManeuverText = (maneuver?: string) => {
    if (!maneuver || !(maneuver in MANEUVER_DATA)) {
      return 'Đi thẳng';
    }
    return MANEUVER_DATA[maneuver as keyof typeof MANEUVER_DATA].text;
  };

  // Chia sẻ đường đi
  const shareRoute = async () => {
    if (!route) return;
    
    try {
      const originLat = route.origin.latitude;
      const originLng = route.origin.longitude;
      const destLat = route.destination.latitude;
      const destLng = route.destination.longitude;
      
      // Tạo URL Google Maps
      let url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`;
      
      // Thêm mode phương tiện
      if (route.mode.gcp === 'DRIVE') {
        url += '&travelmode=driving';
      } else if (route.mode.gcp === 'WALK') {
        url += '&travelmode=walking';
      } else if (route.mode.gcp === 'BICYCLE') {
        url += '&travelmode=bicycling';
      } else if (route.mode.gcp === 'TRANSIT') {
        url += '&travelmode=transit';
      }
      
      await Share.share({
        message: `Chia sẻ đường đi: ${url}`,
        url: url
      });
    } catch (error) {
      console.error('Error sharing route:', error);
    }
  };

  // Mở đường đi trong Google Maps
  const openInGoogleMaps = () => {
    if (!route) return;
    
    const originLat = route.origin.latitude;
    const originLng = route.origin.longitude;
    const destLat = route.destination.latitude;
    const destLng = route.destination.longitude;
    
    // Tạo URL Google Maps
    let url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}`;
    
    // Thêm mode phương tiện
    if (route.mode.gcp === 'DRIVE') {
      url += '&travelmode=driving';
    } else if (route.mode.gcp === 'WALK') {
      url += '&travelmode=walking';
    } else if (route.mode.gcp === 'BICYCLE') {
      url += '&travelmode=bicycling';
    } else if (route.mode.gcp === 'TRANSIT') {
      url += '&travelmode=transit';
    }
    
    Linking.openURL(url);
  };

  // Xử lý khi nhấn vào một bước
  const handleStepPress = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedStep === index) {
      setExpandedStep(null);
    } else {
      setExpandedStep(index);
      if (showMap) {
        setActiveStep(index);
      }
    }
  };

  // Xử lý khi toggle hiển thị bản đồ
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  if (!route) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Chỉ đường</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={shareRoute} style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openInGoogleMaps} style={styles.actionButton}>
            <MaterialCommunityIcons name="google-maps" size={22} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMap} style={styles.actionButton}>
            <Ionicons 
              name={showMap ? "map" : "map-outline"} 
              size={22} 
              color={theme.primary} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Thông tin chung */}
      <View style={styles.summaryContainer}>
        <View style={styles.distanceTime}>
          <Text style={[styles.distanceTimeText, { color: theme.text }]}>
            {formatDistance(route.distance)}
          </Text>
          <Text style={[styles.separator, { color: theme.textLight }]}> • </Text>
          <Text style={[styles.distanceTimeText, { color: theme.text }]}>
            {formatDuration(route.duration)}
          </Text>
        </View>
        
        {/* Mini map */}
        <Animated.View 
          style={[
            styles.mapContainer,
            { 
              height: animatedHeight,
              opacity: mapOpacity
            }
          ]}
        >
          {showMap && (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: (route.origin.latitude + route.destination.latitude) / 2,
                longitude: (route.origin.longitude + route.destination.longitude) / 2,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              zoomEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              pitchEnabled={false}
            >
              <Polyline
                coordinates={route.steps.map(step => step.start_location)}
                strokeWidth={4}
                strokeColor={theme.primary}
              />
              
              <Marker coordinate={route.origin}>
                <View style={styles.originMarker}>
                  <FontAwesome5 name="dot-circle" size={16} color="#4CAF50" />
                </View>
              </Marker>
              
              <Marker coordinate={route.destination}>
                <View style={styles.destinationMarker}>
                  <FontAwesome5 name="flag-checkered" size={16} color="#F44336" />
                </View>
              </Marker>
              
              {activeStep !== null && (
                <Marker coordinate={route.steps[activeStep].start_location}>
                  <View style={styles.activeStepMarker}>
                    <MaterialCommunityIcons 
                      name={getManeuverIcon(route.steps[activeStep].maneuver)} 
                      size={16} 
                      color={theme.primary} 
                    />
                  </View>
                </Marker>
              )}
            </MapView>
          )}
        </Animated.View>
        
        {/* Các chế độ di chuyển */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.transportModesContainer}
          contentContainerStyle={styles.transportModesContent}
        >
          {TRANSPORT_MODES.map(mode => (
            <TransportModeButton
              key={mode.id}
              id={mode.id}
              label={mode.name}
              icon={mode.icon}
              isSelected={mode.gcp === route.mode.gcp}
              onPress={() => onChangeMode(mode.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Danh sách các bước */}
      <BottomSheetScrollView contentContainerStyle={styles.stepsContainer}>
        {route.steps.map((step, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stepItem,
              expandedStep === index && { backgroundColor: theme.subBackground },
              { borderBottomColor: theme.border }
            ]}
            onPress={() => handleStepPress(index)}
            activeOpacity={0.7}
          >
            <View style={styles.stepHeader}>
              <View style={[styles.stepIconContainer, { backgroundColor: expandedStep === index ? theme.primary + '20' : '#f2f2f2' }]}>
                <MaterialCommunityIcons
                  name={getManeuverIcon(step.maneuver)}
                  size={24}
                  color={theme.primary}
                />
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepManeuver, { color: theme.primary }]}>
                  {getManeuverText(step.maneuver)}
                </Text>
                <Text style={[styles.stepInstruction, { color: theme.text }]} numberOfLines={expandedStep === index ? undefined : 2}>
                  {step.instruction}
                </Text>
                <View style={styles.stepDetailContainer}>
                  <MaterialCommunityIcons name="map-marker-distance" size={14} color={theme.textLight} />
                  <Text style={[styles.stepDistance, { color: theme.textLight }]}>
                    {formatDistance(step.distance)}
                  </Text>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={theme.textLight} style={{ marginLeft: 8 }} />
                  <Text style={[styles.stepDuration, { color: theme.textLight }]}>
                    {formatDuration(step.duration)}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={expandedStep === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.textLight}
              />
            </View>
          </TouchableOpacity>
        ))}
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 10,
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  distanceTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distanceTimeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    fontSize: 16,
    marginHorizontal: 6,
  },
  mapContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  originMarker: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  destinationMarker: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  activeStepMarker: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  transportModesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  transportModesContent: {
    paddingRight: 20,
  },
  transportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  transportButtonText: {
    marginLeft: 6,
    fontSize: 14,
  },
  stepsContainer: {
    paddingBottom: 30,
  },
  stepItem: {
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIconContainer: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepManeuver: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  stepInstruction: {
    fontSize: 14,
    marginBottom: 4,
  },
  stepDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDistance: {
    fontSize: 12,
    marginLeft: 4,
  },
  stepDuration: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default RouteDetail; 