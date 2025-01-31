import axios from "axios";

// Import from utils
import { StringUtils } from "@/utils/string";

// Import types
import type {
  Axios,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInterceptorOptions,
} from "axios";

type _AxiosInterceptor = {
  request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
  response: AxiosInterceptorManager<AxiosResponse>;
};

type _KindOfOnFulfilled = {
  request: (
    value: InternalAxiosRequestConfig<any>
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  response: (
    value: AxiosResponse<any, any>
  ) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>;
};

let _instance: API | null = null;

/**
 * An singleton class of API
 */
export class API {
  private _http!: Axios;

  constructor(config?: AxiosRequestConfig) {
    if (_instance) return _instance;

    this._http = axios.create(config);

    // Place this in the last line
    _instance = this;
  }

  /**
   * Get valid URL
   * @param paths
   * @returns
   */
  private _getURL(...paths: Array<string>) {
    return StringUtils.getPath(this._http.defaults.baseURL || "", ...paths);
  }

  /**
   * Unsubscribe the listener.
   * @param type
   * @param id
   */
  unHook(type: keyof _AxiosInterceptor, id: number) {
    this._http.interceptors[type].eject(id);
  }

  /**
   * Subscribe a listener to the lifecycle of a request.
   * @param type
   * @param onFulfilled
   * @param onRejected
   * @param options
   * @returns
   */
  hook<Type extends keyof _KindOfOnFulfilled>(
    type: Type,
    onFulfilled?: _KindOfOnFulfilled[Type] | null | undefined,
    onRejected?: ((error: any) => any) | null,
    options?: AxiosInterceptorOptions
  ) {
    if (type === "request") {
      onFulfilled;
      return this._http.interceptors.request.use(
        onFulfilled as _KindOfOnFulfilled["request"],
        onRejected,
        options
      );
    }

    return this._http.interceptors.response.use(
      onFulfilled as _KindOfOnFulfilled["response"],
      onRejected
    );
  }

  /**
   * Make a HTTP Get request
   * @param path
   * @param config
   * @returns
   */
  async get<ResponseData>(path: string, config?: AxiosRequestConfig) {
    try {
      const response = await this._http.get<ResponseData>(
        this._getURL(path),
        config
      );
      return response;
    } catch (e: any) {
      console.warn(e);
      throw e;
    }
  }

  /**
   * Make a HTTP Post request
   * @param path
   * @param config
   * @returns
   */
  async post<Payload, ResponseData>(
    path: string,
    data: Payload,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.post<ResponseData>(
        this._getURL(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
      console.warn(e);
      throw e;
    }
  }

  /**
   * Make a HTTP Put request
   * @param path
   * @param data
   * @param config
   * @returns
   */
  async put<Payload, ResponseData>(
    path: string,
    data: Payload,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.put<ResponseData>(
        this._getURL(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
      console.warn(e);
      throw e;
    }
  }

  /**
   * Make a HTTP Patch request
   * @param path
   * @param data
   * @param config
   * @returns
   */
  async patch<Payload, ResponseData>(
    path: string,
    data: Payload,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.patch<ResponseData>(
        this._getURL(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
      console.warn(e);
      throw e;
    }
  }

  /**
   * Make a HTTP Delete request
   * @param path
   * @param data
   * @param config
   * @returns
   */
  async delete<ResponseData>(path: string, config?: AxiosRequestConfig) {
    try {
      const response = await this._http.delete<ResponseData>(
        this._getURL(path),
        config
      );
      return response;
    } catch (e: any) {
      console.warn(e);
      throw e;
    }
  }
}
