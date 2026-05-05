import type { CoursePublicDetailsResponse } from "./public.types";

export interface CourseAuthDetailsResponse {
  course: CoursePublicDetailsResponse;
  status: "ACTIVE" | "BANNED";
  hasAccess: boolean;
}

// request

export interface InstructorRequest {
  message?: string;
}

// registration

export interface RegistrationCreatingRequest {
  slug: string;
  message?: string;
}

// learning

export interface CourseEnrollmentDetailsResponse {
  title: string;
  slug: string;
  description?: string;
  sections: SectionEnrollmentDetailsResponse[];
}

export interface SectionEnrollmentDetailsResponse {
  title: string;
  lessons: LessonEnrollmentDetailsResponse[];
}

export interface LessonEnrollmentDetailsResponse {
  lessonId: string;
  title: string;
  lessonType: "TEXT" | "QUIZ" | "VIDEO";
  hasResource: boolean;
}

export interface CourseEnrollmentResponse {
  slug: string;
  title: string;
  author: string;
  thumbnail?: string;
  startTime: string;
  status: "PUBLISHED" | "PENDING" | "PRIVATE" | "LOCKED";
  active: "ACTIVE" | "BANNED";
}

export interface QuizLearningResponse {
  quizId: string;
  title: string;
  questions: QuestionLearningResponse[];
}

export interface QuestionLearningResponse {
  questionId: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  answers: AnswerLearningResponse[];
}

export interface AnswerLearningResponse {
  answerId: string;
  answer: string;
}

export interface QuizSubmissionRequest {
  quizId: string;
  questions: QuestionSubmissionRequest[];
}

export interface QuestionSubmissionRequest {
  questionId: string;
  answers: string[];
}

export interface QuizResultResponse {
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  time: string;
}

export interface ReviewRequest {
  rate: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  content: string;
}

export interface ReviewResponse {
  fullName: string;
  rate: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  content: string;
  time: string;
}
