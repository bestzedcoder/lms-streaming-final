import axiosClient from "../config/axiosClient.config";
import type { ResponseData } from "../types/common.types";
import type {
  InstructorInfoResponse,
  InstructorUpdateRequest,
} from "../types/instructor.types";

export const instructorService = {
  checkInfo: async (): Promise<ResponseData<boolean>> => {
    return axiosClient.get("/instructor/check-info");
  },

  getInfo: async (): Promise<ResponseData<InstructorInfoResponse>> => {
    return axiosClient.get("/instructor");
  },

  updateInfo: async (data: InstructorUpdateRequest): Promise<ResponseData> => {
    return axiosClient.post("/instructor", data);
  },
};
