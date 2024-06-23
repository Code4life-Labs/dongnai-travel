import { AxiosResponse } from "axios";
import { BaseResponse } from "../dto/base-response";
import { HTTPUtil } from "@/utils/http";
import { InterceptorCustom } from "../config";
import baseAPIBuilder from "..";
/**
 * 
 * @param endpoint ex: /v1/users/create
 * @param data (ontional) | ex: {id: 2, email: fsn@gmail.com, password: 123456}
 * @param interceptor (ontional) | ex: { typeInterceptor: 'request', cbConfig: (config) => {// do sth with config... } || cbConfig: CommonInterceptor.authorization}
 * @returns 
 */
async function post<T>(endpoint: string, data?: any, interceptor?: InterceptorCustom): Promise<BaseResponse<T>> {
  try {
    let interceptorInstance;
    if (typeof interceptor === 'object') {
      interceptorInstance = baseAPIBuilder.buildInterceptor(interceptor.typeInterceptor, { ...interceptor });
    }
    const response: AxiosResponse<T> = await baseAPIBuilder.api.post(endpoint, data);
    // eject interceptor
    interceptorInstance && baseAPIBuilder.api.interceptors.request.eject(interceptorInstance);
    return response.data as BaseResponse<T>;
  } catch (error) {
    console.error('POST request error: ' + endpoint, data, error);
    const newObj: BaseResponse<T> = {
      status: HTTPUtil.StatusCodes[409].title,
      data: null,
      error: 'Conflic at request POST',
      code: 409,
      success: null
    };
    return newObj;
  }
}

export default post;