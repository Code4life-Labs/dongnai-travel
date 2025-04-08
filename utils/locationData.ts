// Complete list of 63 provinces and cities in Vietnam with coordinates
export const vietnamCities = [
  // Direct-controlled municipalities
  { name: "Hanoi", lat: 21.0285, lon: 105.8542 },
  { name: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297 },
  { name: "Da Nang", lat: 16.0544, lon: 108.2022 },
  { name: "Hai Phong", lat: 20.8449, lon: 106.6881 },
  { name: "Can Tho", lat: 10.0452, lon: 105.7469 },
  
  // Northern provinces
  { name: "Bac Giang", lat: 21.2771, lon: 106.1947 },
  { name: "Bac Kan", lat: 22.1477, lon: 105.8349 },
  { name: "Bac Ninh", lat: 21.1861, lon: 106.0763 },
  { name: "Cao Bang", lat: 22.6666, lon: 106.2639 },
  { name: "Dien Bien", lat: 21.3856, lon: 103.0321 },
  { name: "Ha Giang", lat: 22.8268, lon: 104.9886 },
  { name: "Ha Nam", lat: 20.5464, lon: 105.9219 },
  { name: "Hai Duong", lat: 20.9373, lon: 106.3145 },
  { name: "Hoa Binh", lat: 20.8133, lon: 105.3383 },
  { name: "Hung Yen", lat: 20.6464, lon: 106.0511 },
  { name: "Lai Chau", lat: 22.3964, lon: 103.4716 },
  { name: "Lang Son", lat: 21.8530, lon: 106.7610 },
  { name: "Lao Cai", lat: 22.4856, lon: 103.9723 },
  { name: "Nam Dinh", lat: 20.4338, lon: 106.1621 },
  { name: "Ninh Binh", lat: 20.2580, lon: 105.9753 },
  { name: "Phu Tho", lat: 21.3989, lon: 105.1682 },
  { name: "Quang Ninh", lat: 21.0064, lon: 107.2925 },
  { name: "Son La", lat: 21.1024, lon: 103.7289 },
  { name: "Thai Binh", lat: 20.4461, lon: 106.3368 },
  { name: "Thai Nguyen", lat: 21.5942, lon: 105.8481 },
  { name: "Tuyen Quang", lat: 21.7767, lon: 105.2280 },
  { name: "Vinh Phuc", lat: 21.3609, lon: 105.5474 },
  { name: "Yen Bai", lat: 21.7226, lon: 104.9087 },
  
  // Central provinces
  { name: "Binh Dinh", lat: 13.7695, lon: 109.2235 },
  { name: "Binh Thuan", lat: 10.9804, lon: 108.2622 },
  { name: "Dak Lak", lat: 12.6724, lon: 108.0377 },
  { name: "Dak Nong", lat: 12.0045, lon: 107.6870 },
  { name: "Gia Lai", lat: 13.9808, lon: 108.0151 },
  { name: "Ha Tinh", lat: 18.3554, lon: 105.8877 },
  { name: "Khanh Hoa", lat: 12.2388, lon: 109.1967 },
  { name: "Kon Tum", lat: 14.3544, lon: 108.0081 },
  { name: "Lam Dong", lat: 11.9404, lon: 108.4583 },
  { name: "Nghe An", lat: 18.6734, lon: 105.6922 },
  { name: "Ninh Thuan", lat: 11.5675, lon: 108.9980 },
  { name: "Phu Yen", lat: 13.0881, lon: 109.0928 },
  { name: "Quang Binh", lat: 17.4682, lon: 106.6221 },
  { name: "Quang Nam", lat: 15.5394, lon: 108.0191 },
  { name: "Quang Ngai", lat: 15.1213, lon: 108.8048 },
  { name: "Quang Tri", lat: 16.7943, lon: 107.0451 },
  { name: "Thanh Hoa", lat: 19.8066, lon: 105.7852 },
  { name: "Thua Thien Hue", lat: 16.4637, lon: 107.5909 },
  
  // Southern provinces
  { name: "An Giang", lat: 10.3864, lon: 105.4351 },
  { name: "Ba Ria - Vung Tau", lat: 10.3461, lon: 107.0834 },
  { name: "Bac Lieu", lat: 9.2940, lon: 105.7216 },
  { name: "Ben Tre", lat: 10.2433, lon: 106.3756 },
  { name: "Binh Duong", lat: 11.1874, lon: 106.6514 },
  { name: "Binh Phuoc", lat: 11.7511, lon: 106.7237 },
  { name: "Ca Mau", lat: 9.1527, lon: 105.1967 },
  { name: "Dong Nai", lat: 10.9508, lon: 106.8221 },
  { name: "Dong Thap", lat: 10.4938, lon: 105.6882 },
  { name: "Hau Giang", lat: 9.7579, lon: 105.6413 },
  { name: "Kien Giang", lat: 10.0124, lon: 105.0809 },
  { name: "Long An", lat: 10.5451, lon: 106.4113 },
  { name: "Soc Trang", lat: 9.6037, lon: 105.9739 },
  { name: "Tay Ninh", lat: 11.3351, lon: 106.1098 },
  { name: "Tien Giang", lat: 10.3493, lon: 106.3715 },
  { name: "Tra Vinh", lat: 9.9513, lon: 106.3346 },
  { name: "Vinh Long", lat: 10.2537, lon: 105.9722 }
];

