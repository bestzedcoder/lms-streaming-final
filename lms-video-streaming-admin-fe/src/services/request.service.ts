import type { ResponseData } from "../@types/common.type";
import type {
  CourseRequestResponse,
  InstructorRequestResponse,
} from "../@types/request.type";
import axiosClient from "../api/axiosClient";

export const requestService = {
  getCountInstructorRequests: async (): Promise<ResponseData<number>> => {
    return axiosClient.get("admin/requests/count-instructor");
  },

  getInstructorRequests: async (): Promise<
    ResponseData<InstructorRequestResponse[]>
  > => {
    return axiosClient.get("admin/requests/instructor");
  },

  handleInstructorRequest: async (id: string): Promise<ResponseData> => {
    return axiosClient.post(`admin/requests/instructor/${id}`);
  },

  getCountCourseRequests: async (): Promise<ResponseData<number>> => {
    return axiosClient.get("admin/requests/count-course");
  },

  getCourseRequests: async (): Promise<
    ResponseData<CourseRequestResponse[]>
  > => {
    return axiosClient.get("admin/requests/course");
  },

  handleCourseRequest: async (id: string): Promise<ResponseData> => {
    return axiosClient.post(`admin/requests/course/${id}`);
  },
};
