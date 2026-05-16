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

export interface InstructorLessonDetailResponse {
  id: string;
  title: string;
  lessonType: "QUIZ" | "VIDEO" | "TEXT";
  preview: boolean;
  hasResource: boolean;
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
  status:
    | "PENDING"
    | "READY"
    | "FAILURE"
    | "VALIDATING"
    | "PENDING_REVIEW"
    | "DELETED";
  duration: number;
  size: number;
}

export interface InstructorLectureResponse {
  id: string;
  title: string;
  status: "APPROVED" | "PENDING_REVIEW" | "VALIDATING" | "DELETED";
  size: number;
}

export interface ResourcePreviewResponse {
  url: string;
  title: string;
}

// Quiz

export interface QuizCreatingRequest {
  title: string;
}

export interface QuizUpdatingRequest {
  id: string;
  title: string;
  type: "TEST" | "EXAM";
}

export interface AddQuizQuestionRequest {
  quizId: string;
  questionId: string;
}

export interface RemoveQuizQuestionRequest {
  quizId: string;
  quizQuestionId: string;
}

export interface QuizResponse {
  id: string;
  title: string;
  totalQuestions: number;
  status: "PUBLISHED" | "DRAFT";
  type: "TEST" | "EXAM";
  questions: QuizQuestionResponse[];
}

export interface QuizQuestionResponse {
  id: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  answers: QuestionAnswerResponse[];
}

export interface QuestionAnswerResponse {
  answer: string;
  correct: boolean;
}

// add Resource For Lesson

export interface SelectLectureResponse {
  lectureId: string;
  title: string;
}

export interface SelectVideoResponse {
  videoId: string;
  title: string;
}

export interface SelectQuizResponse {
  quizId: string;
  title: string;
  type: "TEST" | "EXAM";
}

export interface AddResourceForLesson {
  courseId: string;
  lessonId: string;
  resourceId: string;
  type: "VIDEO" | "TEXT" | "QUIZ";
}

export interface RemoveResourceForLesson {
  courseId: string;
  lessonId: string;
}

// statistics

export interface InstructorCourseStatisticsOverviewResponse {
  totalStudents: number;
  totalVideos: number;
  totalLectures: number;
  totalTests: number;
  totalExams: number;

  totalReviews: number;
  averageRating: number;

  scoreTestDistribution: Record<number, number>;
  scoreExamDistribution: Record<number, number>;
}

export interface InstructorQuizStatisticsResponse {
  quiz: InstructorQuizResponse;
  versions: number[];
}

export interface InstructorQuizResponse {
  quizId: string;
  title: string;
  totalSubmissions: number;
  type: "TEST" | "EXAM";
  averageScore: number;
}

export interface ExportQuizSubmissionRequest {
  quizId: string;
  versionNumber: number;
}
