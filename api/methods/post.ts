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
 * @param endpoint ex: /v1/users/create
 * @param data (ontional) | ex: {id: 2, email: fsn@gmail.com, password: 123456}
 * @param interceptor (ontional) | ex: { typeInterceptor: 'request', cbConfig: (config) => {// do sth with config... } || cbConfig: CommonInterceptor.authorization}
 * @returns 
 */
export async function post<T, V>(endpoint: string, data?: V, interceptor?: CustomInterceptor): Promise<BaseResponse<T>> {
  return baseMethod<T>(async () => {
    return await baseAPI.builder.api.post(endpoint, data);
  }, interceptor)
}