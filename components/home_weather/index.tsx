import * as React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Import component
import AppText from "../app_text";
import Skeleton from "../skeleton";
import { RectangleButton } from "../buttons";

// Import hooks
import { useLanguage } from "@/hooks/useLanguage";

// Import objects
import { WeatherAPI } from "@/objects/weather/api";

// Import utils
import {
  getWeatherIcon,
  translateWeatherCondition,
  mapCityName,
} from "@/utils/locationData";

// Import styles
import { styles } from "./styles";

interface WeatherData {
  list: Array<{
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
  city: {
    name: string;
  };
}

export const HomeWeather = React.memo(() => {
  const router = useRouter();
  const { language } = useLanguage();
  
  const _languageData = React.useMemo(
    () => (language.data as any)["homeScreen"] as any,
    [language.data]
  );

  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchWeather = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await WeatherAPI.getDongNaiWeather();
      if (response?.data?.data?.data) {
        setWeather(response.data.data.data);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handlePress = React.useCallback(() => {
    router.push("/home/weather");
  }, [router]);

  if (loading) {
    return <Skeleton height="80" />;
  }

  if (!weather?.list?.[0] || !weather?.city) {
    return (
      <View style={[styles.temperature_banner, styles.errorContainer]}>
        <AppText>{_languageData["weather_error"][language.code]}</AppText>
      </View>
    );
  }

  const currentWeather = weather.list[0];
  const temperature = Math.round(currentWeather.main.temp);
  const humidity = Math.round(currentWeather.main.humidity);
  const windSpeed = Math.round(currentWeather.wind.speed);
  const weatherIcon = getWeatherIcon(currentWeather.weather[0].main);
  const cityName = mapCityName(weather.city.name);
  const weatherDescription = translateWeatherCondition(currentWeather.weather[0].description);

  return (
    <RectangleButton
      style={[styles.temperature_banner, styles.weatherContainer]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Temperature section */}
      <View style={styles.temperatureSection}>
        <AppText size="h2" weight="bolder" style={styles.temperatureText}>
          {temperature}°C
        </AppText>
        <Ionicons name={weatherIcon} size={32} color="#1E88E5" />
      </View>

      {/* Weather info section */}
      <View style={styles.weatherInfoSection}>
        <AppText style={styles.cityName}>
          {cityName}
        </AppText>
        <AppText style={styles.weatherDescription}>
          {weatherDescription}
        </AppText>

        {/* Additional metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Ionicons
              name="water-outline"
              size={16}
              color="#424242"
              style={styles.metricIcon}
            />
            <AppText style={styles.metricText}>
              {humidity}%
            </AppText>
          </View>
          <View style={styles.metricItem}>
            <Ionicons
              name="speedometer-outline"
              size={16}
              color="#424242"
              style={styles.metricIcon}
            />
            <AppText style={styles.metricText}>
              {windSpeed}m/s
            </AppText>
          </View>
        </View>
      </View>

      {/* Arrow icon */}
      <Ionicons name="chevron-forward" size={24} color="#1E88E5" />
    </RectangleButton>
  );
});

HomeWeather.displayName = 'HomeWeather';
