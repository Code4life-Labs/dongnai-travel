import { AxiosError } from "axios";

type CallbackConfig = (config: any) => any
type CallbackError = (error: AxiosError) => Promise<void>;

export type BuildInterceptorConfigs = {
  cbConfig?: CallbackConfig,
  cbError?: CallbackError
};

export const enum EApiMethod {
  RESPONSE = 'response',
  REQUEST = 'request',
}

export type UInterceptorType = EApiMethod.REQUEST | EApiMethod.RESPONSE;

export type CustomInterceptor = BuildInterceptorConfigs & { typeInterceptor: UInterceptorType };