import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/useAuthStore.store";
import { useAppStore } from "../store/useAppStore.store";
import { notify } from "../utils/notification.utils";
import type {
  BaseResponse,
  ErrorResponse,
  ResponseData,
} from "../types/common.types";

// Mở rộng type cho config
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    useAppStore.getState().setLoading(true);
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useAppStore.getState().setLoading(false);
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    useAppStore.getState().setLoading(false);

    const res: ResponseData = {
      data: response.data.data,
      message: response.data.message,
    };
    return res as any;
  },

  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || "Có lỗi xảy ra";
    const status = error.response?.status;

    if (!error.response) {
      useAppStore.getState().setLoading(false);
      notify.error("Lỗi kết nối", "Không thể kết nối đến máy chủ.");
      return Promise.reject(error);
    }

    if (status === 401) {
      if (errorData?.code === 1000 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshTokenResponse = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );

          const newAccessToken = refreshTokenResponse.data.data.accessToken;

          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            useAuthStore.getState().login(currentUser, newAccessToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest);
        } catch (refreshError) {
          useAppStore.getState().setLoading(false);
          useAuthStore.getState().logout();
          notify.error("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
          return Promise.reject(refreshError);
        }
      }

      useAuthStore.getState().logout();
      notify.error("Lỗi xác thực", errorMessage);
    } else {
      switch (status) {
        case 400:
          notify.error("Dữ liệu không hợp lệ", errorMessage);
          break;
        case 403:
          if (errorData?.code === 2000) {
            useAuthStore.getState().logout();
          }
          notify.error("Truy cập không hợp lệ", errorMessage);
          break;
        case 404:
          notify.error("Không tìm thấy", "Tài nguyên không tồn tại.");
          break;
        case 503:
          notify.error("Hệ thống bảo trì", "Vui lòng quay lại sau.");
          break;
        default:
          if (status && status >= 500) {
            notify.error("Lỗi hệ thống", "Server gặp sự cố.");
          } else {
            notify.error("Lỗi không xác định", errorMessage);
          }
      }
    }

    useAppStore.getState().setLoading(false);
    return Promise.reject(errorData || error);
  },
);

export default axiosClient;
