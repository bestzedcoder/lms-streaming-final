export interface InstructorRequestResponse {
  id: string;
  title: string;
  description?: string;
  type: "TEACHER_REQUEST" | "COURSE_REPORT";
  status: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
}

export interface CourseRequestResponse {
  id: string;
  title: string;
  report?: string;
  type: "TEACHER_REQUEST" | "COURSE_REPORT";
  status: boolean;
  targetId: string;
}
