export interface CategoryPublicResponse {
  id: string;
  name: string;
  slug: string;
}

export interface UserPublicResponse {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export interface CoursePublicResponse {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  descriptionShort?: string;
  thumbnail?: string;
  instructorName: string;
  categorySlug: string;
  averageRating: number;
  countLesson: number;
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
  price: number;
  salePrice: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  averageRating: number;
  countRating: number;
  countStudents: number;
  totalSections: number;
  totalLessons: number;
  reviews: ReviewPublicResponse[];
  sections: SectionPublicResponse[];
  instructor: InstructorPublicResponse;
  updatedAt: string;
}

export interface InstructorPublicResponse {
  fullName: string;
  title: string;
  bio: string;
  totalCourses: number;
  avatarUrl?: string;
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
  user: string;
}
