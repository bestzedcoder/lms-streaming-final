export interface CategoryPublicResponse {
  name: string;
  slug: string;
}

export interface UserPublicResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface CoursePublicResponse {
  id: string;
  title: string;
  slug: string;
  descriptionShort?: string;
  thumbnail?: string;
  nickname: string;
  categorySlug: string;
  averageRating: number;
  totalLessons: number;
}

export interface CourseSearchParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
}

// course details

export interface CoursePublicDetailsResponse {
  title: string;
  slug: string;
  descriptionShort?: string;
  description: string;
  requirements?: string;
  thumbnail?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  averageRating: number;
  countRating: number;
  totalStudents: number;
  totalSections: number;
  totalLessons: number;
  reviews: ReviewPublicResponse[];
  sections: SectionPublicResponse[];
  instructor: InstructorPublicResponse;
  updatedAt: string;
}

export interface InstructorPublicResponse {
  nickname: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  totalCourses: number;
  totalStudents: number;
}

export interface SectionPublicResponse {
  title: string;
  descriptionShort: string;
  lessons: LessonPublicResponse[];
}

export interface LessonPublicResponse {
  title: string;
  lessonType: "QUIZ" | "VIDEO" | "TEXT";
}

export interface ReviewPublicResponse {
  content: string;
  rating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  fullName: string;
}
