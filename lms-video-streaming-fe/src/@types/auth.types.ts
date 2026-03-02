// Mô phỏng User Entity từ Java
export interface AuthUserInfoResponse {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  updateProfile: boolean;
  role: "STUDENT" | "INSTRUCTOR";
}

// export interface AuthLoginResponse {
//   accessToken: string;
//   user: AuthUserInfoResponse;
// }

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthVerifyAccountRequest {
  email: string;
  code: string;
}

export interface AuthForgotPasswordRequest {
  email: string;
}

export interface AuthResetPasswordRequest {
  email: string;
  code: string;
}

export interface AuthChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
