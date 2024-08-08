import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { USER_TOKEN } from "./config";


export class APIUtils {
  /**
   * @example
      const result = await saveToken('value');

      if (result) {
        console.log('Save token successfully!');
      } else {
        console.log('Failed to save token.');
      }
   */
  static async saveTokenStorage(token: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(`@${USER_TOKEN}:key`, token);
      return true;
    } catch (error) {
      console.error('Error saving token to AsyncStorage:', error);
      return false;
    }
  };

  /**
   * 
   * @example
      await clearToken();
   */
  static async clearTokenStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem(`@${USER_TOKEN}:key`);
    } catch (error) {
      console.error('Error clearing token from AsyncStorage:', error);
    }
  };

  /**
   * 
   * @example
      const result = await getToken();

      if (result) {
        console.log('Get token successfully!');
      } else {
        console.log('Failed to get token.');
      }
   */
  static async getTokenStorage(): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(`@${USER_TOKEN}:key`);
      if (value !== null) {
        return value;
      }
      return '';
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
      return '';
    }
  };
}

export class CommonConfigInterceptor {
  static async authorization(config: any) {
    const token = await APIUtils.getTokenStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  static async errorResponse(error: AxiosError) {
    // Thiết lập interceptor response
    // Xử lý lỗi phản hồi, ví dụ như Unauthorized (401)
    if (error.response?.status === 401) {
      console.error('Unauthorized error:', error);
      // Xử lý 401 Unauthorized ở đây, ví dụ clear token
      await APIUtils.clearTokenStorage();
      // xử lý disptach logout
      // dispatch(logOut..)..
    }
    return Promise.reject(error);
  }

  // static async notifSnackBar(response: any) {
  //   if (response) {
  //     // ... dispatchEvents(response.success)
  //   }
  //   return response;
  // }
}