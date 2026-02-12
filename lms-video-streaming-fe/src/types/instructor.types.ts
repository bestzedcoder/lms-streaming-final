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
