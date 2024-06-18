import { AxiosResponse } from "axios";
import { BaseResponse } from "../dto/shared/base-response";
import qs from "qs";
import { baseApi } from "..";

export async function get<T>(endpoint: string, params?: Record<string, any>): Promise<BaseResponse<T>> {
  try {
    const queryString = qs.stringify(params);
    const requestURL = queryString ? `${endpoint}?${queryString}` : endpoint;
    const response: AxiosResponse<T> = await baseApi.getApiInstance().get(requestURL);
    return response.data as BaseResponse<T>;
  } catch (error) {
    console.error('GET request error: ' + endpoint, params);
    const newObj: BaseResponse<T> = {
      status: 'error',
      data: null,
      error: {
        code: 100,
        details: '',
        message: "There is a problem when call GET method."
      },
    };
    return newObj;
  }
}

export default get;