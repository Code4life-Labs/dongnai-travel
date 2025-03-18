import axios from "axios";

export class WeatherUtils {
  static baseURL = process.env.EXPO_PUBLIC_DONGNAITRAVEL_API_URL!;

  static async getWeather() {
    console.log("API:", this.baseURL);

    const response = await axios.get(
      `${this.baseURL}/weather`
    ).catch((error) => {
      console.log("Error-getWeather:", error);
    });
    console.log("Response:", response);
    return response;
  }
}