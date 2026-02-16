import type {
  CategoryPublicResponse,
  UserPublicResponse,
} from "./public.types";

export interface InstructorInfoResponse {
  title: string;
  bio: string;
  totalStudents: number;
  totalCourses: number;
  createdAt: string;
  updatedAt: string;
  certificates?: string[];
  socialLinks?: {
    website?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface InstructorUpdateRequest {
  title: string;
  bio: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface CourseCreatingRequest {
  title: string;
  slug: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  categorySlug: string;
}

export interface CourseUpdatingRequest {
  id: string;
  title: string;
  description: string;
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
  isPreview: boolean;
}

export interface LessonUpdatingRequest {
  lessonId: string;
  sectionId: string;
  courseId: string;
  title: string;
  lessonType: "QUIZ" | "VIDEO" | "TEXT";
  isPreview: boolean;
}

export interface LessonCancelRequest {
  courseId: string;
  sectionId: string;
  lessonId: string;
}

export interface CourseStatusRequest {
  id: string;
  status: "PUBLISHED" | "PRIVATE";
}

// Response

export interface InstructorCourseResponse {
  id: string;
  title: string;
  description: string;
  price?: number;
  salePrice?: number;
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
  students: UserPublicResponse[];
  reviews: ReviewCourseResponse[];
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
  countLessons: number;
  lessons: InstructorLessonResponse[];
}

export interface InstructorLessonResponse {
  id: string;
  title: string;
  lessonType: "QUIZ" | "VIDEO" | "TEXT";
  isPreview: boolean;
}
