// --- RESPONSE TYPES ---
export interface UserResponse {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  avatarUrl: string;
  lockReason?: string; // Có thể null
  active: boolean;
  locked: boolean;
  updateProfile: boolean;
  createdAt: string; // JSON trả về Date dưới dạng string
  updatedAt: string;
  updatedBy?: string;
  createdBy?: string;
}

export interface AdminUserList {
  currentPage: number; // Chỉnh lại cho chuẩn convention (thường là currentPage hoặc page)
  pageSize: number;
  totalPages: number;
  totalElements: number;
  result: UserResponse[]; // Backend thường trả về 'content' hoặc 'data', ở đây mình map theo BaseResponse
}

// --- REQUEST TYPES ---
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
  password?: string; // Thường tạo user mới sẽ có password mặc định hoặc random
}

export interface AdminUserUpdate {
  fullName: string;
  phone: string;
  role: "STUDENT" | "INSTRUCTOR";
}

export interface AdminLockUserRequest {
  id: string; // UUID
  reason: string;
}

export interface AdminUnlockUserRequest {
  id: string; // UUID
}
