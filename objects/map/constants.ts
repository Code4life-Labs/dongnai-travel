import { DirectionModesGCP, DirectionModesORS, PlaceType } from "@/declarations.d";

/**
 * Các loại bản đồ
 */
export const MAP_TYPES = [
  { id: 'standard', name: 'Tiêu chuẩn' },
  { id: 'satellite', name: 'Vệ tinh' },
  { id: 'hybrid', name: 'Hỗn hợp' },
  { id: 'terrain', name: 'Địa hình' },
];

/**
 * Các loại phương tiện di chuyển
 */
export const TRANSPORT_MODES = [
  { 
    id: '1', 
    name: 'Ô tô', 
    icon: 'car', 
    gcp: 'DRIVE' as DirectionModesGCP, 
    ors: 'driving-car' as DirectionModesORS 
  },
  { 
    id: '2', 
    name: 'Đi bộ', 
    icon: 'walk', 
    gcp: 'WALK' as DirectionModesGCP, 
    ors: 'foot-walking' as DirectionModesORS 
  },
  { 
    id: '3', 
    name: 'Xe đạp', 
    icon: 'bicycle', 
    gcp: 'BICYCLE' as DirectionModesGCP, 
    ors: 'cycling-regular' as DirectionModesORS 
  },
  { 
    id: '4', 
    name: 'Phương tiện công cộng', 
    icon: 'bus', 
    gcp: 'TRANSIT' as DirectionModesGCP, 
    ors: 'driving-car' as DirectionModesORS 
  }
];

/**
 * Các loại địa điểm
 */
export const PLACE_TYPES = [
  { id: 'restaurant', name: 'Nhà hàng', icon: 'utensils', color: '#FF5722' },
  { id: 'cafe', name: 'Quán cà phê', icon: 'coffee', color: '#795548' },
  { id: 'lodging', name: 'Khách sạn', icon: 'hotel', color: '#2196F3' },
  { id: 'tourist_attraction', name: 'Du lịch', icon: 'umbrella-beach', color: '#9C27B0' },
  { id: 'museum', name: 'Bảo tàng', icon: 'landmark', color: '#9C27B0' },
  { id: 'park', name: 'Công viên', icon: 'tree', color: '#4CAF50' },
  { id: 'shopping_mall', name: 'Trung tâm mua sắm', icon: 'shopping-bag', color: '#FF9800' },
];

/**
 * Các trường cần thiết cho chi tiết địa điểm
 */
export const PLACE_DETAILS_FIELDS = [
  'name',
  'place_id',
  'formatted_address',
  'geometry',
  'photos',
  'rating',
  'user_ratings_total',
  'opening_hours',
  'types',
  'website',
  'formatted_phone_number',
  'reviews'
];

/**
 * Biểu tượng thời tiết
 */
export const WEATHER_ICONS = {
  '01d': 'weather-sunny',        // Trời quang đãng (ban ngày)
  '01n': 'weather-night',        // Trời quang đãng (ban đêm)
  '02d': 'weather-partly-cloudy', // Mây rải rác (ban ngày)
  '02n': 'weather-night-partly-cloudy', // Mây rải rác (ban đêm)
  '03d': 'weather-cloudy',       // Mây rải rác (ban ngày)
  '03n': 'weather-cloudy',       // Mây rải rác (ban đêm)
  '04d': 'weather-cloudy',       // Mây (ban ngày)
  '04n': 'weather-cloudy',       // Mây (ban đêm)
  '09d': 'weather-pouring',      // Mưa vừa (ban ngày)
  '09n': 'weather-pouring',      // Mưa vừa (ban đêm)
  '10d': 'weather-rainy',        // Mưa (ban ngày)
  '10n': 'weather-rainy',        // Mưa (ban đêm)
  '11d': 'weather-lightning',    // Giông (ban ngày)
  '11n': 'weather-lightning',    // Giông (ban đêm)
  '13d': 'weather-snowy',        // Tuyết (ban ngày)
  '13n': 'weather-snowy',        // Tuyết (ban đêm)
  '50d': 'weather-fog',          // Sương mù (ban ngày)
  '50n': 'weather-fog',          // Sương mù (ban đêm)
};

/**
 * Dữ liệu các điểm vận động (điều hướng)
 */
export const MANEUVER_DATA = {
  'turn-slight-left': { icon: 'arrow-top-left-thin', text: 'Rẽ nhẹ sang trái' },
  'turn-sharp-left': { icon: 'arrow-top-left-bold', text: 'Rẽ gắt sang trái' },
  'uturn-left': { icon: 'arrow-u-left-top', text: 'Quay đầu sang trái' },
  'turn-left': { icon: 'arrow-left-thick', text: 'Rẽ trái' },
  'turn-slight-right': { icon: 'arrow-top-right-thin', text: 'Rẽ nhẹ sang phải' },
  'turn-sharp-right': { icon: 'arrow-top-right-bold', text: 'Rẽ gắt sang phải' },
  'uturn-right': { icon: 'arrow-u-right-top', text: 'Quay đầu sang phải' },
  'turn-right': { icon: 'arrow-right-thick', text: 'Rẽ phải' },
  'straight': { icon: 'arrow-up-thick', text: 'Đi thẳng' },
  'ramp-left': { icon: 'arrow-bottom-left', text: 'Lên dốc sang trái' },
  'ramp-right': { icon: 'arrow-bottom-right', text: 'Lên dốc sang phải' },
  'merge': { icon: 'call-merge', text: 'Hợp nhất' },
  'fork-left': { icon: 'call-split', text: 'Rẽ nhánh sang trái' },
  'fork-right': { icon: 'call-split', text: 'Rẽ nhánh sang phải' },
  'ferry': { icon: 'ferry', text: 'Phà' },
  'ferry-train': { icon: 'ferry', text: 'Tàu phà' },
  'roundabout-left': { icon: 'rotate-left', text: 'Vòng xoay sang trái' },
  'roundabout-right': { icon: 'rotate-right', text: 'Vòng xoay sang phải' }
}; 