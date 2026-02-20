export interface ResponseData<T = any> {
  data: T;
  message: string;
}

export interface BaseResponse<T = any> {
  timestamp: string;
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  timestamp: string;
  code: number;
  success: boolean;
  message: string;
  path: string;
}

export interface PaginationResponse<T = any> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  result: T[];
}
