
export type BaseResponse<T> = {
  status: string;
  data: T | null;
  error: string | null;
  success: string | null;
  code: number;
}

