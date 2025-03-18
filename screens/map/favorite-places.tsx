import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Animated,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Place } from '@/objects/map/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_PLACES_STORAGE_KEY = '@dongnai_travel:favorite_places';

interface FavoritePlacesProps {
  onClose: () => void;
  onPlaceSelect: (place: Place) => void;
}

const FavoritePlaces: React.FC<FavoritePlacesProps> = ({ onClose, onPlaceSelect }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load danh sách địa điểm yêu thích từ AsyncStorage
  const loadFavoritePlaces = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITE_PLACES_STORAGE_KEY);
      if (jsonValue) {
        const savedPlaces = JSON.parse(jsonValue) as Place[];
        setPlaces(savedPlaces);
      }
    } catch (error) {
      console.error('Error loading favorite places:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách địa điểm yêu thích');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Lưu danh sách địa điểm yêu thích vào AsyncStorage
  const saveFavoritePlaces = async (placesToSave: Place[]) => {
    try {
      const jsonValue = JSON.stringify(placesToSave);
      await AsyncStorage.setItem(FAVORITE_PLACES_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving favorite places:', error);
      Alert.alert('Lỗi', 'Không thể lưu danh sách địa điểm yêu thích');
    }
  };

  // Xóa địa điểm khỏi danh sách yêu thích
  const removePlace = (placeId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa địa điểm này khỏi danh sách yêu thích?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const updatedPlaces = places.filter(p => p.place_id !== placeId);
            setPlaces(updatedPlaces);
            saveFavoritePlaces(updatedPlaces);
          }
        }
      ]
    );
  };

  // Load danh sách địa điểm yêu thích khi component mount
  useEffect(() => {
    loadFavoritePlaces();
  }, []);

  // Refresh danh sách địa điểm yêu thích
  const handleRefresh = () => {
    setRefreshing(true);
    loadFavoritePlaces();
  };

  // Render nút xóa bên phải khi swipe
  const renderRightActions = (dragX: Animated.AnimatedInterpolation<number>, placeId: string) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removePlace(placeId)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <MaterialIcons name="delete" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Render mỗi item trong danh sách
  const renderItem = ({ item }: { item: Place }) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightActions(dragX, item.place_id)}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity
          style={[styles.placeItem, { backgroundColor: theme.card }]}
          onPress={() => onPlaceSelect(item)}
          activeOpacity={0.7}
        >
          <View style={styles.placeContent}>
            <View style={[styles.placeImageContainer, { backgroundColor: theme.subBackground }]}>
              {item.photos && item.photos.length > 0 ? (
                <Image
                  source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${item.photos[0]}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}` }}
                  style={styles.placeImage}
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons name="place" size={24} color={theme.primary} />
              )}
            </View>
            <View style={styles.placeInfo}>
              <Text style={[styles.placeName, { color: theme.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.placeAddress, { color: theme.textLight }]} numberOfLines={2}>
                {item.address}
              </Text>
              {item.rating && (
                <View style={styles.ratingContainer}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesome
                      key={`star-${index}`}
                      name={
                        item.rating && item.rating >= index + 1
                          ? 'star'
                          : item.rating && item.rating >= index + 0.5
                          ? 'star-half-o'
                          : 'star-o'
                      }
                      size={12}
                      color="#FFC107"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                  <Text style={[styles.ratingText, { color: theme.textLight }]}>
                    {item.rating} ({item.user_ratings_total || 0})
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary + '10' }]}
                onPress={() => onPlaceSelect(item)}
              >
                <Ionicons name="navigate" size={18} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  // Render empty state khi không có địa điểm yêu thích
  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.textLight }]}>
            Đang tải danh sách địa điểm...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="favorite-border" size={64} color={theme.textLight} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          Chưa có địa điểm yêu thích
        </Text>
        <Text style={[styles.emptyText, { color: theme.textLight }]}>
          Hãy thêm địa điểm vào danh sách yêu thích bằng cách nhấn biểu tượng trái tim khi xem chi tiết địa điểm.
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Địa điểm yêu thích</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={places}
        keyExtractor={(item) => item.place_id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.border }]} />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  closeButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  placeItem: {
    padding: 16,
  },
  placeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeImage: {
    width: 60,
    height: 60,
  },
  placeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 13,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionContainer: {
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  separator: {
    height: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoritePlaces; 