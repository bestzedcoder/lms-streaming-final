import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../types/common.types";
import type { CourseAuthDetailsResponse } from "../types/student.types";

export const studentService = {
  getCourseDetails: async (
    slug: string,
  ): Promise<ResponseData<CourseAuthDetailsResponse>> => {
    return axiosClient.get(`/courses/${slug}/details`);
  },
};
