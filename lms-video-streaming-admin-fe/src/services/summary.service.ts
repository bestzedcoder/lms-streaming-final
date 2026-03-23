import type { ResponseData } from "../@types/common.type";
import type { SummaryDashboardResponse } from "../@types/summary.type";
import axiosClient from "../api/axiosClient";

export const summaryService = {
  getSummaryDashboard: async (): Promise<
    ResponseData<SummaryDashboardResponse>
  > => {
    return axiosClient.get("/admin/summary/dashboard");
  },
};
