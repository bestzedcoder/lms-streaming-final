export interface UserProfileResponse {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  avatarUrl: string;
  updateProfile: boolean;
}

export interface ProfileUpdatingRequest {
  fullName: string;
  phone: string;
}

export interface UserCourseResponse {
  id: string;
  title: string;
  slug: string;
  descriptionShort: string;
  price: number;
  salePrice: number;
  thumbnail?: string;
}
