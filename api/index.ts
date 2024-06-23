import axios, { AxiosError, AxiosInstance } from "axios";
import { BASE_API_URL, CallBackInterceptorObject } from "./config";
//Import from utils
import { LocalStorageUtils } from "@/utils/local-storage";

class BaseAPI {
  private api = axios.create({
    baseURL: BASE_API_URL,
  });

  public getApiInstance() {
    return this.api;
  }
}

class BaseAPIBuilder {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async handleResponseInterceptor(error: AxiosError) {
    // Thiết lập interceptor response
    // Xử lý lỗi phản hồi, ví dụ như Unauthorized (401)
    if (error.response?.status === 401) {
      console.error('Unauthorized error:', error);
      // Xử lý 401 Unauthorized ở đây, ví dụ clear token
      await LocalStorageUtils.clearToken();
      // xử lý disptach logout
      // dispatch(logOut..)..
    }
    return Promise.reject(error);
  }

  buildInterceptor(type: 'request' | 'response', obj: CallBackInterceptorObject) {
    return this.api.interceptors[type].use(
      obj.cbConfig ? ((config) => obj.cbConfig && obj.cbConfig(config)) : (config => config),
      obj.cbError ? ((error) => obj.cbError && obj.cbError(error)) : (error => Promise.reject(error))
    )
  };

  start() {
    // default settings for cacth error handling when response.
    this.buildInterceptor('response', {
      cbError: this.handleResponseInterceptor
    });
  }
}

class CommonInterceptor {
  static async authorization(config: any) {
    const token = await LocalStorageUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  // static async notifSnackBar(response: any) {
  //   if (response) {
  //     // ... dispatchEvents(response.success)
  //   }
  //   return response;
  // }
}

const baseApi = new BaseAPI();
const baseAPIBuilder = new BaseAPIBuilder(baseApi.getApiInstance());
baseAPIBuilder.start();
export default baseAPIBuilder;
