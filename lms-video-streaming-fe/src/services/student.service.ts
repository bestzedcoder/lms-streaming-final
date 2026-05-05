import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../@types/common.types";
import type {
  CourseAuthDetailsResponse,
  CourseEnrollmentDetailsResponse,
  CourseEnrollmentResponse,
  InstructorRequest,
  QuizLearningResponse,
  QuizResultResponse,
  QuizSubmissionRequest,
  RegistrationCreatingRequest,
  ReviewRequest,
  ReviewResponse,
} from "../@types/student.types";
import { data } from "react-router-dom";

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

  // learning

  getCourseByStudent: async (
    slug: string,
  ): Promise<ResponseData<CourseEnrollmentDetailsResponse>> => {
    return axiosClient.get(`/courses/learning/${slug}/details`);
  },

  learnVideo: async (
    slug: string,
    lessonId: string,
  ): Promise<ResponseData<string>> => {
    return axiosClient.get(`/learning/course/${slug}/video/${lessonId}`);
  },

  learnLecture: async (
    slug: string,
    lessonId: string,
  ): Promise<ResponseData<string>> => {
    return axiosClient.get(`/learning/course/${slug}/lecture/${lessonId}`);
  },

  learnQuiz: async (
    slug: string,
    lessonId: string,
  ): Promise<ResponseData<QuizLearningResponse>> => {
    return axiosClient.get(`/learning/course/${slug}/quiz/${lessonId}`);
  },

  submitQuiz: async (
    slug: string,
    data: QuizSubmissionRequest,
  ): Promise<ResponseData<number>> => {
    return axiosClient.post(`/courses/learning/${slug}/submit-quiz`, data);
  },
  // course

  getCourses: async (): Promise<ResponseData<CourseEnrollmentResponse[]>> => {
    return axiosClient.get("/courses/my-courses");
  },

  getQuizResults: async (
    slug: string,
  ): Promise<ResponseData<QuizResultResponse[]>> => {
    return axiosClient.get(`/courses/learning/${slug}/quiz-result`);
  },

  // reviews

  createReview: async (
    data: ReviewRequest,
    slug: string,
  ): Promise<ResponseData> => {
    return axiosClient.post(`reviews/course/${slug}/new`, data);
  },

  updateReview: async (
    data: ReviewRequest,
    slug: string,
  ): Promise<ResponseData> => {
    return axiosClient.post(`reviews/course/${slug}/update`, data);
  },

  getReviewByStudent: async (
    slug: string,
  ): Promise<ResponseData<ReviewResponse>> => {
    return axiosClient.get(`reviews/course/${slug}/student`);
  },

  getReviews: async (slug: string): Promise<ResponseData<ReviewResponse[]>> => {
    return axiosClient.get(`reviews/course/${slug}/all`);
  },
};
