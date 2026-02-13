import axiosClient from "../config/axiosClient.config";
import type {
  AuthLoginResponse,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthVerifyAccountRequest,
  AuthForgotPasswordRequest,
  AuthResetPasswordRequest,
  AuthChangePasswordRequest,
} from "../types/auth.types";
import type { ResponseData } from "../types/common.types";

export const authService = {
  login: async (
    data: AuthLoginRequest,
  ): Promise<ResponseData<AuthLoginResponse>> => {
    return axiosClient.post("/auth/login", data);
  },

  logout: async (): Promise<ResponseData> => {
    return axiosClient.post("/auth/logout");
  },

  register: async (data: AuthRegisterRequest): Promise<ResponseData> => {
    return axiosClient.post("/auth/register", data);
  },

  verifyAccount: async (
    data: AuthVerifyAccountRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/auth/verify-account", data);
  },

  forgotPassword: async (
    data: AuthForgotPasswordRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/auth/forgot-password", data);
  },

  resetPassword: async (
    data: AuthResetPasswordRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/auth/reset-password", data);
  },

  changePassword: async (
    data: AuthChangePasswordRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/auth/change-password", data);
  },
};
