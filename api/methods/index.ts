import { AxiosResponse } from "axios";
import qs from "qs";
// import base reponse type
import { BaseResponse } from "@/api/dto/base-response";
// import base of api
import { baseAPI } from "@/api";

import { CustomInterceptor } from "@/api/type";
// import from until
import { HTTPUtil } from "@/utils/http";
import { StringUtils } from "@/utils/string";
/**
 * 
 * @param endpoint ex: /v1/places
 * @param params ex: id: 2
 * @param interceptor (ontional) ex: { typeInterceptor: 'request', cbConfig: (config) => {// do sth with config... } || cbConfig: CommonInterceptor.authorization}
 * @returns 
 */
export async function baseMethod<T>(enjectFn: any, interceptor?: CustomInterceptor): Promise<BaseResponse<T>> {
  try {
    let interceptorInstance;
    if (typeof interceptor === 'object') {
      const typeInterceptor = StringUtils.upperCaseFirstLetter(interceptor.typeInterceptor) as 'Request' | 'Response'
      interceptorInstance = baseAPI.builder[`build${typeInterceptor}Interceptor`](interceptor);
    }
    const response: AxiosResponse<T> = enjectFn();
    // eject interceptor
    interceptorInstance && baseAPI.ejectInterceptor(interceptorInstance);
    return response.data as BaseResponse<T>;
  } catch (error) {
    const newObj: BaseResponse<T> = {
      status: HTTPUtil.StatusCodes[409].title,
      data: null,
      error: 'Conflict when call api!',
      code: 409,
      success: null
    };
    return newObj;
  }
}