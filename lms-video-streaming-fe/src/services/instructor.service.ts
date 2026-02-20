import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../types/common.types";
import type {
  CourseCreatingRequest,
  CourseUpdatingRequest,
  InstructorCourseDetailsResponse,
  InstructorCourseInfoResponse,
  InstructorCourseResponse,
  InstructorInfoResponse,
  InstructorUpdateRequest,
  LessonCancelRequest,
  LessonCreatingRequest,
  LessonUpdatingRequest,
  SectionCancelRequest,
  SectionCreatingRequest,
  SectionUpdatingRequest,
} from "../types/instructor.types";

const createFormData = (data: any, file?: File | null) => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (file) {
    formData.append("image", file);
  }
  return formData;
};

export const instructorService = {
  checkInfo: async (): Promise<ResponseData<boolean>> => {
    return axiosClient.get("/instructor/check-info");
  },

  getInfo: async (): Promise<ResponseData<InstructorInfoResponse>> => {
    return axiosClient.get("/instructor");
  },

  updateInfo: async (data: InstructorUpdateRequest): Promise<ResponseData> => {
    return axiosClient.post("/instructor", data);
  },

  // Course

  getCourse: async (
    courseId: string,
  ): Promise<ResponseData<InstructorCourseInfoResponse>> => {
    return axiosClient.get(`/instructor/${courseId}`);
  },

  getAllCourses: async (): Promise<
    ResponseData<InstructorCourseResponse[]>
  > => {
    return axiosClient.get("/instructor/get-courses");
  },

  getCourseDetails: async (
    courseId: string,
  ): Promise<ResponseData<InstructorCourseDetailsResponse>> => {
    return axiosClient.get(`/instructor/courses/${courseId}/get-details`);
  },

  publishCourse: async (id: string): Promise<ResponseData> => {
    return axiosClient.post(`/instructor/course/${id}/publish`);
  },
  unpublishCourse: async (id: string): Promise<ResponseData> => {
    return axiosClient.post(`/instructor/course/${id}/unpublish`);
  },

  createCourse: async (
    data: CourseCreatingRequest,
    image?: File,
  ): Promise<ResponseData<InstructorCourseResponse>> => {
    const formData = createFormData(data, image);
    return axiosClient.post("/instructor/add-course", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateCourse: async (
    data: CourseUpdatingRequest,
    image?: File,
  ): Promise<ResponseData<InstructorCourseResponse>> => {
    const formData = createFormData(data, image);
    return axiosClient.post("/instructor/update-course", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Section

  addSection: async (data: SectionCreatingRequest): Promise<ResponseData> => {
    return axiosClient.post("/instructor/add-section", data);
  },

  updateSection: async (
    data: SectionUpdatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/instructor/update-section", data);
  },

  deleteSection: async (data: SectionCancelRequest): Promise<ResponseData> => {
    return axiosClient.delete("/instructor/delete-section", { data });
  },

  // Lesson

  addLesson: async (data: LessonCreatingRequest): Promise<ResponseData> => {
    return axiosClient.post("/instructor/add-lesson", data);
  },

  updateLesson: async (data: LessonUpdatingRequest): Promise<ResponseData> => {
    return axiosClient.post("/instructor/update-lesson", data);
  },

  deleteLesson: async (data: LessonCancelRequest): Promise<ResponseData> => {
    return axiosClient.delete("/instructor/delete-lesson", { data });
  },
};