// Weather condition translations
export const weatherConditionTranslations: { [key: string]: string } = {
  'clear': 'Clear sky',
  'clouds': 'Cloudy',
  'rain': 'Rain',
  'drizzle': 'Drizzle',
  'thunderstorm': 'Thunderstorm',
  'snow': 'Snow',
  'mist': 'Mist',
  'smoke': 'Smoke',
  'haze': 'Haze',
  'dust': 'Dust',
  'fog': 'Fog',
  'sand': 'Sand',
  'ash': 'Ash',
  'squall': 'Squall',
  'tornado': 'Tornado',
  'partly cloudy': 'Partly cloudy',
  'overcast clouds': 'Overcast clouds',
  'broken clouds': 'Broken clouds',
  'scattered clouds': 'Scattered clouds',
  'few clouds': 'Few clouds',
  'light rain': 'Light rain',
  'moderate rain': 'Moderate rain',
  'heavy rain': 'Heavy rain',
  'shower rain': 'Shower rain',
};

// Sample daily weather forecast data in English
export const sampleDailyForecasts = [
  { day: "Yesterday", highTemp: 84, lowTemp: 68, icon: "sunny", precipitation: 0, condition: "Clear sky" },
  { day: "Today", highTemp: 77, lowTemp: 63, icon: "partly-sunny", precipitation: 9, condition: "Partly cloudy" },
  { day: "Tomorrow", highTemp: 75, lowTemp: 62, icon: "partly-sunny", precipitation: 10, condition: "Partly cloudy" },
  { day: "Wednesday", highTemp: 73, lowTemp: 60, icon: "rainy", precipitation: 30, condition: "Rain" },
  { day: "Thursday", highTemp: 70, lowTemp: 58, icon: "rainy", precipitation: 40, condition: "Rain" },
];

// Function to get weather icon based on condition
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

// Function to capitalize first letter
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function to find nearest city based on coordinates
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

// Function to calculate distance between two coordinate points (Haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Function to convert degrees to radians
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Map city names from OpenWeather to Vietnamese names
export const mapCityName = (openWeatherCityName: string): string => {
  // Mapping of city names from OpenWeather to Vietnamese names
  const cityNameMapping: { [key: string]: string } = {
    'Ho Chi Minh City': 'Ho Chi Minh City',
    'Hanoi': 'Hanoi',
    'Da Nang': 'Da Nang',
    'Can Tho': 'Can Tho',
    'Haiphong': 'Hai Phong',
    'Bien Hoa': 'Dong Nai',
    'Hue': 'Thua Thien Hue',
    'Nha Trang': 'Khanh Hoa',
    'Buon Ma Thuot': 'Dak Lak',
    'Dalat': 'Lam Dong',
    'Vung Tau': 'Ba Ria - Vung Tau',
    // Add more mappings if needed
  };

  return cityNameMapping[openWeatherCityName] || openWeatherCityName;
};

// Function to translate weather conditions for reuse
export const translateWeatherCondition = (condition: string): string => {
  const lowerCondition = condition.toLowerCase();
  
  // Look for exact match first
  if (weatherConditionTranslations[lowerCondition]) {
    return weatherConditionTranslations[lowerCondition];
  }
  
  // If no exact match, look for keywords in the string
  for (const key in weatherConditionTranslations) {
    if (lowerCondition.includes(key)) {
      return weatherConditionTranslations[key];
    }
  }
  
  // Return original string if no translation found
  return capitalizeFirstLetter(condition);
}; 