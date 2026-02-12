import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../types/common.types";
import type {
  AdminLockUserRequest,
  AdminSearchUser,
  AdminUnlockUserRequest,
  AdminUserCreate,
  AdminUserList,
  AdminUserUpdate,
  UserResponse,
} from "../types/admin.types";

export const adminService = {
  // 1. Check Auth
  checkAuth: async (): Promise<ResponseData<boolean>> => {
    return axiosClient.get("/admin/check-auth");
  },

  // 2. Get List (Search & Pagination)
  getUserList: async (
    params: AdminSearchUser,
  ): Promise<ResponseData<AdminUserList>> => {
    return axiosClient.get("/admin/users", { params });
  },

  // 3. Get Detail
  getUserById: async (id: string): Promise<ResponseData<UserResponse>> => {
    return axiosClient.get(`/admin/users/${id}`);
  },

  // 4. Create
  createUser: async (
    data: AdminUserCreate,
  ): Promise<ResponseData<UserResponse>> => {
    return axiosClient.post("/admin/users", data);
  },

  // 5. Update
  updateUser: async (
    id: string,
    data: AdminUserUpdate,
  ): Promise<ResponseData<UserResponse>> => {
    return axiosClient.put(`/admin/users/${id}`, data);
  },

  // 6. Delete
  deleteUser: async (id: string): Promise<ResponseData<boolean>> => {
    return axiosClient.delete(`/admin/users/${id}`);
  },

  // 7. Lock User
  lockUser: async (
    data: AdminLockUserRequest,
  ): Promise<ResponseData<boolean>> => {
    return axiosClient.post("/admin/users/lock", data);
  },

  // 8. Unlock User
  unlockUser: async (
    data: AdminUnlockUserRequest,
  ): Promise<ResponseData<boolean>> => {
    return axiosClient.post("/admin/users/unlock", data);
  },
};
