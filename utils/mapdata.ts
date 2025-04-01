// Định nghĩa các types
export type RawImage = {
  image: any;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Place = {
  id: string;
  coordinate: Coordinate;
  title: string;
  description: string;
  image: any;
  rating: number;
  reviews: number;
};

export type Control = {
  id: string;
  title: string;
  icon: string;
};

export type TransportMode = {
  id: string;
  title: {
    vi: string;
    en: string;
  };
  icon: string;
  modeGCP: string;
  modeORS: string;
};

export type Maneuver = {
  id: string;
  en: string;
  vi: string;
  desc_vi?: string;
  desc_en?: string;
  icon: any;
};

export type WeatherIcon = {
  [key: string]: any;
};

export type WeatherImage = {
  id: string;
  image: any;
};

export type MapType = {
  id: string;
  vi: string;
  en: string;
  image: any;
};

export type TypePlace = {
  id: string;
  [key: string]: {
    en: string;
    vi: string;
  } | string;
};

export type MapStyle = Array<{
  elementType?: string;
  featureType?: string;
  stylers: Array<{
    color?: string;
    visibility?: string;
  }>;
}>;

export type NotificationIcon = {
  [key: string]: string;
};

// Dữ liệu bản đồ
export const rawImages: RawImage[] = [
  { image: require('@/assets/images/food1.jpg') },
  { image: require('@/assets/images/food2.jpg') },
  { image: require('@/assets/images/food3.jpg') },
  { image: require('@/assets/images/food4.jpg') },
  { image: require('@/assets/images/food5.jpg') },
];

export const markers: Place[] = [
  {
    id: '1',
    coordinate: {
      latitude: 10.9702918,
      longitude: 106.8903411,
    },
    title: 'Công Viên 30/4',
    description: 'Công viên nhỏ rợp bóng cây có đài phun nước, khu vui chơi, những bờ rào và lối đi tạo hình.',
    image: rawImages[0].image,
    rating: 4,
    reviews: 99,
  },
  {
    id: '2',
    coordinate: {
      latitude: 10.9722587,
      longitude: 106.8871971,
    },
    title: 'Mì Trộn Tóp Mỡ Lòng Đào 3CE',
    description: 'Mì trộn ngon nhất trảng dài',
    image: rawImages[1].image,
    rating: 5,
    reviews: 102,
  },
  {
    id: '3',
    coordinate: {
      latitude: 10.9727022,
      longitude: 106.8851312
    },
    title: 'ZEN Tea',
    description: 'Thức uống đa dạng có chỗ để xe thoáng mát',
    image: rawImages[2].image,
    rating: 3,
    reviews: 220,
  },
  {
    id: '4',
    coordinate: {
      latitude: 10.9726842,
      longitude: 106.8843364,
    },
    title: 'Ốc Ngon Hố Nai',
    description: 'Quán sạch sẽ thoáng mát, nhân viên phục vụ nhiệt tình, dễ thương.',
    image: rawImages[3].image,
    rating: 4,
    reviews: 48,
  },
  {
    id: '5',
    coordinate: {
      latitude: 10.9742864,
      longitude: 106.8800162,
    },
    title: 'Bún đậu Ông Nghĩa',
    description: 'Đồ ăn ngon, đảm bảo vệ sinh, quán sạch sẽ, nhân viên nhiệt tình và phục vụ nhanh.',
    image: rawImages[3].image,
    rating: 4,
    reviews: 178,
  },
];

export const controls: Control[] = [
  {
    id: '1',
    title: 'Xem chi tiết',
    icon: 'book-open'
  },
  {
    id: '2',
    title: 'Đường đi',
    icon: 'directions'
  },
  {
    id: '3',
    title: 'Bắt đầu',
    icon: 'location-arrow'
  },
  {
    id: '4',
    title: 'Lưu',
    icon: 'bookmark'
  },
  {
    id: '5',
    title: 'Chia sẻ',
    icon: 'share'
  },
  {
    id: '6',
    title: 'Trang web',
    icon: 'globe-americas'
  },
];

export const typeModeTransport: TransportMode[] = [
  {
    id: '1',
    title: {
      vi: "Xe hơi",
      en: 'Car',
    },
    icon: 'car',
    modeGCP: 'DRIVE',
    modeORS: 'driving-car',
  },
  {
    id: '2',
    title: {
      vi: "Xe máy",
      en: 'Motorcycle',
    },
    icon: 'motorcycle',
    modeGCP: 'TWO_WHEELER',
    modeORS: 'driving-car',
  },
  {
    id: '3',
    title: {
      vi: "Xe đạp",
      en: 'Bicyle',
    },
    icon: 'bicycle',
    modeGCP: 'BICYCLE',
    modeORS: 'cycling-regular',
  },
  {
    id: '4',
    title: {
      vi: "Đi bộ",
      en: 'Walk',
    },
    icon: 'walking',
    modeGCP: 'WALK',
    modeORS: 'foot-walking'
  },
];

export const weatherIcons: WeatherIcon = {
  "01d": "weather-sunny",
  "01n": "weather-night", 
  "02d": "weather-partly-cloudy",
  "02n": "weather-night-partly-cloudy",
  "03d": "weather-cloudy", 
  "03n": "weather-cloudy", 
  "04d": "weather-cloudy", 
  "04n": "weather-cloudy", 
  "09d": "weather-pouring",
  "09n": "weather-pouring",
  "10d": "weather-partly-rainy",
  "10n": "weather-night-partly-cloudy",
  "11d": "weather-lightning",
  "11n": "weather-lightning",
  "13d": "weather-snowy",
  "13n": "weather-snowy",
  "50d": "weather-fog", 
  "50n": "weather-fog"
};

export const mapTypes: MapType[] = [
  {
    id: 'standard',
    vi: 'Tiêu chuẩn',
    en: 'Standard',
    image: require('@/assets/images/map_type/standard.jpg')
  },
  {
    id: 'satellite',
    vi: 'Vệ tinh',
    en: 'Satellite',
    image: require('@/assets/images/map_type/satellite.jpg')
  },
  {
    id: 'hybrid',
    vi: 'Kết hợp',
    en: 'Hybrid',
    image: require('@/assets/images/map_type/hybrid.jpg')
  },
  {
    id: 'terrain',
    vi: 'Địa hình',
    en: 'Terrain',
    image: require('@/assets/images/map_type/terrain.jpg')
  },
  {
    id: 'traffic',
    vi: 'Giao thông',
    en: 'Traffic',
    image: require('@/assets/images/map_type/traffic.jpg')
  }
];

export const notifIcon: NotificationIcon = {
  'FOLLOW': 'user-check',
  'COMMEMT': 'comments',
  'INVITE': 'route',
  'POST': 'book'
};

export const mapDarkStyle: MapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121'
      }
    ]
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121'
      }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575'
      }
    ]
  },
];

export const mapStandardStyle: MapStyle = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
]; 