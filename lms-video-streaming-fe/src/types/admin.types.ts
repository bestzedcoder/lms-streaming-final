export interface UserResponse {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  avatarUrl: string;
  lockReason?: string;
  active: boolean;
  locked: boolean;
  updateProfile: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  createdBy?: string;
}

export interface AdminUserList {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  result: UserResponse[];
}

export interface AdminSearchUser {
  page?: number;
  limit?: number;
  email?: string;
}

export interface AdminUserCreate {
  email: string;
  fullName: string;
  phone: string;
  role: "STUDENT" | "INSTRUCTOR";
  password?: string;
}

export interface AdminUserUpdate {
  fullName: string;
  phone: string;
  role: "STUDENT" | "INSTRUCTOR";
}

export interface AdminLockUserRequest {
  id: string;
  reason: string;
}

export interface AdminUnlockUserRequest {
  id: string;
}
