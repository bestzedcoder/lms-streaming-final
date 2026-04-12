import type {
  CategoryPublicResponse,
  UserPublicResponse,
} from "./public.types";

export interface InstructorInfoResponse {
  nickname: string;
  jobTitle: string;
  bio: string;
  totalStudents: number;
  totalCourses: number;
}

export interface InstructorUpdateRequest {
  nickname: string;
  jobTitle: string;
  bio: string;
}

export interface CourseCreatingRequest {
  title: string;
  slug: string;
  description: string;
  descriptionShort?: string;
  requirements?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  categorySlug: string;
}

export interface CourseUpdatingRequest {
  id: string;
  title: string;
  description: string;
  descriptionShort?: string;
  requirements?: string;
  price: number;
  salePrice?: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface SectionCreatingRequest {
  courseId: string;
  title: string;
  descriptionShort: string;
}

export interface SectionUpdatingRequest {
  courseId: string;
  sectionId: string;
  title: string;
  descriptionShort: string;
}

export interface SectionCancelRequest {
  courseId: string;
  sectionId: string;
}

export interface LessonCreatingRequest {
  courseId: string;
  sectionId: string;
  title: string;
  lessonType: "QUIZ" | "VIDEO" | "TEXT";
  preview: boolean;
}

export interface LessonUpdatingRequest {
  lessonId: string;
  sectionId: string;
  courseId: string;
  title: string;
  lessonType: "QUIZ" | "VIDEO" | "TEXT";
  preview: boolean;
}

export interface LessonCancelRequest {
  courseId: string;
  sectionId: string;
  lessonId: string;
}

// Response

export interface InstructorCourseResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  descriptionShort?: string;
  requirements?: string;
  thumbnail?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "PUBLISHED" | "PRIVATE" | "LOCKED" | "PENDING";
  averageRating?: number;
  countRating?: number;
  category: CategoryPublicResponse;
  totalSections: number;
  totalLessons: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface InstructorCourseDetailsResponse {
  course: InstructorCourseResponse;
  sections: InstructorSectionResponse[];
}

export interface InstructorCourseInfoResponse {
  course: InstructorCourseResponse;
  students: InstructorCourseParticipantResponse[];
  reviews: ReviewCourseResponse[];
}

export interface InstructorCourseParticipantResponse {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  status: "ACTIVE" | "BANNED";
}

export interface ReviewCourseResponse {
  id: string;
  rate: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  content: string;
  user: ReviewUserResponse;
}

export interface ReviewUserResponse {
  email: string;
  avatarUrl?: string;
}

export interface InstructorSectionResponse {
  id: string;
  title: string;
  descriptionShort: string;
  totalLessons: number;
  lessons: InstructorLessonResponse[];
}

export interface InstructorLessonResponse {
  id: string;
  title: string;
  lessonType: "QUIZ" | "VIDEO" | "TEXT";
  preview: boolean;
}

// registration

export interface RegistrationResponse {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  student: UserPublicResponse;
  course: CoursePublicRegistrationResponse;
}

export interface CoursePublicRegistrationResponse {
  title: string;
  status: "PUBLISHED" | "PENDING" | "PRIVATE" | "LOCKED";
  thumbnail?: string;
}

export interface RegistrationProcessingRequest {
  registrationId: string;
  message?: string;
}

// enrollments

export interface BannedEnrollment {
  userId: string;
  courseId: string;
  reason?: string;
}

export interface ActiveEnrollment {
  userId: string;
  courseId: string;
}

// questions

export interface QuestionCategoryResponse {
  id: string;
  name: string;
  totalQuestions: number;
}

export interface QuestionCategoryCreatingRequest {
  name: string;
}

export interface QuestionCategoryUpdatingRequest {
  categoryId: string;
  name: string;
}

export interface QuestionResponse {
  id: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  options: OptionResponse[];
}

export interface OptionResponse {
  id: string;
  answer: string;
  correct: boolean;
}

export interface QuestionCreatingRequest {
  categoryId: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  options: OptionCreatingRequest[];
}

export interface OptionCreatingRequest {
  answer: string;
  correct: boolean;
}

export interface QuestionUpdatingResponse {
  id: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  options: OptionCreatingRequest[];
}

export interface QuestionQuery {
  q: string;
}

// upload file

export interface UploadFileRequest {
  fileName: string;
}

export interface UploadFileResponse {
  presignedUrl: string;
  fileKey: string;
}

export interface MultipartCompleteRequest {
  uploadId: string;
  fileKey: string;
  parts: PartETagDTO[];
}

export interface PartETagDTO {
  partNumber: number;
  eTag: string;
}

export interface MultipartInitRequest {
  fileName: string;
  totalParts: number;
}

export interface MultipartInitResponse {
  uploadId: string;
  fileKey: string;
  presignedUrls: string[];
}

export interface VideoCreatingRequest {
  fileKey: string;
  title: string;
  duration: number;
  size: number;
}

export interface ResourceCreatingRequest {
  fileKey: string;
  title: string;
  size: number;
}

export interface VideoUpdatingRequest {
  videoId: string;
  title: string;
}

export interface ResourceUpdatingRequest {
  resourceId: string;
  title: string;
}

export interface InstructorVideoResponse {
  id: string;
  title: string;
  thumbnail?: string;
  status: "PENDING" | "READY" | "FAILURE" | "PENDING_REVIEW" | "DELETED";
  duration: number;
  size: number;
}

export interface InstructorLectureResponse {
  id: string;
  title: string;
  status: "APPROVED" | "PENDING_REVIEW" | "DELETED";
  size: number;
}

export interface ResourcePreviewResponse {
  url: string;
  title: string;
}
