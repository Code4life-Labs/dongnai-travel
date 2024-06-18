type ResultResponseType<T> = { [K in keyof T]: T[K] };

type CustomErrorType = {
  message: string;
  code: number;
  details: any;
};

export type BaseResponse<T> = {
  status: "success" | "error";
  data: ResultResponseType<T> | null;
  error: CustomErrorType | null;
}
