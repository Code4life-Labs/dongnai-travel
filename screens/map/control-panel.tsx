import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@/hooks/useTheme';

interface ControlPanelProps {
  isTrackingUserLocation: boolean;
  onGoToUserLocation: () => void;
  onToggleLocationTracking: () => void;
  onChangeMapType: () => void;
  onOpenWeather: () => void;
  onOpenFilter?: () => void;
  onOpenFavorites?: () => void;
  mapType: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isTrackingUserLocation,
  onGoToUserLocation,
  onToggleLocationTracking,
  onChangeMapType,
  onOpenWeather,
  onOpenFilter,
  onOpenFavorites,
  mapType
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Lấy icon cho loại bản đồ hiện tại
  const getMapTypeIcon = () => {
    switch (mapType) {
      case 'standard':
        return 'map';
      case 'satellite':
        return 'satellite';
      case 'hybrid':
        return 'map';
      case 'terrain':
        return 'terrain';
      default:
        return 'map';
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.card,
          right: 16,
          bottom: 16 + insets.bottom
        }
      ]}
    >
      {/* Nút đi đến vị trí người dùng */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.card }]} 
        onPress={onGoToUserLocation}
      >
        <MaterialIcons name="my-location" size={24} color={theme.primary} />
      </TouchableOpacity>

      {/* Nút bật/tắt theo dõi vị trí */}
      <TouchableOpacity 
        style={[
          styles.button, 
          { 
            backgroundColor: isTrackingUserLocation 
              ? theme.primary 
              : theme.card 
          }
        ]} 
        onPress={onToggleLocationTracking}
      >
        <MaterialIcons 
          name="location-searching" 
          size={24} 
          color={isTrackingUserLocation ? theme.onPrimary : theme.primary} 
        />
      </TouchableOpacity>

      {/* Nút thay đổi loại bản đồ */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.card }]} 
        onPress={onChangeMapType}
      >
        <MaterialIcons 
          name={getMapTypeIcon()} 
          size={24} 
          color={theme.primary} 
        />
      </TouchableOpacity>

      {/* Nút xem thời tiết */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.card }]} 
        onPress={onOpenWeather}
      >
        <MaterialCommunityIcons 
          name="weather-partly-cloudy" 
          size={24} 
          color={theme.primary} 
        />
      </TouchableOpacity>

      {/* Nút mở địa điểm yêu thích */}
      {onOpenFavorites && (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.card }]} 
          onPress={onOpenFavorites}
        >
          <MaterialIcons 
            name="favorite" 
            size={24} 
            color={theme.primary} 
          />
        </TouchableOpacity>
      )}

      {/* Nút mở bộ lọc */}
      {onOpenFilter && (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.card }]} 
          onPress={onOpenFilter}
        >
          <Feather 
            name="filter" 
            size={24} 
            color={theme.primary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 8,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default ControlPanel; 