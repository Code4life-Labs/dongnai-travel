import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { styles } from '../message-feature-styles';
import { PlacesFeatureProps } from '../types';
import { router } from 'expo-router';

/**
 * PlaceCard component hiển thị thông tin cơ bản về một địa điểm
 */
const PlaceCard = ({ place, onPress }: { place: any; onPress: () => void }) => {
  // Lấy hình ảnh từ đúng trường dựa trên dữ liệu có sẵn
  const imageSource = place.image || (place.images && place.images.length > 0 ? place.images[0] : null);
  
  return (
    <TouchableOpacity style={localStyles.placeCard} onPress={onPress}>
      <View style={localStyles.placeImageContainer}>
        <Image 
          source={{ uri: imageSource }}
          style={localStyles.placeImage}
        />
      </View>
      
      <View style={localStyles.placeInfo}>
        <Text style={localStyles.placeName} numberOfLines={1}>{place.name}</Text>
        
        <View style={localStyles.placeRatingContainer}>
          <AntDesign name="star" size={14} color="#FFD700" />
          <Text style={localStyles.placeRating}>
            {place.rating || place.avgRating || '0'} 
            <Text style={localStyles.placeReviewCount}>
              {place.numReviews ? ` (${place.numReviews})` : ''}
            </Text>
          </Text>
        </View>
        
        {place.address && (
          <Text style={localStyles.placeAddress} numberOfLines={1}>
            {place.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Component hiển thị danh sách các địa điểm gợi ý
 */
const PlacesFeature: React.FC<PlacesFeatureProps> = ({ 
  places, 
  onLoadMore,
  isLoading = false 
}) => {
  if (!places || places.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không có địa điểm nào để hiển thị</Text>
      </View>
    );
  }

  // Xử lý khi người dùng nhấn vào địa điểm
  const handlePlacePress = (placeId: string) => {
    try {
      // Sử dụng cách an toàn hơn khi chuyển màn hình trong chatbot
      console.log(`Mở chi tiết địa điểm: ${placeId}`);
      // Sử dụng Linking để mở trong browser - cách xử lý tạm thời
      Linking.openURL(`dongnai://place/${placeId}`).catch(() => {
        // Fallback nếu không mở được custom URL
        console.log('Không thể mở link nội bộ');
      });
    } catch (error) {
      console.error('Lỗi khi điều hướng:', error);
    }
  };

  return (
    <View style={styles.placesContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.placesList}
      >
        {places.map((place, index) => (
          <PlaceCard
            key={place._id || index}
            place={place}
            onPress={() => handlePlacePress(place._id)}
          />
        ))}
      </ScrollView>

      {onLoadMore && (
        <TouchableOpacity 
          style={styles.loadMoreButton}
          onPress={onLoadMore}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <Text style={styles.loadMoreText}>Xem thêm</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles cục bộ cho component
const localStyles = StyleSheet.create({
  placeCard: {
    width: 220,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  placeImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  placeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeInfo: {
    padding: 12,
  },
  placeName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  placeAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  placeRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  placeRating: {
    fontSize: 14,
    marginLeft: 4,
    color: '#555',
  },
  placeReviewCount: {
    fontSize: 12,
    color: '#888',
  }
});

export default PlacesFeature; 