// Danh sách đầy đủ 63 tỉnh thành Việt Nam với tọa độ
export const vietnamCities = [
  // Thành phố trực thuộc trung ương
  { name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
  { name: "TP Hồ Chí Minh", lat: 10.8231, lon: 106.6297 },
  { name: "Đà Nẵng", lat: 16.0544, lon: 108.2022 },
  { name: "Hải Phòng", lat: 20.8449, lon: 106.6881 },
  { name: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
  
  // Các tỉnh miền Bắc
  { name: "Bắc Giang", lat: 21.2771, lon: 106.1947 },
  { name: "Bắc Kạn", lat: 22.1477, lon: 105.8349 },
  { name: "Bắc Ninh", lat: 21.1861, lon: 106.0763 },
  { name: "Cao Bằng", lat: 22.6666, lon: 106.2639 },
  { name: "Điện Biên", lat: 21.3856, lon: 103.0321 },
  { name: "Hà Giang", lat: 22.8268, lon: 104.9886 },
  { name: "Hà Nam", lat: 20.5464, lon: 105.9219 },
  { name: "Hải Dương", lat: 20.9373, lon: 106.3145 },
  { name: "Hòa Bình", lat: 20.8133, lon: 105.3383 },
  { name: "Hưng Yên", lat: 20.6464, lon: 106.0511 },
  { name: "Lai Châu", lat: 22.3964, lon: 103.4716 },
  { name: "Lạng Sơn", lat: 21.8530, lon: 106.7610 },
  { name: "Lào Cai", lat: 22.4856, lon: 103.9723 },
  { name: "Nam Định", lat: 20.4338, lon: 106.1621 },
  { name: "Ninh Bình", lat: 20.2580, lon: 105.9753 },
  { name: "Phú Thọ", lat: 21.3989, lon: 105.1682 },
  { name: "Quảng Ninh", lat: 21.0064, lon: 107.2925 },
  { name: "Sơn La", lat: 21.1024, lon: 103.7289 },
  { name: "Thái Bình", lat: 20.4461, lon: 106.3368 },
  { name: "Thái Nguyên", lat: 21.5942, lon: 105.8481 },
  { name: "Tuyên Quang", lat: 21.7767, lon: 105.2280 },
  { name: "Vĩnh Phúc", lat: 21.3609, lon: 105.5474 },
  { name: "Yên Bái", lat: 21.7226, lon: 104.9087 },
  
  // Các tỉnh miền Trung
  { name: "Bình Định", lat: 13.7695, lon: 109.2235 },
  { name: "Bình Thuận", lat: 10.9804, lon: 108.2622 },
  { name: "Đắk Lắk", lat: 12.6724, lon: 108.0377 },
  { name: "Đắk Nông", lat: 12.0045, lon: 107.6870 },
  { name: "Gia Lai", lat: 13.9808, lon: 108.0151 },
  { name: "Hà Tĩnh", lat: 18.3554, lon: 105.8877 },
  { name: "Khánh Hòa", lat: 12.2388, lon: 109.1967 },
  { name: "Kon Tum", lat: 14.3544, lon: 108.0081 },
  { name: "Lâm Đồng", lat: 11.9404, lon: 108.4583 },
  { name: "Nghệ An", lat: 18.6734, lon: 105.6922 },
  { name: "Ninh Thuận", lat: 11.5675, lon: 108.9980 },
  { name: "Phú Yên", lat: 13.0881, lon: 109.0928 },
  { name: "Quảng Bình", lat: 17.4682, lon: 106.6221 },
  { name: "Quảng Nam", lat: 15.5394, lon: 108.0191 },
  { name: "Quảng Ngãi", lat: 15.1213, lon: 108.8048 },
  { name: "Quảng Trị", lat: 16.7943, lon: 107.0451 },
  { name: "Thanh Hóa", lat: 19.8066, lon: 105.7852 },
  { name: "Thừa Thiên Huế", lat: 16.4637, lon: 107.5909 },
  
  // Các tỉnh miền Nam
  { name: "An Giang", lat: 10.3864, lon: 105.4351 },
  { name: "Bà Rịa - Vũng Tàu", lat: 10.3461, lon: 107.0834 },
  { name: "Bạc Liêu", lat: 9.2940, lon: 105.7216 },
  { name: "Bến Tre", lat: 10.2433, lon: 106.3756 },
  { name: "Bình Dương", lat: 11.1874, lon: 106.6514 },
  { name: "Bình Phước", lat: 11.7511, lon: 106.7237 },
  { name: "Cà Mau", lat: 9.1527, lon: 105.1967 },
  { name: "Đồng Nai", lat: 10.9508, lon: 106.8221 },
  { name: "Đồng Tháp", lat: 10.4938, lon: 105.6882 },
  { name: "Hậu Giang", lat: 9.7579, lon: 105.6413 },
  { name: "Kiên Giang", lat: 10.0124, lon: 105.0809 },
  { name: "Long An", lat: 10.5451, lon: 106.4113 },
  { name: "Sóc Trăng", lat: 9.6037, lon: 105.9739 },
  { name: "Tây Ninh", lat: 11.3351, lon: 106.1098 },
  { name: "Tiền Giang", lat: 10.3493, lon: 106.3715 },
  { name: "Trà Vinh", lat: 9.9513, lon: 106.3346 },
  { name: "Vĩnh Long", lat: 10.2537, lon: 105.9722 }
];

// Thêm đối tượng dịch điều kiện thời tiết
export const weatherConditionTranslations: { [key: string]: string } = {
  'clear': 'Trời quang',
  'clouds': 'Có mây',
  'rain': 'Mưa',
  'drizzle': 'Mưa phùn',
  'thunderstorm': 'Dông',
  'snow': 'Tuyết',
  'mist': 'Sương mù',
  'smoke': 'Khói',
  'haze': 'Sương mờ',
  'dust': 'Bụi',
  'fog': 'Sương mù',
  'sand': 'Cát',
  'ash': 'Tro bụi',
  'squall': 'Mưa dông',
  'tornado': 'Lốc xoáy',
  'partly cloudy': 'Mây rải rác',
  'overcast clouds': 'Nhiều mây',
  'broken clouds': 'Mây rải rác',
  'scattered clouds': 'Mây rải rác',
  'few clouds': 'Ít mây',
  'light rain': 'Mưa nhẹ',
  'moderate rain': 'Mưa vừa',
  'heavy rain': 'Mưa to',
  'shower rain': 'Mưa rào',
};

// Cập nhật dữ liệu dự báo thời tiết theo ngày (mẫu) sang tiếng Việt
export const sampleDailyForecasts = [
  { day: "Hôm qua", highTemp: 84, lowTemp: 68, icon: "sunny", precipitation: 0, condition: "Trời quang" },
  { day: "Hôm nay", highTemp: 77, lowTemp: 63, icon: "partly-sunny", precipitation: 9, condition: "Mây rải rác" },
  { day: "Ngày mai", highTemp: 75, lowTemp: 62, icon: "partly-sunny", precipitation: 10, condition: "Mây rải rác" },
  { day: "Thứ tư", highTemp: 73, lowTemp: 60, icon: "rainy", precipitation: 30, condition: "Mưa" },
  { day: "Thứ năm", highTemp: 70, lowTemp: 58, icon: "rainy", precipitation: 40, condition: "Mưa" },
];

// Hàm lấy icon thời tiết dựa trên điều kiện
export const getWeatherIcon = (weatherCondition: string) => {
  const condition = weatherCondition.toLowerCase();
  if (condition.includes('clear')) {
    return 'sunny';
  } else if (condition.includes('cloud')) {
    return 'partly-sunny';
  } else if (condition.includes('rain')) {
    return 'rainy';
  } else if (condition.includes('thunder')) {
    return 'thunderstorm';
  } else if (condition.includes('snow')) {
    return 'snow';
  } else {
    return 'partly-sunny';
  }
};

// Hàm viết hoa chữ cái đầu tiên
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Hàm tìm tỉnh thành phố gần nhất dựa trên tọa độ
export const findNearestCity = (lat: number, lon: number): { name: string; lat: number; lon: number } => {
  let nearestCity = vietnamCities[0];
  let minDistance = calculateDistance(lat, lon, nearestCity.lat, nearestCity.lon);

  vietnamCities.forEach(city => {
    const distance = calculateDistance(lat, lon, city.lat, city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity;
};

// Hàm tính khoảng cách giữa hai điểm tọa độ (công thức Haversine)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Bán kính trái đất tính bằng km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Hàm chuyển đổi độ sang radian
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Ánh xạ tên thành phố từ OpenWeather sang tên Việt Nam
export const mapCityName = (openWeatherCityName: string): string => {
  // Danh sách ánh xạ tên thành phố từ OpenWeather sang tên Việt Nam
  const cityNameMapping: { [key: string]: string } = {
    'Ho Chi Minh City': 'TP Hồ Chí Minh',
    'Hanoi': 'Hà Nội',
    'Da Nang': 'Đà Nẵng',
    'Can Tho': 'Cần Thơ',
    'Haiphong': 'Hải Phòng',
    'Bien Hoa': 'Đồng Nai',
    'Hue': 'Thừa Thiên Huế',
    'Nha Trang': 'Khánh Hòa',
    'Buon Ma Thuot': 'Đắk Lắk',
    'Dalat': 'Lâm Đồng',
    'Vung Tau': 'Bà Rịa - Vũng Tàu',
    // Thêm các ánh xạ khác nếu cần
  };

  return cityNameMapping[openWeatherCityName] || openWeatherCityName;
};

// Thêm hàm dịch điều kiện thời tiết để có thể tái sử dụng
export const translateWeatherCondition = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  
  // Tìm khớp chính xác trước
  if (weatherConditionTranslations[lowerCondition]) {
    return weatherConditionTranslations[lowerCondition];
  }
  
  // Nếu không tìm thấy khớp chính xác, tìm từ khóa trong chuỗi
  for (const key in weatherConditionTranslations) {
    if (lowerCondition.includes(key)) {
      return weatherConditionTranslations[key];
    }
  }
  
  // Trả về chuỗi gốc nếu không tìm thấy bản dịch
  return capitalizeFirstLetter(condition);
}; 