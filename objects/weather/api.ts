import { API } from "@/classes/API";
import axios from "axios";

const api = new API({
  baseURL: process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL
});

export const WeatherAPI = {
  getDongNaiWeather: async () => {
    try {
      return await api.get("/weather/dongnai");
    } catch (error) {
      console.error("Error-getDongNaiWeather:", error);
      throw error;
    }
  },

  getLocationWeather: async (lat: number, lon: number) => {
    try {
      return await api.get(`/weather/location?lat=${lat}&lon=${lon}`);
    } catch (error) {
      console.error("Error-getLocationWeather:", error);
      throw error;
    }
  },

  getWeatherByCoordinates: async (lat: number, lon: number) => {
    try {
      return await api.get(`/weather/location?lat=${lat}&lon=${lon}`);
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      throw error;
    }
  }
};    