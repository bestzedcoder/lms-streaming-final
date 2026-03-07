import type { PaginationResponse, ResponseData } from "../@types/common.type";
import type {
  CourseOfInstructorResponse,
  CoursePendingResponse,
  InstructorResponse,
  InstructorSearch,
} from "../@types/course.type";
import axiosClient from "../api/axiosClient";

export const courseService = {
  getCoursesPending: async (): Promise<
    ResponseData<CoursePendingResponse[]>
  > => {
    return axiosClient.get("/admin/course/pending");
  },

  getAllInstructor: async (
    params: InstructorSearch,
  ): Promise<ResponseData<PaginationResponse<InstructorResponse>>> => {
    return axiosClient.get("/admin/get-all/instructor", { params });
  },

  getCourses: async (
    instructorId: string,
  ): Promise<ResponseData<CourseOfInstructorResponse[]>> => {
    return axiosClient.get(`/admin/get-courses/instructor/${instructorId}`);
  },

  approveCourse: async (courseId: string): Promise<ResponseData> => {
    return axiosClient.post(`/admin/approve-course/${courseId}`);
  },

  lockCourse: async (courseId: string): Promise<ResponseData> => {
    return axiosClient.post(`/admin/course/lock/${courseId}`);
  },

  unlockCourse: async (courseId: string): Promise<ResponseData> => {
    return axiosClient.post(`/admin/course/unlock/${courseId}`);
  },
};
