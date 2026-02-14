import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../types/common.types";
import type { CategoryPublicResponse } from "../types/public.types";

export const publicService = {
  getCategories: async (): Promise<ResponseData<CategoryPublicResponse[]>> => {
    return axiosClient.get("/public/categories");
  },
};
