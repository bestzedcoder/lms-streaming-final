import axiosClient from "../config/axiosClient.config";
import type { PaginationResponse, ResponseData } from "../types/common.types";
import type {
  AdminCategoryCreatingRequest,
  AdminCategoryResponse,
  AdminCategoryUpdatingRequest,
  AdminLockUserRequest,
  AdminSearchUser,
  AdminUnlockUserRequest,
  AdminUserCreate,
  AdminUserUpdate,
  UserResponse,
} from "../types/admin.types";

export const adminService = {
  // Check Auth

  checkAuth: async (): Promise<ResponseData<boolean>> => {
    return axiosClient.get("/admin/check-auth");
  },

  // User

  getUserList: async (
    params: AdminSearchUser,
  ): Promise<ResponseData<PaginationResponse<UserResponse>>> => {
    return axiosClient.get("/users", { params });
  },

  getUserById: async (id: string): Promise<ResponseData<UserResponse>> => {
    return axiosClient.get(`/users/${id}`);
  },

  createUser: async (
    data: AdminUserCreate,
  ): Promise<ResponseData<UserResponse>> => {
    return axiosClient.post("/users", data);
  },

  updateUser: async (
    id: string,
    data: AdminUserUpdate,
  ): Promise<ResponseData<UserResponse>> => {
    return axiosClient.put(`/users/${id}`, data);
  },

  deleteUser: async (id: string): Promise<ResponseData<boolean>> => {
    return axiosClient.delete(`/users/${id}`);
  },

  lockUser: async (
    data: AdminLockUserRequest,
  ): Promise<ResponseData<boolean>> => {
    return axiosClient.post("/users/lock", data);
  },

  unlockUser: async (
    data: AdminUnlockUserRequest,
  ): Promise<ResponseData<boolean>> => {
    return axiosClient.post("/users/unlock", data);
  },

  // Category

  getCategories: async (): Promise<ResponseData<AdminCategoryResponse[]>> => {
    return axiosClient.get("/admin/categories");
  },

  createCategory: async (
    data: AdminCategoryCreatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/admin/categories", data);
  },

  updateCategory: async (
    id: string,
    data: AdminCategoryUpdatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.put(`/admin/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<ResponseData> => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },
};
