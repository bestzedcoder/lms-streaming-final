import type {
  AdminCategoryCreatingRequest,
  AdminCategoryResponse,
  AdminCategoryUpdatingRequest,
} from "../@types/category.type";
import type { ResponseData } from "../@types/common.type";
import axiosClient from "../api/axiosClient";

export const categoryService = {
  getCategories: async (): Promise<ResponseData<AdminCategoryResponse[]>> => {
    return axiosClient.get("/admin/categories");
  },

  createCategory: async (
    data: AdminCategoryCreatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post("/admin/categories", data);
  },

  updateCategory: async (
    id: string,
    data: AdminCategoryUpdatingRequest,
  ): Promise<ResponseData> => {
    return axiosClient.post(`/admin/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<ResponseData> => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },
};
