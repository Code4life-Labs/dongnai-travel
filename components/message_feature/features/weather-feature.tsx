import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../message-feature-styles';
import { WeatherFeatureProps } from '../types';
import { weatherIcons } from '@/utils/mapdata';

/**
 * Component hiển thị thông tin thời tiết
 */
const WeatherFeature: React.FC<WeatherFeatureProps> = ({ weatherData }) => {
  if (!weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#3498db" />
      </View>
    );
  }

  const { current, daily } = weatherData;
  const currentWeather = current.weather[0];
  const iconName = weatherIcons[currentWeather.icon] || 'weather-sunny';

  // Dữ liệu cho dự báo thời tiết
  const forecastData = daily.slice(0, 5);

  return (
    <View style={styles.weatherContainer}>
      {/* Thông tin thời tiết hiện tại */}
      <Text style={localStyles.weatherHeaderText}>Thời tiết hiện tại</Text>
      
      <View style={localStyles.weatherCurrentContainer}>
        <View style={localStyles.weatherCurrentInfo}>
          <Text style={localStyles.weatherCurrentTemp}>{Math.round(current.temp)}°C</Text>
          <Text style={localStyles.weatherDescription}>{currentWeather.description}</Text>
          
          <View style={localStyles.weatherExtraInfo}>
            <View style={localStyles.weatherExtraItem}>
              <MaterialCommunityIcons name="water-percent" size={18} color="#3498db" />
              <Text style={localStyles.weatherExtraText}>{current.humidity}%</Text>
            </View>
            <View style={localStyles.weatherExtraItem}>
              <MaterialCommunityIcons name="weather-windy" size={18} color="#3498db" />
              <Text style={localStyles.weatherExtraText}>{Math.round(current.wind_speed * 3.6)} km/h</Text>
            </View>
          </View>
        </View>
        
        <View style={localStyles.weatherIconContainer}>
          <MaterialCommunityIcons name={iconName} size={64} color="#3498db" />
        </View>
      </View>
      
      {/* Dự báo trong những ngày tới */}
      <Text style={localStyles.weatherForecastTitle}>Dự báo 5 ngày tới</Text>
      <View style={localStyles.weatherForecastContainer}>
        {forecastData.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const dayName = new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date);
          const dayIcon = weatherIcons[day.weather[0].icon] || 'weather-sunny';
          
          return (
            <View key={index} style={localStyles.forecastDay}>
              <Text style={localStyles.forecastDayName}>{dayName}</Text>
              <MaterialCommunityIcons name={dayIcon} size={24} color="#3498db" />
              <Text style={localStyles.forecastTemp}>{Math.round(day.temp.max)}°C</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Styles cục bộ cho component
const localStyles = StyleSheet.create({
  weatherHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  weatherCurrentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 12,
  },
  weatherCurrentInfo: {
    flex: 1,
  },
  weatherCurrentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  weatherExtraInfo: {
    flexDirection: 'row',
    marginTop: 4,
  },
  weatherExtraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  weatherExtraText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  weatherIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  weatherForecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  weatherForecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 12,
  },
  forecastDay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  forecastDayName: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#333',
  }
});

export default WeatherFeature; 