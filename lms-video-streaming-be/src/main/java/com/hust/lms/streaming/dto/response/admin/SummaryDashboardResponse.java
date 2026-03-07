package com.hust.lms.streaming.dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SummaryDashboardResponse {
  private long totalStudents;
  private long totalTeachers;
  private long totalCourses;
  private long totalRevenues;
}
