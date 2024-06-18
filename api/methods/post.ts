import { AxiosResponse } from "axios";
import { BaseResponse } from "../dto/shared/base-response";
import { baseApi } from "..";

async function post<T>(endpoint: string, data?: any): Promise<BaseResponse<T>> {
  try {
    const response: AxiosResponse<T> = await baseApi.getApiInstance().post(endpoint, data);
    return response.data as BaseResponse<T>;
  } catch (error) {
    console.error('POST request error: ' + endpoint, data, error);
    const newObj: BaseResponse<T> = {
      status: 'error',
      data: null,
      error: {
        code: 100,
        details: '',
        message: "There is a problem when call POST method."
      },
    };
    return newObj;
  }
}

export default post;