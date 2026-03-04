export interface AdminCategoryCreatingRequest {
  name: string;
  slug: string;
  icon?: string;
}

export interface AdminCategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  countCourses: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}
