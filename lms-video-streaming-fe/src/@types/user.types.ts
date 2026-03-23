export interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR";
  avatarUrl: string;
  updateProfile: boolean;
}

export interface ProfileUpdatingRequest {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UserCourseResponse {
  id: string;
  title: string;
  slug: string;
  descriptionShort: string;
  thumbnail?: string;
  status: "ACTIVE" | "BANNED";
}
