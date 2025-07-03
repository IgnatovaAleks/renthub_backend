import httpStatus from "http-status";

export interface ApiResponse<T = any> {
  success: boolean;
  error: boolean;
  message: string;
  data?: T;
  meta?: object;
  status: number;
}

export interface ApiError {
  message?: string;
  details?: any;
  stack?: any;
}

export const responseService = {
  success<T>(
    message: string,
    data: T = {} as T,
    meta: object = {},
    statusCode: number = httpStatus.OK
  ): ApiResponse<T> {
    return {
      success: true,
      error: false,
      message,
      data,
      meta,
      status: statusCode,
    };
  },

  error(
    message: string,
    error: ApiError | string,
    meta: object = {},
    statusCode: number = httpStatus.BAD_REQUEST
  ): ApiResponse<ApiError> {
    return {
      success: false,
      error: true,
      message,
      data: typeof error === "string" ? { message: error } : error,
      meta,
      status: statusCode,
    };
  },
};
