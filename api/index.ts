import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "./config";
import { clearToken, getToken } from "@/utils/local_storage";

export class BaseAPI {
  private token: string | null = null;
  private api = axios.create({
    baseURL: BASE_API_URL,
  });

  constructor() {
    this.setupInterceptors();
  }

  private async setupInterceptors() {
    try {
      // Lấy token từ AsyncStorage
      this.token = await getToken();

      // Thiết lập interceptor request
      this.api.interceptors.request.use(
        (config) => {
          if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Thiết lập interceptor response
      this.api.interceptors.response.use(
        (response) => {
          // Xử lý dữ liệu phản hồi thành công
          return response;
        },
        async (error: AxiosError) => {
          // Xử lý lỗi phản hồi, ví dụ như Unauthorized (401)
          if (error.response?.status === 401) {
            console.error('Unauthorized error:', error);
            // Xử lý 401 Unauthorized ở đây, ví dụ clear token
            await clearToken();
            // xử lý disptach logout
            // dispatch(logOut..)..
          }
          return Promise.reject(error);
        }
      );
    } catch (error) {
      console.error('Error setting up interceptors:', error);
    }
  }

  public getApiInstance() {
    return this.api;
  }
}

export const baseApi = new BaseAPI()


