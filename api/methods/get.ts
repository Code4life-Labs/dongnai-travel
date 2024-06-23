import { AxiosResponse } from "axios";
import { BaseResponse } from "../dto/base-response";
import qs from "qs";
import { HTTPUtil } from "@/utils/http";
import baseAPIBuilder from "..";
import { InterceptorCustom } from "../config";
/**
 * 
 * @param endpoint ex: /v1/places
 * @param params ex: id: 2
 * @param interceptor (ontional) ex: { typeInterceptor: 'request', cbConfig: (config) => {// do sth with config... } || cbConfig: CommonInterceptor.authorization}
 * @returns 
 */
export async function get<T>(endpoint: string, params?: Record<string, any>, interceptor?: InterceptorCustom): Promise<BaseResponse<T>> {
  try {
    let interceptorInstance;
    if (typeof interceptor === 'object') {
      interceptorInstance = baseAPIBuilder.buildInterceptor(interceptor.typeInterceptor, { ...interceptor });
    }
    const queryString = qs.stringify(params);
    const requestURL = queryString ? `${endpoint}?${queryString}` : endpoint;
    const response: AxiosResponse<T> = await baseAPIBuilder.api.get(requestURL);
    // eject interceptor
    interceptorInstance && baseAPIBuilder.api.interceptors.request.eject(interceptorInstance);
    return response.data as BaseResponse<T>;
  } catch (error) {
    console.error('GET request error: ' + endpoint, params);
    const newObj: BaseResponse<T> = {
      status: HTTPUtil.StatusCodes[409].title,
      data: null,
      error: 'Conflict at request GET',
      code: 409,
      success: null
    };
    return newObj;
  }
}

export default get;