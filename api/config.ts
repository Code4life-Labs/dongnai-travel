import { AxiosError } from "axios";

const API_URL = {
  dev: process.env.EXPO_PUBLIC_API_URL_DEV,
  prod: process.env.EXPO_PUBLIC_API_URL_PROD,
};
const currentEnv = process.env.EXPO_PUBLIC_ENV as "dev" | "prod"


type CallbackConfigFunction = (config: any) => any
type CallbackErrorFunction = (error: AxiosError) => Promise<void>;

export type CallBackInterceptorObject = {
  cbConfig?: CallbackConfigFunction,
  cbError?: CallbackErrorFunction
};

export type InterceptorType = 'request' | 'response'

export type InterceptorCustom = CallBackInterceptorObject & { typeInterceptor: InterceptorType }

export const BASE_API_URL = API_URL[currentEnv];
export const USER_TOKEN = 'UTK_2024'; // it means USER_TOKEN_2024
