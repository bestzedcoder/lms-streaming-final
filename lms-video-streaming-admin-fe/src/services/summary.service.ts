import type { ResponseData } from "../@types/common.type";
import type {
  SummaryDashboardResponse,
  SummaryMonthlyRevenueResponse,
} from "../@types/summary.type";
import axiosClient from "../api/axiosClient";

export const summaryService = {
  getSummaryDashboard: async (): Promise<
    ResponseData<SummaryDashboardResponse>
  > => {
    return axiosClient.get("/admin/summary/dashboard");
  },

  getSummaryMonthlyRevenue: async (): Promise<
    ResponseData<SummaryMonthlyRevenueResponse[]>
  > => {
    return axiosClient.get("/admin/summary/monthly");
  },
};
