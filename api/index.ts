import axios, { AxiosError, AxiosInstance } from "axios";
// Import base url
import { BASE_API_URL } from "@/api/config";
// Import common config for interceptor
import { CommonConfigInterceptor } from "@/api/untils";
// Import types
import { BuildInterceptorConfigs, EApiMethod, UInterceptorType } from "@/api/type";

class BaseAPI {
  private _api = axios.create({
    baseURL: BASE_API_URL,
  });

  builder: BaseAPIBuilder;

  constructor() {
    this.builder = new BaseAPIBuilder(this._api);
  }

  ejectInterceptor(interceptorId: number) {
    this._api.interceptors.request.eject(interceptorId);
  }
}

class BaseAPIBuilder {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
    // default when creating it will add interceptor to response so that catch the error
    this.start();
  }

  private _buildInterceptor(type: UInterceptorType, obj: BuildInterceptorConfigs) {
    return this.api.interceptors[type].use(
      obj.cbConfig ? ((config) => obj.cbConfig && obj.cbConfig(config)) : (config => config),
      obj.cbError ? ((error) => obj.cbError && obj.cbError(error)) : (error => Promise.reject(error))
    )
  };

  buildRequestInterceptor(obj: BuildInterceptorConfigs) {
    return this._buildInterceptor(EApiMethod.REQUEST, obj);
  }

  buildResponseInterceptor(obj: BuildInterceptorConfigs) {
    return this._buildInterceptor(EApiMethod.RESPONSE, obj);
  }

  start() {
    // default settings for cacth error handling when response.
    this._buildInterceptor(EApiMethod.RESPONSE, {
      cbError: CommonConfigInterceptor.errorResponse
    });
  }
}

export const baseAPI = new BaseAPI();