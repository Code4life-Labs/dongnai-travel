import qs from "qs";
// base reponse type
import { BaseResponse } from "@/api/dto/base-response";
// base of api
import { baseAPI } from "@/api";
// base of methods 
import { baseMethod } from "@/api/methods";
// type
import { CustomInterceptor } from "@/api/type";

/**
 * 
 * @param endpoint ex: /v1/places
 * @param params ex: id: 2
 * @param interceptor (ontional) ex: { typeInterceptor: 'request', cbConfig: (config) => {// do sth with config... } || cbConfig: CommonInterceptor.authorization}
 * @returns 
 */
export async function get<T>(endpoint: string, params?: Record<string, any>, interceptor?: CustomInterceptor): Promise<BaseResponse<T>> {
  return baseMethod<T>(async () => {
    const queryString = qs.stringify(params);
    const requestURL = queryString ? `${endpoint}?${queryString}` : endpoint;
    return await baseAPI.builder.api.get(requestURL);
  }, interceptor)
}

export default get;