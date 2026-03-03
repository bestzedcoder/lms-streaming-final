import type { PaginationResponse, ResponseData } from "../@types/common.type";
import type {
  AdminLockUserRequest,
  AdminSearchUser,
  AdminUnlockUserRequest,
  AdminUserCreate,
  AdminUserUpdate,
  UserResponse,
} from "../@types/user.type";
import axiosClient from "../api/axiosClient";

export const UserService = {
  getUserList: async (
    params: AdminSearchUser,
  ): Promise<ResponseData<PaginationResponse<UserResponse>>> => {
    return axiosClient.get("/admin/users", { params });
  },

  getUserById: async (id: string): Promise<ResponseData<UserResponse>> => {
    return axiosClient.get(`/admin/users/${id}`);
  },

  createUser: async (
    data: AdminUserCreate,
  ): Promise<ResponseData<UserResponse>> => {
    return axiosClient.post("/admin/users", data);
  },

  updateUser: async (
    id: string,
    data: AdminUserUpdate,
  ): Promise<ResponseData<UserResponse>> => {
    return axiosClient.post(`/admin/users/${id}`, data);
  },

  deleteUser: async (id: string): Promise<ResponseData<boolean>> => {
    return axiosClient.delete(`/admin/users/${id}`);
  },

  lockUser: async (
    data: AdminLockUserRequest,
  ): Promise<ResponseData<boolean>> => {
    return axiosClient.post("/admin/users/lock", data);
  },

  unlockUser: async (
    data: AdminUnlockUserRequest,
  ): Promise<ResponseData<boolean>> => {
    return axiosClient.post("/admin/users/unlock", data);
  },
};
