import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../types/common.types";
import type {
  UserProfileResponse,
  ProfileUpdatingRequest,
  UserCourseResponse,
} from "../types/user.types";

export const profileService = {
  getMe: async (): Promise<ResponseData<UserProfileResponse>> => {
    return axiosClient.get("/profile/me");
  },

  updateProfile: async (
    data: ProfileUpdatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/profile/me", data);
  },

  uploadAvatar: async (file: File): Promise<ResponseData<string>> => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post("/profile/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getCourseMe: async (): Promise<ResponseData<UserCourseResponse[]>> => {
    return axiosClient.get("/profile/course-me");
  },
};
