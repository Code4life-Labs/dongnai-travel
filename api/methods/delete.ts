import { AxiosResponse } from "axios";
import { BaseResponse } from "../dto/base-response";
import { HTTPUtil } from "@/utils/http";
import { InterceptorCustom } from "../config";
import baseAPIBuilder from "..";

/**
 * 
 * @param endpoint ex: /v1/users/2
 * @param interceptor (optional) ex: { typeInterceptor: 'request', cbConfig: (config) => {// do sth with config... } || cbConfig: CommonInterceptor.authorization}
 * @returns 
 */
async function del<T>(endpoint: string, interceptor?: InterceptorCustom): Promise<BaseResponse<T>> {
  try {
    let interceptorInstance;
    if (typeof interceptor === 'object') {
      interceptorInstance = baseAPIBuilder.buildInterceptor(interceptor.typeInterceptor, { ...interceptor });
    }
    const response: AxiosResponse<T> = await baseAPIBuilder.api.delete(endpoint);
    // eject interceptor
    interceptorInstance && baseAPIBuilder.api.interceptors.request.eject(interceptorInstance);
    return response.data as BaseResponse<T>;
  } catch (error) {
    console.error('DELETE request error: ' + endpoint, error);
    const newObj: BaseResponse<T> = {
      status: HTTPUtil.StatusCodes[409].title,
      data: null,
      error: 'Conflict at request DELETE',
      code: 409,
      success: null
    };
    return newObj;
  }
}

export default del;
