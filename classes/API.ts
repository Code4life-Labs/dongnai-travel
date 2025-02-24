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

type Status = {
  title: string;
  message: string;
};

type Response<Data> = {
  success: Status | null;
  error: Status | null;
  data: Data;
  code: number;
};

let store: any;

export class API {
  private _http!: Axios;

  constructor(config?: AxiosRequestConfig) {
    this._http = axios.create(config);
  }

  /**
   * Use to get user from state store
   * @returns
   */
  static getUser() {
    return store.getState().user.user;
  }

  /**
   * Use to generate a Bearer token
   * @param isHTTPHeader
   * @returns
   */
  static generateBearerToken(isHTTPHeader: boolean = false) {
    const token = store.getState().user.token;

    if (!token) return null;

    const result = `Bearer ${token}`;
    if (isHTTPHeader) return { Authorization: result };
    return result;
  }

  /**
   * Use to add Authorization to Header
   * @param headers
   * @returns
   */
  static addAuthorizationToHeader(headers: Record<string, any>) {
    const token = API.generateBearerToken();

    if (token) {
      headers.Authorization = token;
    }

    return headers;
  }

  /**
   * Use to inject Redux store
   * @param _store
   */
  static injectStore(_store: any) {
    store = _store;
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
  async get<T = any>(path: string, config?: AxiosRequestConfig) {
    try {
      const response = await this._http.get<Response<T>>(
        StringUtils.getPath(path),
        config
      );
      return response;
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * Make a HTTP Post request
   * @param path
   * @param config
   * @returns
   */
  async post<T = any, Payload = any>(
    path: string,
    data: Payload,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.post<Response<T>>(
        StringUtils.getPath(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
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
  async put<T = any, Payload = any>(
    path: string,
    data: Payload,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.put<Response<T>>(
        StringUtils.getPath(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
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
  async patch<T = any, Payload = any>(
    path: string,
    data: Payload,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.patch<Response<T>>(
        StringUtils.getPath(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
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
  async delete<T = any>(path: string, config?: AxiosRequestConfig) {
    try {
      const response = await this._http.delete<Response<T>>(
        StringUtils.getPath(path),
        config
      );
      return response;
    } catch (e: any) {
      throw e;
    }
  }
}
