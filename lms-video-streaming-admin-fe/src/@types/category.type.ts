export interface AdminCategoryCreatingRequest {
  name: string;
  slug: string;
}

export interface AdminCategoryResponse {
  id: string;
  name: string;
  slug: string;
  totalCourses: number;
  createdAt: string;
}
