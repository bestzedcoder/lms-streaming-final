export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
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

export interface AdminSearchUser {
  page?: number;
  limit?: number;
  email?: string;
}

export interface AdminUserCreate {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "STUDENT" | "INSTRUCTOR";
}

export interface AdminUserUpdate {
  firstName: string;
  lastName: string;
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
