import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Share,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { Place } from '@/objects/map/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageModal from 'react-native-image-modal';

const FAVORITE_PLACES_STORAGE_KEY = '@dongnai_travel:favorite_places';

// Tạo component StarRating tạm thời để thay thế import từ @/components/star_rating/StarRating
const StarRating: React.FC<{rating: number, size?: number}> = ({rating, size = 16}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome key={`full-${i}`} name="star" size={size} color="#FFC107" style={{marginRight: 2}} />
      );
    }
    
    // Half star
    if (halfStar) {
      stars.push(
        <FontAwesome key="half" name="star-half-o" size={size} color="#FFC107" style={{marginRight: 2}} />
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesome key={`empty-${i}`} name="star-o" size={size} color="#FFC107" style={{marginRight: 2}} />
      );
    }
    
    return stars;
  };
  
  return (
    <View style={{flexDirection: 'row'}}>
      {renderStars()}
    </View>
  );
};

interface PlaceDetailProps {
  place: Place;
  onGetDirections: () => void;
  onShare: () => void;
  onClose: () => void;
  onToggleOpenHours?: () => void;
  isToggleOpenHours?: boolean;
  arrowTransform?: Animated.AnimatedInterpolation<string | number>;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({
  place,
  onGetDirections,
  onShare,
  onClose,
  onToggleOpenHours,
  isToggleOpenHours = false,
  arrowTransform,
}) => {
  const { theme } = useTheme();
  const [openingHoursVisible, setOpeningHoursVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Kiểm tra xem địa điểm có trong danh sách yêu thích không
  const checkIsFavorite = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITE_PLACES_STORAGE_KEY);
      if (jsonValue) {
        const favoritesList = JSON.parse(jsonValue) as Place[];
        const isInFavorites = favoritesList.some(favPlace => favPlace.place_id === place.place_id);
        setIsFavorite(isInFavorites);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Thêm/xóa địa điểm khỏi danh sách yêu thích
  const toggleFavoriteStatus = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITE_PLACES_STORAGE_KEY);
      let favoritesList: Place[] = [];
      
      if (jsonValue) {
        favoritesList = JSON.parse(jsonValue) as Place[];
      }
      
      if (isFavorite) {
        // Xóa khỏi danh sách yêu thích
        favoritesList = favoritesList.filter(favPlace => favPlace.place_id !== place.place_id);
        setIsFavorite(false);
      } else {
        // Thêm vào danh sách yêu thích
        const favoritePlace = { ...place };
        favoritesList.push(favoritePlace);
        setIsFavorite(true);
      }
      
      await AsyncStorage.setItem(FAVORITE_PLACES_STORAGE_KEY, JSON.stringify(favoritesList));
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu thích');
    } finally {
      setIsSaving(false);
    }
  };

  // Kiểm tra trạng thái yêu thích khi component mount
  useEffect(() => {
    checkIsFavorite();
  }, [place.place_id]);

  // Mở số điện thoại
  const handleCallPress = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };

  // Mở website
  const handleWebsitePress = (website: string) => {
    Linking.openURL(website);
  };

  // Mở Google Maps
  const handleOpenInMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${place.coordinate.latitude},${place.coordinate.longitude}`;
    const label = place.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  // Toggle opening hours with animation if provided, otherwise use default toggle
  const handleToggleOpenHours = () => {
    if (onToggleOpenHours) {
      onToggleOpenHours();
    } else {
      setOpeningHoursVisible(!openingHoursVisible);
    }
  };

  // Use the externally controlled toggle state if provided
  const isOpenHoursVisible = onToggleOpenHours ? isToggleOpenHours : openingHoursVisible;

  return (
    <BottomSheetScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.placeName, { color: theme.onBackground }]}>{place.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={toggleFavoriteStatus}
            disabled={isSaving}
            style={styles.favoriteButton}
          >
            <MaterialIcons 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={24} 
              color={isFavorite ? "#F44336" : theme.onBackground} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={theme.onBackground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Images */}
      {place.photos && place.photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
          {place.photos.map((photo, index) => (
            <ImageModal
              key={index}
              source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}` }}
              style={styles.photo}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* Rating */}
      {place.rating !== undefined && (
        <View style={styles.ratingContainer}>
          <StarRating rating={place.rating} size={16} />
          <Text style={[styles.ratingText, { color: theme.onBackground }]}>
            {place.rating.toFixed(1)} ({place.user_ratings_total || 0})
          </Text>
        </View>
      )}

      {/* Address */}
      {place.address && (
        <View style={styles.infoRow}>
          <MaterialIcons name="place" size={20} color={theme.primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.onBackground }]}>{place.address}</Text>
        </View>
      )}

      {/* Phone */}
      {place.phone_number && (
        <TouchableOpacity style={styles.infoRow} onPress={() => handleCallPress(place.phone_number!)}>
          <MaterialIcons name="phone" size={20} color={theme.primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.onBackground }]}>{place.phone_number}</Text>
        </TouchableOpacity>
      )}

      {/* Website */}
      {place.website && (
        <TouchableOpacity style={styles.infoRow} onPress={() => handleWebsitePress(place.website!)}>
          <MaterialIcons name="language" size={20} color={theme.primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.onBackground, textDecorationLine: 'underline' }]}>
            {place.website}
          </Text>
        </TouchableOpacity>
      )}

      {/* Opening Hours */}
      {place.opening_hours && place.opening_hours.weekday_text && (
        <View>
          <TouchableOpacity 
            style={styles.infoRow} 
            onPress={handleToggleOpenHours}
          >
            <MaterialIcons 
              name="access-time" 
              size={20} 
              color={theme.primary} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, { color: theme.onBackground }]}>
              {place.opening_hours.open_now ? 'Đang mở cửa' : 'Đã đóng cửa'}
            </Text>
            {arrowTransform ? (
              <Animated.View style={{ transform: [{ rotate: arrowTransform }] }}>
                <MaterialIcons 
                  name="keyboard-arrow-down" 
                  size={24} 
                  color={theme.onBackground} 
                />
              </Animated.View>
            ) : (
              <MaterialIcons 
                name={isOpenHoursVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color={theme.onBackground} 
              />
            )}
          </TouchableOpacity>
          
          {isOpenHoursVisible && (
            <View style={styles.openingHoursContainer}>
              {place.opening_hours.weekday_text.map((day, index) => (
                <Text 
                  key={index} 
                  style={[styles.openingHoursText, { color: theme.onBackground }]}
                >
                  {day}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={onGetDirections}
        >
          <MaterialIcons name="directions" size={20} color={theme.onPrimary} />
          <Text style={[styles.actionButtonText, { color: theme.onPrimary }]}>Chỉ đường</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.secondary }]}
          onPress={onShare}
        >
          <MaterialIcons name="share" size={20} color={theme.onSecondary} />
          <Text style={[styles.actionButtonText, { color: theme.onSecondary }]}>Chia sẻ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.tertiary }]}
          onPress={handleOpenInMaps}
        >
          <MaterialCommunityIcons name="google-maps" size={20} color={theme.onTertiary} />
          <Text style={[styles.actionButtonText, { color: theme.onTertiary }]}>Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Place type */}
      {place.types && place.types.length > 0 && (
        <View style={styles.typesContainer}>
          {place.types.slice(0, 3).map((type, index) => (
            <View key={index} style={[styles.typeChip, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.typeText, { color: theme.primary }]}>
                {type.replace(/_/g, ' ')}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Reviews */}
      {place.reviews && place.reviews.length > 0 && (
        <View style={styles.reviewsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.onBackground }]}>Đánh giá</Text>
          {place.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: review.profile_photo_url || 'https://via.placeholder.com/40' }} 
                  style={styles.reviewerImage} 
                />
                <View style={styles.reviewerInfo}>
                  <Text style={[styles.reviewerName, { color: theme.onBackground }]}>
                    {review.author_name}
                  </Text>
                  <Text style={[styles.reviewDate, { color: theme.textLight }]}>
                    {new Date(review.time * 1000).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.reviewRating}>
                  <StarRating rating={review.rating} size={14} />
                </View>
              </View>
              <Text style={[styles.reviewText, { color: theme.textLight }]}>
                {review.text}
              </Text>
            </View>
          ))}
        </View>
      )}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  favoriteButton: {
    padding: 4,
    marginRight: 8,
  },
  photosContainer: {
    marginBottom: 16,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  openingHoursContainer: {
    marginLeft: 28,
    marginBottom: 12,
  },
  openingHoursText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  reviewsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  reviewerInfo: {
    flexDirection: 'column',
  },
  reviewerName: {
    fontWeight: '500',
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewRating: {
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PlaceDetail; 