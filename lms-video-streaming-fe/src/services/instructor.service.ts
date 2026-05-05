import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../@types/common.types";
import type {
  ActiveEnrollment,
  BannedEnrollment,
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
  UploadFileRequest,
  QuestionCategoryCreatingRequest,
  QuestionCategoryResponse,
  QuestionCategoryUpdatingRequest,
  QuestionCreatingRequest,
  QuestionQuery,
  QuestionResponse,
  QuestionUpdatingResponse,
  RegistrationProcessingRequest,
  RegistrationResponse,
  SectionCancelRequest,
  SectionCreatingRequest,
  SectionUpdatingRequest,
  MultipartInitRequest,
  MultipartInitResponse,
  MultipartCompleteRequest,
  VideoCreatingRequest,
  ResourceCreatingRequest,
  VideoUpdatingRequest,
  ResourceUpdatingRequest,
  UploadFileResponse,
  InstructorVideoResponse,
  InstructorLectureResponse,
  ResourcePreviewResponse,
  QuizResponse,
  QuizCreatingRequest,
  QuizUpdatingRequest,
  AddQuizQuestionRequest,
  RemoveQuizQuestionRequest,
  InstructorLessonDetailResponse,
  SelectVideoResponse,
  SelectLectureResponse,
  SelectQuizResponse,
  AddResourceForLesson,
  RemoveResourceForLesson,
} from "../@types/instructor.types";

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

  getLessonsInCourse: async (
    courseId: string,
  ): Promise<ResponseData<InstructorLessonDetailResponse[]>> => {
    return axiosClient.get(`/instructor/courses/${courseId}/get-lessons`);
  },

  // Registration

  countPendingRegistrationsByInstructor: async (): Promise<
    ResponseData<number>
  > => {
    return axiosClient.get("/instructor/registrations/count");
  },

  getPendingRegistrations: async (): Promise<
    ResponseData<RegistrationResponse[]>
  > => {
    return axiosClient.get("/instructor/registrations");
  },

  approveRegistration: async (
    data: RegistrationProcessingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/instructor/registrations/approve", data);
  },

  rejectRegistration: async (
    data: RegistrationProcessingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/instructor/registrations/reject", data);
  },

  // enrollment

  banned: async (data: BannedEnrollment): Promise<ResponseData> => {
    return axiosClient.post("/instructor/enrollments/user-banned", data);
  },

  active: async (data: ActiveEnrollment): Promise<ResponseData> => {
    return axiosClient.post("/instructor/enrollments/user-active", data);
  },

  // question

  getQuestionCategories: async (): Promise<
    ResponseData<QuestionCategoryResponse[]>
  > => {
    return axiosClient.get("/instructor/questions/get-categories");
  },

  createQuestionCategory: async (
    data: QuestionCategoryCreatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/questions/create-category", data);
  },

  updateQuestionCategory: async (
    data: QuestionCategoryUpdatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/questions/update-category", data);
  },

  deleteQuestionCategory: async (categoryId: string): Promise<ResponseData> => {
    return axiosClient.delete(
      `instructor/questions/delete-category/${categoryId}`,
    );
  },

  getQuestions: async (
    params: QuestionQuery,
  ): Promise<ResponseData<QuestionResponse[]>> => {
    return axiosClient.get("instructor/questions", { params });
  },

  createQuestion: async (
    data: QuestionCreatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/questions/create", data);
  },

  updateQuestion: async (
    data: QuestionUpdatingResponse,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/questions/update", data);
  },

  deleteQuestion: async (id: string): Promise<ResponseData> => {
    return axiosClient.delete(`instructor/questions/delete/${id}`);
  },

  // upload file

  getPresignedUrl: async (
    data: UploadFileRequest,
  ): Promise<ResponseData<UploadFileResponse>> => {
    return axiosClient.post("instructor/storage/presigned-url", data);
  },

  initMultipartVideo: async (
    data: MultipartInitRequest,
  ): Promise<ResponseData<MultipartInitResponse>> => {
    return axiosClient.post("instructor/storage/init-multipart", data);
  },

  completeMultipartVideo: async (
    data: MultipartCompleteRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/storage/complete-multipart", data);
  },

  createVideo: async (data: VideoCreatingRequest): Promise<ResponseData> => {
    return axiosClient.post("instructor/storage/create-video", data);
  },

  createResource: async (
    data: ResourceCreatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/storage/create-resource", data);
  },

  updateVideo: async (
    data: VideoUpdatingRequest,
    image?: File | null,
  ): Promise<ResponseData> => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
    if (image) {
      formData.append("image", image);
    }
    return axiosClient.post("instructor/storage/update-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateLecture: async (
    data: ResourceUpdatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/storage/update-resource", data);
  },

  getVideos: async (): Promise<ResponseData<InstructorVideoResponse[]>> => {
    return axiosClient.get("instructor/resources/get-videos");
  },

  getLectures: async (): Promise<ResponseData<InstructorLectureResponse[]>> => {
    return axiosClient.get("instructor/resources/get-lectures");
  },

  generateVideoPreview: async (
    id: string,
  ): Promise<ResponseData<ResourcePreviewResponse>> => {
    return axiosClient.get(`instructor/resources/preview-video/${id}`);
  },

  generateLecturePreview: async (
    id: string,
  ): Promise<ResponseData<ResourcePreviewResponse>> => {
    return axiosClient.get(`instructor/resources/preview-lecture/${id}`);
  },

  // Quizzes

  getQuizzes: async (): Promise<ResponseData<QuizResponse[]>> => {
    return axiosClient.get("instructor/quizzes");
  },

  createQuiz: async (data: QuizCreatingRequest): Promise<ResponseData> => {
    return axiosClient.post("instructor/quizzes/handle-create", data);
  },

  updateQuiz: async (data: QuizUpdatingRequest): Promise<ResponseData> => {
    return axiosClient.post("instructor/quizzes/handle-update", data);
  },

  deleteQuiz: async (id: string): Promise<ResponseData> => {
    return axiosClient.delete(`instructor/quizzes/handle-delete/${id}`);
  },

  addQuizQuestion: async (
    data: AddQuizQuestionRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/quizzes/add-question", data);
  },

  removeQuizQuestion: async (
    data: RemoveQuizQuestionRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/quizzes/remove-question", data);
  },

  // handle add resource for lesson

  getSelectVideos: async (): Promise<ResponseData<SelectVideoResponse[]>> => {
    return axiosClient.get("instructor/resources/prepare-select/get-videos");
  },

  getSelectLectures: async (): Promise<
    ResponseData<SelectLectureResponse[]>
  > => {
    return axiosClient.get("instructor/resources/prepare-select/get-lectures");
  },

  getSelectQuizzes: async (): Promise<ResponseData<SelectQuizResponse[]>> => {
    return axiosClient.get("instructor/resources/prepare-select/get-quizzes");
  },

  addResourceForLesson: async (
    data: AddResourceForLesson,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/lesson/add-resource", data);
  },

  removeResourceForLesson: async (
    data: RemoveResourceForLesson,
  ): Promise<ResponseData> => {
    return axiosClient.post("instructor/lesson/remove-resource", data);
  },
};
