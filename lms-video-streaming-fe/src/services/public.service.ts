import axiosClient from "../config/axiosClient.config";
import type { PaginationResponse, ResponseData } from "../types/common.types";
import type {
  CategoryPublicResponse,
  CoursePublicDetailsResponse,
  CoursePublicResponse,
  CourseSearchParams,
} from "../types/public.types";

export const publicService = {
  getCategories: async (): Promise<ResponseData<CategoryPublicResponse[]>> => {
    return axiosClient.get("/public/categories");
  },

  getCourses: async (
    params: CourseSearchParams,
  ): Promise<ResponseData<PaginationResponse<CoursePublicResponse>>> => {
    return axiosClient.get("/public/courses/search", { params });
  },

  getCourseDetails: async (
    slug: string,
  ): Promise<ResponseData<CoursePublicDetailsResponse>> => {
    return axiosClient.get(`/public/courses/${slug}/details`);
  },
};
