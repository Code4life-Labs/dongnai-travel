import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { WeatherAPI } from "@/objects/weather/api";
import { vietnamCities, sampleDailyForecasts, getWeatherIcon, weatherConditionTranslations, capitalizeFirstLetter, findNearestCity, mapCityName } from "@/utils/locationData";

// Styles
import styles from "@/screens/weather/styles";
import { Styles } from "@/styles";

// Hooks
import { useLanguage } from "@/hooks/useLanguage";

// Components
import { FC } from "@/components";
import weatherImages from "@/assets/images/weather";

// Interface for weather data
interface WeatherItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  pop: number;
}

interface HourlyForecastProps {
  hour: number;
  icon: string;
  temp: number;
  isNow?: boolean;
}

interface DailyForecastProps {
  day: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  icon: string;
  precipitation: number;
}

// Function to translate weather conditions
const translateWeatherCondition = (condition: string): string => {
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

// Using data from utils
const WeatherScreen = () => {
  const { language } = useLanguage();
  const _languageData = (language.data as any)["homeScreen"] as any;
  
  const [weather, setWeather] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(
    vietnamCities.find(city => city.name === "Dong Nai") || vietnamCities[0]
  );
  
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchWeather = async (lat = selectedCity.lat, lon = selectedCity.lon) => {
    try {
      setLoading(true);
      const response = await WeatherAPI.getLocationWeather(lat, lon);
      if (response?.data?.data?.data) {
        const weatherData = response.data.data.data;
        
        // If city name doesn't match the list, find the nearest city
        if (weatherData.city && weatherData.city.coord) {
          const { lat, lon } = weatherData.city.coord;
          const nearestCity = findNearestCity(lat, lon);
          
          // Update city name if needed
          if (!vietnamCities.some(city => city.name === weatherData.city.name)) {
            weatherData.city.name = nearestCity.name;
          }
        }
        
        setWeather(weatherData);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWeather();
  }, [selectedCity]);

  const handleSelectCity = (city: any) => {
    setSelectedCity(city);
  };

  if (loading) {
    return <FC.Skeleton height="100%" />;
  }

  if (!weather || !weather.list || !weather.list[0] || !weather.city) {
    return (
      <FC.AppText>
        {_languageData["weather_error"][language.code] || "Unable to load weather"}
      </FC.AppText>
    );
  }

  const currentWeather = weather.list[0];

  // Add these date variables
  const date = new Date();
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const month = date.getMonth();
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  const dayOfWeekName = weekdays[dayOfWeek];
  const monthName = months[month];

  // Get hourly forecasts
  const hourlyForecasts = weather.list.slice(0, 8).map((item: any, index: number) => {
    const hour = new Date(item.dt * 1000).getHours();
    return {
      hour: hour,
      icon: getWeatherIcon(item.weather[0].main),
      temp: Math.round(item.main.temp),
      isNow: index === 0
    };
  });

  // Use sampleDailyForecasts instead of direct declaration
  const dailyForecasts = sampleDailyForecasts;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3949AB', '#5C6BC0', '#7986CB']}
        style={styles.gradient_container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menu_button}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="location" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.location_container}>
            <Text style={styles.location_text}>
              {weather?.city?.name ? mapCityName(weather.city.name) : selectedCity.name}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="chevron-down" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.current_weather}>
          <Text style={styles.current_temp}>{Math.round(currentWeather.main.temp)}°</Text>
          <Text style={styles.weather_condition}>
            {translateWeatherCondition(currentWeather.weather[0].description)}
          </Text>
          <Text style={styles.high_low_temp}>
            {Math.round(currentWeather.main.temp_max)}° / {Math.round(currentWeather.main.temp_min)}° Feels like {Math.round(currentWeather.main.feels_like)}°
          </Text>
        </View>

        <View style={styles.hourly_container}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourly_scroll}
          >
            {hourlyForecasts.map((forecast: any, index: number) => (
              <HourlyForecast 
                key={index}
                hour={forecast.hour}
                icon={forecast.icon}
                temp={forecast.temp}
                isNow={forecast.isNow}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.precipitation_container}>
          <View style={styles.precipitation_line}>
            {[3, 2, 4, 4].map((value, index) => (
              <View key={index} style={styles.precipitation_dot}>
                <Text style={styles.precipitation_value}>{value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.forecast_container}>
        <Text style={styles.forecast_title}>5-Day Forecast</Text>
        
        {dailyForecasts.map((forecast: any, index: number) => (
          <DailyForecast 
            key={index}
            day={forecast.day}
            condition={forecast.condition}
            highTemp={forecast.highTemp}
            lowTemp={forecast.lowTemp}
            icon={forecast.icon}
            precipitation={forecast.precipitation}
          />
        ))}
      </View>

      <CitySelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCity={handleSelectCity}
        cities={vietnamCities}
      />
    </ScrollView>
  );
};

const HourlyForecast = ({ hour, icon, temp, isNow = false }: HourlyForecastProps) => {
  const formatHour = (hour: number) => {
    if (hour === 0) return "0h";
    if (hour === 12) return "12h";
    return hour < 12 ? `${hour}h` : `${hour}h`;
  };

  return (
    <View style={styles.hourly_item}>
      <Text style={styles.hourly_time}>{isNow ? "Now" : formatHour(hour)}</Text>
      <Ionicons 
        name={icon as any} 
        size={28} 
        color="#FFF" 
        style={styles.hourly_icon}
      />
      <Text style={styles.hourly_temp}>{temp}°</Text>
    </View>
  );
};

const DailyForecast = ({ day, condition, highTemp, lowTemp, icon, precipitation }: DailyForecastProps) => {
  return (
    <View style={styles.daily_item}>
      <Text style={styles.daily_day}>{day}</Text>
      <View style={styles.daily_icon_container}>
        <Ionicons name={icon as any} size={24} color="#333" />
        <Text style={styles.daily_precipitation}>{precipitation}%</Text>
      </View>
      <View style={styles.daily_temp_container}>
        <Text style={styles.daily_high}>{highTemp}°</Text>
        <View style={styles.temp_bar_container}>
          <View style={[styles.temp_bar, { width: `${(highTemp - lowTemp) * 5}%` }]} />
        </View>
        <Text style={styles.daily_low}>{lowTemp}°</Text>
      </View>
    </View>
  );
};

// Component for city selection modal
const CitySelectionModal = ({ visible, onClose, onSelectCity, cities }: { visible: boolean, onClose: () => void, onSelectCity: (city: any) => void, cities: any[] }) => {
  const [searchText, setSearchText] = useState('');
  
  // Sort the list with Dong Nai at the top
  const sortedCities = React.useMemo(() => {
    return [...cities].sort((a, b) => {
      if (a.name === "Dong Nai") return -1;
      if (b.name === "Dong Nai") return 1;
      return a.name.localeCompare(b.name);
    });
  }, [cities]);
  
  const filteredCities = sortedCities.filter(city => 
    city.name.toLowerCase().includes(searchText.toLowerCase())
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select City</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a city..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.cityItem,
                  item.name === "Dong Nai" && styles.highlightedCityItem
                ]}
                onPress={() => {
                  onSelectCity(item);
                  onClose();
                }}
              >
                <Text 
                  style={[
                    styles.cityName,
                    item.name === "Dong Nai" && styles.highlightedCityName
                  ]}
                >
                  {item.name}
                </Text>
                <Ionicons 
                  name="location" 
                  size={16} 
                  color={item.name === "Dong Nai" ? "#3949AB" : "#666"} 
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default WeatherScreen;