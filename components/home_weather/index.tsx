import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import { FC } from "@/components";
import { WeatherAPI } from "@/objects/weather/api";
import { useLanguage } from "@/hooks/useLanguage";
import { styles } from "./styles";
import { getWeatherIcon, translateWeatherCondition, mapCityName } from "@/utils/locationData";

export const HomeWeather = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const _languageData = (language.data as any)["homeScreen"] as any;
  
  const [weather, setWeather] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await WeatherAPI.getDongNaiWeather();
      if (response?.data?.data?.data) {
        setWeather(response.data.data.data);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return <FC.Skeleton height="65%" />;
  }

  if (!weather || !weather.list || !weather.list[0] || !weather.city) {
    return (
      <FC.AppText>
        {_languageData["weather_error"][language.code] || "Unable to load weather"}
      </FC.AppText>
    );
  }

  const currentWeather = weather.list[0];
  
  return (
    <TouchableOpacity 
      style={[
        styles.temperature_banner,
        { flexDirection: 'row', alignItems: 'center', padding: 16 }
      ]}
      onPress={() => router.push("/(app)/(main)/home/weather")}
      activeOpacity={0.7}
    >
      {/* Phần nhiệt độ */}
      <View style={{ flex: 0.3, alignItems: 'center' }}>
        <FC.AppText size="h2" style={{ fontWeight: "600", color: "#0D47A1" }}>
          {Math.round(currentWeather.main.temp)}°C
        </FC.AppText>
        <Ionicons 
          name={getWeatherIcon(currentWeather.weather[0].main)} 
          size={32} 
          color="#1E88E5"
        />
      </View>

      {/* Phần thông tin thời tiết */}
      <View style={{ flex: 0.7, paddingHorizontal: 12 }}>
        <FC.AppText style={{ color: "#1565C0", fontSize: 16, fontWeight: '500', marginBottom: 4 }}>
          {mapCityName(weather.city.name)}
        </FC.AppText>
        <FC.AppText style={{ color: "#1E88E5", fontSize: 14 }}>
          {translateWeatherCondition(currentWeather.weather[0].description)}
        </FC.AppText>
        
        {/* Các chỉ số phụ */}
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Ionicons 
              name="water-outline" 
              size={16} 
              color="#424242" 
              style={{ marginRight: 4 }}
            />
            <FC.AppText style={{ color: "#424242", fontSize: 12 }}>
              {Math.round(currentWeather.main.humidity)}%
            </FC.AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons 
              name="speedometer-outline" 
              size={16} 
              color="#424242" 
              style={{ marginRight: 4 }}
            />
            <FC.AppText style={{ color: "#424242", fontSize: 12 }}>
              {Math.round(currentWeather.wind.speed)}m/s
            </FC.AppText>
          </View>
        </View>
      </View>

      {/* Icon mũi tên */}
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color="#1E88E5"
      />
    </TouchableOpacity>
  );
};
