export interface CoursePendingResponse {
  courseId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructorName: string;
  instructorEmail: string;
}

export interface CourseOfInstructorResponse {
  courseId: string;
  title: string;
  slug: string;
  price: number;
  status: "PUBLISHED" | "PENDING" | "PRIVATE" | "LOCKED";
  category: string;
  countStudents: number;
}

export interface InstructorSearch {
  page?: number;
  limit?: number;
  email?: string;
}

export interface InstructorResponse {
  instructorId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  countCourses: number;
  countStudents: number;
}
