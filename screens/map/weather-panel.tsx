import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@/hooks/useTheme';
import { WeatherData } from '@/declarations.d';
import { WEATHER_ICONS } from '@/objects/map/constants';
import moment from 'moment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WeatherPanelProps {
  weather?: WeatherData;
  onClose: () => void;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather, onClose }) => {
  const { theme } = useTheme();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!weather || !weather.current) {
    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Thời tiết</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.textLight }]}>
            Đang tải thông tin thời tiết...
          </Text>
        </View>
      </View>
    );
  }

  const { current, forecast, location } = weather;
  
  // Chọn dữ liệu thời tiết hiện tại hoặc dự báo dựa trên selectedDayIndex
  const selectedWeather = selectedDayIndex === 0 ? current : forecast?.[selectedDayIndex - 1];
  const weatherIcon = selectedWeather?.weather?.[0]?.icon || '01d';
  const iconName = (weatherIcon in WEATHER_ICONS) 
    ? WEATHER_ICONS[weatherIcon as keyof typeof WEATHER_ICONS] 
    : 'weather-sunny';

  // Format thời gian mặt trời mọc/lặn
  const formatSunTime = (timestamp: number) => {
    return moment(timestamp * 1000).format('HH:mm');
  };

  return (
    <BottomSheetScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: theme.card }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Thời tiết</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Location */}
      {location && (
        <Text style={[styles.locationText, { color: theme.textLight }]}>
          {location.name}, {location.country}
        </Text>
      )}

      {/* Day selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelector}
      >
        <TouchableOpacity 
          style={[
            styles.daySelectorItem, 
            selectedDayIndex === 0 && styles.selectedDaySelectorItem
          ]}
          onPress={() => setSelectedDayIndex(0)}
        >
          <Text style={[
            styles.daySelectorText, 
            { color: selectedDayIndex === 0 ? theme.onPrimary : theme.text }
          ]}>
            Hôm nay
          </Text>
        </TouchableOpacity>
        
        {forecast && forecast.map((day: any, index: number) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.daySelectorItem, 
              selectedDayIndex === index + 1 && styles.selectedDaySelectorItem
            ]}
            onPress={() => setSelectedDayIndex(index + 1)}
          >
            <Text style={[
              styles.daySelectorText, 
              { color: selectedDayIndex === index + 1 ? theme.onPrimary : theme.text }
            ]}>
              {moment(day.dt * 1000).format('DD/MM')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Current Weather */}
      <View style={styles.weatherMainContainer}>
        {selectedDayIndex === 0 && current.sunrise && current.sunset && (
          <View style={styles.sunriseSunsetContainer}>
            <View style={styles.sunriseContainer}>
              <MaterialCommunityIcons 
                name="weather-sunset-up" 
                size={45} 
                color={theme.primary} 
                style={styles.sunriseImage} 
              />
              <Text style={[styles.sunriseText, { color: theme.text }]}>
                {formatSunTime(current.sunrise)}
              </Text>
              <Text style={[styles.sunriseLabel, { color: theme.textLight }]}>
                Bình minh
              </Text>
            </View>
            
            <View style={styles.weatherIconContainer}>
              <MaterialCommunityIcons 
                name={iconName} 
                size={100} 
                color={theme.primary} 
                style={styles.weatherIcon}
              />
              <Text style={[styles.temperature, { color: theme.text }]}>
                {Math.round(selectedWeather.temp)}°C
              </Text>
              <Text style={[styles.weatherDescription, { color: theme.text }]}>
                {selectedWeather.weather[0]?.description || 'Thời tiết hiện tại'}
              </Text>
            </View>
            
            <View style={styles.sunsetContainer}>
              <MaterialCommunityIcons 
                name="weather-sunset-down" 
                size={45} 
                color={theme.primary} 
                style={styles.sunsetImage} 
              />
              <Text style={[styles.sunsetText, { color: theme.text }]}>
                {formatSunTime(current.sunset)}
              </Text>
              <Text style={[styles.sunsetLabel, { color: theme.textLight }]}>
                Hoàng hôn
              </Text>
            </View>
          </View>
        )}
        
        {selectedDayIndex !== 0 && (
          <View style={styles.forecastMainContainer}>
            <MaterialCommunityIcons 
              name={iconName} 
              size={100} 
              color={theme.primary} 
              style={styles.weatherIcon}
            />
            <Text style={[styles.temperature, { color: theme.text }]}>
              {Math.round(selectedWeather.temp.day)}°C
            </Text>
            <Text style={[styles.weatherDescription, { color: theme.text }]}>
              {selectedWeather.weather[0]?.description || 'Dự báo thời tiết'}
            </Text>
            <Text style={[styles.forecastDate, { color: theme.textLight }]}>
              {moment(selectedWeather.dt * 1000).format('dddd, DD/MM/YYYY')}
            </Text>
          </View>
        )}
      </View>

      {/* Weather Details */}
      <View style={styles.weatherDetailsContainer}>
        <View style={styles.weatherDetailRow}>
          <View style={styles.weatherDetailItem}>
            <MaterialCommunityIcons name="water-percent" size={24} color={theme.primary} />
            <View style={styles.weatherDetailTextContainer}>
              <Text style={[styles.weatherDetailLabel, { color: theme.textLight }]}>Độ ẩm</Text>
              <Text style={[styles.weatherDetailValue, { color: theme.text }]}>
                {selectedDayIndex === 0 ? current.humidity : selectedWeather.humidity}%
              </Text>
            </View>
          </View>
          
          <View style={styles.weatherDetailItem}>
            <MaterialCommunityIcons name="weather-windy" size={24} color={theme.primary} />
            <View style={styles.weatherDetailTextContainer}>
              <Text style={[styles.weatherDetailLabel, { color: theme.textLight }]}>Gió</Text>
              <Text style={[styles.weatherDetailValue, { color: theme.text }]}>
                {selectedDayIndex === 0 ? current.wind_speed : selectedWeather.wind_speed} m/s
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.weatherDetailRow}>
          <View style={styles.weatherDetailItem}>
            <Feather name="droplet" size={24} color={theme.primary} />
            <View style={styles.weatherDetailTextContainer}>
              <Text style={[styles.weatherDetailLabel, { color: theme.textLight }]}>Lượng mưa</Text>
              <Text style={[styles.weatherDetailValue, { color: theme.text }]}>
                {selectedDayIndex === 0 
                  ? (current.rain?.['1h'] || 0) 
                  : (selectedWeather.rain || 0)} mm
              </Text>
            </View>
          </View>
          
          <View style={styles.weatherDetailItem}>
            <MaterialCommunityIcons name="gauge" size={24} color={theme.primary} />
            <View style={styles.weatherDetailTextContainer}>
              <Text style={[styles.weatherDetailLabel, { color: theme.textLight }]}>Áp suất</Text>
              <Text style={[styles.weatherDetailValue, { color: theme.text }]}>
                {selectedDayIndex === 0 ? current.pressure : selectedWeather.pressure} hPa
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Temperature Min Max for Forecast */}
      {selectedDayIndex !== 0 && (
        <View style={styles.minMaxContainer}>
          <View style={styles.minMaxItem}>
            <MaterialCommunityIcons name="thermometer-low" size={24} color={theme.primary} />
            <Text style={[styles.minMaxLabel, { color: theme.textLight }]}>Thấp nhất</Text>
            <Text style={[styles.minMaxValue, { color: theme.text }]}>
              {Math.round(selectedWeather.temp.min)}°C
            </Text>
          </View>
          
          <View style={styles.minMaxItem}>
            <MaterialCommunityIcons name="thermometer-high" size={24} color={theme.primary} />
            <Text style={[styles.minMaxLabel, { color: theme.textLight }]}>Cao nhất</Text>
            <Text style={[styles.minMaxValue, { color: theme.text }]}>
              {Math.round(selectedWeather.temp.max)}°C
            </Text>
          </View>
        </View>
      )}

      {/* Hourly Forecast */}
      {selectedDayIndex === 0 && weather.hourly && (
        <View style={styles.hourlyForecastContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Dự báo theo giờ
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyForecastList}
          >
            {weather.hourly.slice(0, 24).map((hour: any, index: number) => {
              const hourIcon = hour.weather[0]?.icon || '01d';
              const hourIconName = (hourIcon in WEATHER_ICONS)
                ? WEATHER_ICONS[hourIcon as keyof typeof WEATHER_ICONS]
                : 'weather-sunny';
              
              return (
                <View key={index} style={styles.hourlyForecastItem}>
                  <Text style={[styles.hourlyForecastTime, { color: theme.text }]}>
                    {moment(hour.dt * 1000).format('HH:mm')}
                  </Text>
                  <MaterialCommunityIcons 
                    name={hourIconName} 
                    size={24} 
                    color={theme.primary} 
                  />
                  <Text style={[styles.hourlyForecastTemp, { color: theme.text }]}>
                    {Math.round(hour.temp)}°C
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Daily Forecast */}
      {forecast && forecast.length > 0 && (
        <View style={styles.dailyForecastContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Dự báo 7 ngày tới
          </Text>
          <View style={styles.dailyForecastList}>
            {forecast.map((day: any, index: number) => {
              const dayIcon = day.weather[0]?.icon || '01d';
              const dayIconName = (dayIcon in WEATHER_ICONS)
                ? WEATHER_ICONS[dayIcon as keyof typeof WEATHER_ICONS]
                : 'weather-sunny';
              
              return (
                <View key={index} style={styles.dailyForecastItem}>
                  <Text style={[styles.dailyForecastDay, { color: theme.text, width: 100 }]}>
                    {moment(day.dt * 1000).format('dddd')}
                  </Text>
                  <MaterialCommunityIcons 
                    name={dayIconName} 
                    size={24} 
                    color={theme.primary} 
                  />
                  <View style={styles.dailyForecastTempContainer}>
                    <Text style={[styles.dailyForecastTempMin, { color: theme.textLight }]}>
                      {Math.round(day.temp.min)}°
                    </Text>
                    <View style={[styles.dailyForecastTempBar, { backgroundColor: theme.border }]}>
                      <View 
                        style={[
                          styles.dailyForecastTempBarFill, 
                          { 
                            backgroundColor: theme.primary,
                            width: `${((day.temp.max - day.temp.min) / 40) * 100}%`
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.dailyForecastTempMax, { color: theme.text }]}>
                      {Math.round(day.temp.max)}°
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  daySelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  daySelectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  selectedDaySelectorItem: {
    backgroundColor: '#FF5722',
  },
  daySelectorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  weatherMainContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sunriseSunsetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sunriseContainer: {
    alignItems: 'center',
  },
  sunsetContainer: {
    alignItems: 'center',
  },
  sunriseImage: {
    width: 45,
    height: 45,
  },
  sunsetImage: {
    width: 45,
    height: 45,
  },
  sunriseText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  sunsetText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  sunriseLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sunsetLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  weatherIconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    marginBottom: -20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 16,
    textTransform: 'capitalize',
    textAlign: 'center',
    marginTop: 8,
  },
  forecastMainContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  forecastDate: {
    fontSize: 14,
    marginTop: 8,
  },
  weatherDetailsContainer: {
    padding: 20,
    marginTop: 10,
  },
  weatherDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  weatherDetailTextContainer: {
    marginLeft: 12,
  },
  weatherDetailLabel: {
    fontSize: 14,
  },
  weatherDetailValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  minMaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  minMaxItem: {
    alignItems: 'center',
  },
  minMaxLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  minMaxValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  hourlyForecastContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  hourlyForecastList: {
    paddingBottom: 10,
  },
  hourlyForecastItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 60,
  },
  hourlyForecastTime: {
    fontSize: 14,
    marginBottom: 8,
  },
  hourlyForecastTemp: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  dailyForecastContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dailyForecastList: {
    marginBottom: 16,
  },
  dailyForecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyForecastDay: {
    fontSize: 14,
    fontWeight: '500',
  },
  dailyForecastTempContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  dailyForecastTempMin: {
    fontSize: 14,
    width: 30,
    textAlign: 'right',
  },
  dailyForecastTempBar: {
    height: 4,
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 2,
  },
  dailyForecastTempBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  dailyForecastTempMax: {
    fontSize: 14,
    width: 30,
  },
});

export default WeatherPanel; 