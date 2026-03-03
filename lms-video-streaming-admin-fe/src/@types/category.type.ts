export interface AdminCategoryCreatingRequest {
  name: string;
  slug: string;
  icon?: string;
}

export interface AdminCategoryUpdatingRequest {
  name: string;
  slug: string;
  icon?: string;
}

export interface AdminCategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}
