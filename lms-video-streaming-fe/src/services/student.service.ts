import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../@types/common.types";
import type {
  CourseAuthDetailsResponse,
  InstructorRequest,
  RegistrationCreatingRequest,
} from "../@types/student.types";

export const studentService = {
  getCourseDetails: async (
    slug: string,
  ): Promise<ResponseData<CourseAuthDetailsResponse>> => {
    return axiosClient.get(`/courses/${slug}/details`);
  },

  // request
  instructorRequest: async (data: InstructorRequest): Promise<ResponseData> => {
    return axiosClient.post("/requests/instructor", data);
  },

  // registration
  registration: async (
    data: RegistrationCreatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/registrations", data);
  },
};
