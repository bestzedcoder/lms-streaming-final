export interface SummaryDashboardResponse {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalRevenues: number;
}

export interface SummaryMonthlyRevenueResponse {
  time: string;
  revenue: number;
}
