export interface CoursePendingResponse {
  courseId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  nickname: string;
  instructorPhone: string;
  instructorEmail: string;
}

export interface CourseOfInstructorResponse {
  courseId: string;
  title: string;
  slug: string;
  status: "PUBLISHED" | "PENDING" | "PRIVATE" | "LOCKED";
  category: string;
  totalStudents: number;
}

export interface InstructorSearch {
  page?: number;
  limit?: number;
  email?: string;
}

export interface InstructorResponse {
  instructorId: string;
  email: string;
  nickname: string;
  phoneNumber: string;
  totalCourses: number;
  totalStudents: number;
}
